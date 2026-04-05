import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { generateRandomCode } from '@app/core/util';
import { workflowProcesses } from '@app/workflow/config/workflow.config';
import { ConfigService } from '@nestjs/config';
import {
  deleteStoredGroups,
  getAdminTokenKey,
  getGroupStorageKey,
  getUserTokenKey,
  workflowAppModuleMapping,
} from '@app/workflow/utils';
// import { RegistrationCertificate } from '@app/registration-certificate/entities/registration-certificate.entity';
// import { NcecApplication } from '@app/ncec/entities/ncec.entity';
// import { NcrcApplication } from '@app/ncrc/entities/ncrc.entity';
// import { MarineVesselApplication } from '@app/marine-vessel/entities/marine-vessel.entity';
import { EntityManager, ILike, In } from 'typeorm';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// import { EQApplication } from '@app/expatriate-quota/entities/eq-app.entity';
// import { TWPApplication } from '@app/temporary-work-permit/entities/twp-app.entity';
// import { EPApplication } from '@app/exchange-program/entities/ep-app.entity';
import { WorkflowPasswordProvider } from '@app/workflow/providers';
import {
  CustomBadRequestException,
  CustomForbiddenException,
  CustomNotFoundException,
  WorkFlowException,
} from '@app/core/error';
import { LoggerService } from '@app/logger';
import { StringHelper } from '@app/core/helpers';
import { User } from '@app/user/entities/user.entity';
import type { BatchReassignPayload } from '@app/workflow/interfaces';
import { BaseService } from '@app/core/base/base.service';
import { AccountTypeEnum } from '@app/account/enums';
import { APP_REDIS } from '@app/redis/constants';
import IORedis from 'ioredis';
import { InjectRedisConnection } from '@app/redis/decorators';
import { AuditLogService } from '@app/audit-log/audit-log.service';
import { AuditAction, EntityType } from '@app/audit-log/enum';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { AbilityFactory } from '@app/iam/authorization/permission.ability.factory';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '@app/iam/enum/permission.enum';

interface ApiRequest {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  token?: string | Promise<string> | null;
}

interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  workflowGroups?: any;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

const TEN_MINUTES_IN_SECONDS = 10 * 60;

@Injectable()
export class WorkflowService {
  constructor(
    private readonly entityManager: EntityManager,
    private httpService: HttpService,
    private configService: ConfigService,
    private workflowPasswordProvider: WorkflowPasswordProvider,
    @InjectRedisConnection(APP_REDIS)
    private redis: IORedis,
    private readonly loggerService: LoggerService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async authenticate(
    username: string,
    password: string,
  ): Promise<TokenResponse> {
    const server = this.configService.getOrThrow('PM_SERVER');
    const workspace = this.configService.getOrThrow('PM_WORKSPACE');
    const clientId = this.configService.getOrThrow('PM_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('PM_CLIENT_SECRET');
    const decryptedPassword = this.workflowPasswordProvider.decrypt(password);
    const url = `${server}/${workspace}/oauth2/token`;

    return await lastValueFrom(
      this.httpService
        .post(url, {
          grant_type: 'password',
          scope: '*',
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: decryptedPassword,
        })
        .pipe(map((response: any) => response.data)),
    );
  }

  async login(username: string, password: string): Promise<string> {
    const tokenKey = getUserTokenKey(username);
    const storedToken = await this.redis.get(tokenKey);
    if (storedToken) return storedToken;

    const { access_token: token, expires_in: expiresIn } =
      await this.authenticate(username, password);

    const tokenTTL = expiresIn - TEN_MINUTES_IN_SECONDS;
    this.redis.setex(tokenKey, tokenTTL, token);

    return token;
  }

  async adminLogin() {
    const tokenKey = getAdminTokenKey();
    const storedToken = await this.redis.get(tokenKey);
    if (storedToken) return storedToken;

    const username = this.configService.getOrThrow('PM_USERNAME');
    const password = this.workflowPasswordProvider.encrypt(
      this.configService.getOrThrow('PM_PASSWORD'),
    );

    const { access_token: token, expires_in: expiresIn } =
      await this.authenticate(username, password);

    const tokenTTL = expiresIn - TEN_MINUTES_IN_SECONDS;
    this.redis.setex(tokenKey, tokenTTL, token);

    return token;
  }

  async clearToken(username: string) {
    return await this.redis.del(getUserTokenKey(username));
  }

  async apiRequest({ url, method = 'GET', data = {}, token }: ApiRequest) {
    if (!token) token = await this.adminLogin();

    const server = this.configService.getOrThrow('PM_SERVER');
    const workspace = this.configService.getOrThrow('PM_WORKSPACE');

    url = `${server}/api/1.0/${workspace}/${url}`;

    return await lastValueFrom(
      this.httpService
        .request({
          url: url,
          method: method,
          data: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(map((response: any) => response.data)),
    );
  }

  async createUser({
    firstName,
    lastName,
    email,
    password,
    workflowGroups = [],
  }: CreateUserDto) {
    password = password || generateRandomCode(10);
    const wfUserPassword = this.workflowPasswordProvider.encrypt(password);

    const data = {
      usr_username: email,
      usr_firstname: firstName,
      usr_lastname: lastName,
      usr_email: email,
      usr_new_pass: password,
      usr_cnf_pass: password,
      usr_due_date: '2050-12-31',
      usr_status: 'ACTIVE',
      usr_role: 'PROCESSMAKER_OPERATOR',
    };

    let wfUserId = null;

    try {
      const { USR_UID }: any = await this.apiRequest({
        url: 'users',
        method: 'POST',
        data,
      });

      wfUserId = USR_UID;

      try {
        const defaultGroupId = '697998046545b6b7b391d16080595994';

        const providedGroupIds = Array.isArray(workflowGroups)
          ? workflowGroups.map((group: any) => group.id).filter((id) => !!id)
          : [];

        const uniqueGroupIds = [
          ...new Set([defaultGroupId, ...providedGroupIds]),
        ];

        await Promise.all(
          uniqueGroupIds.map((groupId) =>
            this.assignUserToGroup(wfUserId, groupId).catch((err) =>
              this.loggerService.error(
                `Failed to assign user ${wfUserId} to group ${groupId}`,
                err,
                'WorkflowService.createUser',
              ),
            ),
          ),
        );
      } catch (e: any) {
        this.loggerService.error(
          'Error assigning user to group',
          e,
          'WorkflowService.createUser',
        );
      }
    } catch (e: any) {
      const error = e?.response?.data?.error?.message;
      if (error && error.includes('already exists')) {
        const users: any = await this.getUsers(email);
        if (users?.length) {
          const user = users[0];
          await this.updateUser(user?.usr_uid, {
            usr_new_pass: password,
            usr_cnf_pass: password,
          });
          wfUserId = user?.usr_uid;
        }
      } else {
        this.handleException(e);
      }
    }

    return { wfUserId, wfUserPassword };
  }

  async updateUser(userId, data) {
    try {
      return await this.apiRequest({
        url: `users/${userId}`,
        method: 'PUT',
        data,
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async syncUser(userId) {
    try {
      const user = await this.entityManager.findOne(User, {
        where: { id: +userId },
        relations: {
          accounts: true,
          roles: true,
        },
      });

      if (!user) throw new CustomNotFoundException('User not found');

      const { wfUserId, wfUserPassword } = await this.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      if (wfUserId) {
        await this.entityManager.update(
          User,
          { id: +userId },
          {
            wfUserId,
            wfUserPassword,
          },
        );
      }
    } catch (e) {
      this.handleException(e);
    }
  }

  async getUser(userId) {
    try {
      const user = await this.entityManager.findOne(User, {
        where: { id: +userId },
        relations: {
          accounts: true,
          roles: true,
        },
      });

      if (!user) throw new CustomNotFoundException('User not found');

      await this.apiRequest({
        url: `users/${user.wfUserId}`,
      });

      if (!user.wfUserPassword)
        throw new CustomNotFoundException('User password not found');

      await this.login(user.email, user.wfUserPassword);
    } catch (e) {
      if (e instanceof CustomNotFoundException) throw e;

      this.handleException(e);
    }
  }

  async getUsers(filter = '') {
    try {
      return await this.apiRequest({
        url: filter ? `users?filter=${encodeURIComponent(filter)}` : 'users',
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async assignUserToGroup(userId, groupId) {
    try {
      const result = await this.apiRequest({
        url: `group/${groupId}/user`,
        method: 'POST',
        data: {
          usr_uid: userId,
        },
      });
      await deleteStoredGroups(this.redis);
      return result;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getGroups(filter = '', start = 0, limit = 1000) {
    try {
      const url = filter
        ? `groups?filter=${encodeURIComponent(filter)}&start=${start}&limit=${limit}`
        : `groups?start=${start}&limit=${limit}`;

      const storageKey = getGroupStorageKey(filter, start, limit);

      const stored = await this.redis.get(storageKey);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed;
        } catch (e) {
          await deleteStoredGroups(this.redis);
        }
      }

      const groups = await this.apiRequest({
        url: url,
      });

      this.redis.set(storageKey, JSON.stringify(groups), 'EX', 3600);

      return groups;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getUserById(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    return {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      wfUserId: user?.wfUserId,
    };
  }

  async getGroupUsers(groupId, filter = '', start = 0, limit = 100) {
    try {
      const url = filter
        ? `group/${groupId}/users?filter=${encodeURIComponent(
            filter,
          )}&start=${start}&limit=${limit}`
        : `group/${groupId}/users?start=${start}&limit=${limit}`;

      const groups: any = await this.apiRequest({
        url: url,
      });

      if (!groups || !Array.isArray(groups))
        return { meta: { totalCount: 0, page: start, limit }, data: [] };

      const usersPromises = groups.map(async (group: any) => {
        const user = await this.entityManager.findOne(User, {
          where: { wfUserId: group?.usr_uid } as any,
          relations: {
            accounts: true,
          },
        });

        return {
          wfUserId: group?.usr_uid,
          id: user?.id,
          accountId: user?.accounts[0]?.id,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
        };
      });

      const users = await Promise.all(usersPromises);

      return {
        meta: {
          totalCount: (groups as any).total || groups.length || 0,
          page: (groups as any).start || start,
          limit: (groups as any).limit || limit,
        },
        data: users,
      };
    } catch (e) {
      this.handleException(e);
    }
  }

  async start(module, data, user) {
    try {
      const { processId, startTaskId } = workflowProcesses[module];
      const { wfUserPassword, wfUserId, email } = user;

      const token = await this.login(email, wfUserPassword);

      const workflowCase: any = await this.apiRequest({
        url: `cases/impersonate`,
        method: 'POST',
        data: {
          pro_uid: processId,
          tas_uid: startTaskId,
          usr_uid: wfUserId,
          variables: [
            {
              SUBMITTER: wfUserId,
              MODULE: module,
              NOGIC_HOST: this.configService.getOrThrow('PM_SERVER'),
              ...data,
            },
          ],
        },
      });

      const caseId = workflowCase.app_uid;

      await this.routeCase(caseId, token);

      return caseId;
    } catch (e) {
      this.handleException(e);
    }
  }

  async resume(caseId, data, user) {
    try {
      const { wfUserPassword, email } = user;

      const token = await this.login(email, wfUserPassword);

      const wfCase: any = await this.getRawCase(caseId, token);

      const delIndex = wfCase?.current_task[0]?.del_index;

      this.loggerService.log('wfCase', StringHelper.stringify(wfCase));

      await this.setCaseVariables(caseId, parseInt(delIndex, 10), data, token);

      await this.routeCase(caseId, token);

      return caseId;
    } catch (e) {
      this.handleException(e);
    }
  }

  async setCaseVariables(caseId, delIndex, variables, token) {
    return await this.apiRequest({
      url: `cases/${caseId}/variable?del_index=${delIndex}`,
      method: 'PUT',
      data: variables,
      token,
    });
  }

  async routeCase(caseId, token) {
    return await this.apiRequest({
      url: `cases/${caseId}/route-case`,
      method: 'PUT',
      data: {
        del_index: '',
      },
      token,
    });
  }

  async getCases({
    type = 'PENDING',
    start = 0,
    limit = 5,
    currentUser,
    userId,
    page,
    raw = false,
    module = 'ALL',
  }) {
    const isAgencyAccount =
      currentUser?.account?.type === AccountTypeEnum.AGENCY;

    if (!isAgencyAccount && (userId || type === 'PARTICIPATED')) {
      throw new CustomForbiddenException();
    }

    try {
      let queryString = `start=${start}&limit=${limit}&sort=APP_UPDATE_DATE`;

      if (module && module !== 'ALL') {
        const { processId } = workflowProcesses[module];

        queryString = queryString + `&pro_uid=${processId}`;
      }

      let url = `cases/paged?${queryString}`;

      if (type === 'PARTICIPATED')
        url = `cases/participated/paged?${queryString}`;

      if (type === 'CANCELLED')
        url = `cases/advanced-search/paged?app_status=CANCELLED&start=${start}&limit=${limit}&sort=APP_UPDATE_DATE`;

      if (type === 'UNASSIGNED') url = `cases/unassigned/paged?${queryString}`;

      if (userId) {
        currentUser = await this.entityManager.findOne(User, {
          where: { id: +userId },
          relations: {
            accounts: true,
            roles: true,
          },
        });
      }

      const token = await this.login(
        currentUser.email,
        currentUser.wfUserPassword,
      );

      const workflowCases: any = await this.apiRequest({
        url,
        token,
      });

      const cases = workflowCases?.data || [];

      if (raw) return cases;

      const processedCases = [];
      for (const item of cases) {
        processedCases.push(await this.processCase(item, type, token));
      }

      return {
        meta: {
          totalCount: workflowCases?.total,
          page,
          limit,
        },
        data: processedCases,
      };
    } catch (e) {
      return {
        meta: {
          totalCount: 0,
          page,
          limit,
        },
        data: [],
      };
    }
  }

  async processCase(item: any, type: string, token: string) {
    const {
      app_uid,
      pro_uid,
      tas_uid,
      app_update_date,
      app_tas_title,
      app_status,
      usr_firstname,
      usr_lastname,
      usr_username,
      previous_usr_username,
      del_index,
    } = item;

    let variables;

    try {
      if (type !== 'UNASSIGNED') {
        variables = await this.getCaseVariables(app_uid, token);
      }

      if (type === 'UNASSIGNED') {
        const prevUser = await this.entityManager.findOneBy(User, {
          email: previous_usr_username,
        });

        if (prevUser) {
          const prevToken = await this.login(
            prevUser.email,
            prevUser.wfUserPassword,
          );

          try {
            variables = await this.getCaseVariables(app_uid, prevToken);
          } catch (error: any) {
            this.loggerService.error(
              `Error fetching variables for unassigned case ${app_uid}`,
              error,
            );
          }
        }
      }

      let appCompany = variables?.APP_COMPANY;
      let appNumber = variables?.APP_NUMBER;
      const submissionType = variables?.SUBMISSION_TYPE || 'NEW';
      let appId = variables?.APP_ID;
      let module = variables?.MODULE;

      if (variables?.OTHER_INFO) {
        let match = variables?.OTHER_INFO?.match(
          /([^()]+)\s\(([^()]+)\)(\s-\s(.*))?/,
        );

        if (variables?.OTHER_INFO?.includes('EQ')) {
          match = variables?.OTHER_INFO?.match(/(.+)\s-\s(.+)/);
        }

        if (match) {
          appCompany = match[1].trim();
          appNumber = match[2];
          //submissionType = match[3] ? match[3] : 'NEW';
        }
      }

      if (variables?.NEXT_URL) {
        try {
          const url = new URL(variables?.NEXT_URL);
          const segments = url?.pathname?.split('/');
          const segmentLength = segments?.length || 0;

          if (segmentLength) {
            appId = segments[segmentLength - 1];

            let migratedModule = segments[segmentLength - 2];
            if (!migratedModule?.includes('certificate')) {
              migratedModule = segments[segmentLength - 3];
            }

            if (appId.includes('certificate')) {
              migratedModule = appId;
            }

            if (workflowAppModuleMapping[migratedModule])
              module = workflowAppModuleMapping[migratedModule];

            // switch (module) {
            //   case 'REGISTRATION_CERTIFICATE':
            //     appId = (
            //       await this.entityManager.findOne(RegistrationCertificate, {
            //         where: { appNumber },
            //       } as any)
            //     )?.id;
            //     break;
            //   case 'NCEC': {
            //     const appNumberMatch = appNumber ? appNumber.split('/') : [];
            //     const appNumberSearch =
            //       appNumberMatch.length >= 3
            //         ? `${appNumberMatch[0]}/${appNumberMatch[1]}/${appNumberMatch[2]}`
            //         : null;

            //     let app = await this.entityManager.findOne(NcecApplication, {
            //       where: { oldId: appId },
            //     } as any);

            //     if (!app && appNumberSearch) {
            //       app = await this.entityManager.findOne(NcecApplication, {
            //         where: {
            //           appNumber: ILike(`%${appNumberSearch}%`),
            //         },
            //         order: {
            //           createdAt: 'desc',
            //         },
            //       } as any);
            //     }

            //     appId = app?.id;
            //     break;
            //   }
            //   case 'NCRC':
            //     appId = (
            //       await this.entityManager.findOne(NcrcApplication, {
            //         where: { appNumber },
            //       } as any)
            //     )?.id;
            //     break;
            //   case 'MARINE_VESSEL':
            //     appId = (
            //       await this.entityManager.findOne(MarineVesselApplication, {
            //         where: { appNumber },
            //       } as any)
            //     )?.id;
            //     break;
            //   case 'EXPATRIATE_QUOTA':
            //     appId = (
            //       await this.entityManager.findOne(EQApplication, {
            //         where: { appNumber },
            //       } as any)
            //     )?.id;
            //     break;
            //   case 'TWP':
            //     appId = (
            //       await this.entityManager.findOne(TWPApplication, {
            //         where: { appNumber },
            //       } as any)
            //     )?.id;
            //     break;
            //   case 'EXCHANGE_PROGRAM':
            //     appId = (
            //       await this.entityManager.findOne(EPApplication, {
            //         where: { appNumber },
            //       } as any)
            //     )?.id;
            //     break;
            //   default:
            //     appId = null;
            // }
          }
        } catch (e: any) {
          this.loggerService.error(`Invalid NEXT_URL for case ${app_uid}`, e);
        }
      }

      return {
        taskType: type,
        caseId: app_uid,
        id: app_uid,
        processId: pro_uid,
        taskId: tas_uid,
        assignedDate: app_update_date,
        currentStage: app_tas_title,
        currentUserFirstName: usr_firstname,
        currentUserLastName: usr_lastname,
        currentUserEmail: usr_username,
        module,
        appNumber,
        appCompany,
        appId,
        submissionType,
        caseCommand: variables?.COMMAND,
        appOtherInfo: variables?.APP_OTHER_INFO,
        status: app_status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
        delIndex: del_index,
      };
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        this.loggerService.error(
          `Access forbidden for case ${app_uid}: ${error.message}`,
          error,
        );
        return {
          taskType: type,
          caseId: app_uid,
          status: 'FORBIDDEN',
          errorMessage: 'Access denied. Please check permissions.',
        };
      }
      this.loggerService.error(`Failed to process case ${item.app_uid}`, error);
      return {
        caseId: item.app_uid,
        status: 'ERROR',
        errorMessage: 'Internal processing error',
      };
    }
  }

  async getCase(caseId, user, withCurrentTaskAdhocUsers = false) {
    try {
      let currentTaskAdhocUsers: any = [];
      const { wfUserPassword, email } = user;
      const token = await this.login(email, wfUserPassword);

      let wfCase: any = await this.apiRequest({
        url: `cases/${caseId}`,
        token,
      });

      const currentTaskId = wfCase?.current_task[0]?.tas_uid;

      if (withCurrentTaskAdhocUsers && currentTaskId) {
        currentTaskAdhocUsers = await this.getAdhocUsers(
          wfCase?.pro_uid,
          currentTaskId,
          token,
        );
      }

      if (!wfCase) return null;

      wfCase = {
        //...wfCase,
        status: wfCase?.app_status,
        currentTaskUserId: wfCase?.current_task?.length
          ? wfCase?.current_task[0]?.usr_uid
          : '',
        currentTaskStage: wfCase?.current_task?.length
          ? wfCase?.current_task[0]?.tas_title
          : '',
        dateAssigned: wfCase?.app_update_date,
        dateAssignedRaw: wfCase?.app_update_date,
        currentTaskAdhocUsers,
        initialTaskUserId: wfCase?.app_init_usr_uid,
      };

      let currentTaskUser: {
        firstName?: string;
        lastName?: string;
        email?: string;
        accounts?: any[];
      } | null = {};

      let initialTaskUser: {
        firstName?: string;
        lastName?: string;
        email?: string;
        accounts?: any[];
      } | null = {};

      if (wfCase?.currentTaskUserId) {
        currentTaskUser = await this.entityManager.findOne(User, {
          where: {
            wfUserId: wfCase.currentTaskUserId,
          },
          relations: {
            accounts: {
              agency: true,
            },
          },
        });
      }

      if (wfCase?.initialTaskUserId) {
        initialTaskUser = await this.entityManager.findOne(User, {
          where: {
            wfUserId: wfCase.initialTaskUserId,
          },
          relations: {
            accounts: {
              agency: true,
            },
          },
        });

        if (initialTaskUser) {
          initialTaskUser = {
            firstName: initialTaskUser.firstName,
            lastName: initialTaskUser.lastName,
            email: initialTaskUser.email,
            accounts: initialTaskUser.accounts,
          };
        }
      }

      if (wfCase?.currentTaskAdhocUsers?.length > 0) {
        currentTaskAdhocUsers = await this.entityManager.find(User, {
          where: {
            wfUserId: In(
              wfCase?.currentTaskAdhocUsers?.map((item) => item?.aas_uid),
            ),
          },
          relations: {
            accounts: {
              agency: true,
            },
          },
        });
      }

      const dateformat = 'YYYY-MM-DD HH:mm:ss';
      dayjs.extend(customParseFormat);
      const dateAssigned = dayjs(wfCase?.dateAssigned, dateformat).format(
        'DD/MM/YYYY HH:mm:ss',
      );

      return {
        ...wfCase,
        dateAssigned,
        initialTaskUser,
        currentTaskUser:
          currentTaskUser && Object.keys(currentTaskUser).length > 0
            ? {
                firstName: currentTaskUser?.firstName,
                lastName: currentTaskUser?.lastName,
                email: currentTaskUser?.email,
                accounts: currentTaskUser?.accounts,
                position: currentTaskUser?.accounts[0]?.agency?.position,
              }
            : {},
        currentTaskAdhocUsers: currentTaskAdhocUsers
          .map((item: any) => ({
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            position: item?.accounts[0]?.agency?.position,
            wfUserId: item.wfUserId,
          }))
          .filter((item) => item.wfUserId !== wfCase.currentTaskUserId),
      };
    } catch (e) {
      this.loggerService.error(`Failed to get case details for ${caseId}`, e);
    }
  }

  async getRawCase(caseId, token) {
    try {
      const wfCase: any = await this.apiRequest({
        url: `cases/${caseId}`,
        token,
      });

      if (!wfCase) return null;

      return wfCase;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getCaseVariables(caseId, token) {
    return this.apiRequest({
      url: `cases/${caseId}/variables`,
      token,
    });
  }

  async getAdhocUsers(processId: string, taskId: string, token) {
    return await this.apiRequest({
      url: `project/${processId}/activity/${taskId}/adhoc-assignee/all`,
      token,
    });
  }

  async reassignCase(caseId: string, assigneeWfUserId: string) {
    const currentUser = BaseService.getCurrentUser();
    const { wfUserPassword, email } = currentUser;

    const token = await this.login(email, wfUserPassword);

    const assignee = await this.entityManager.findOne(User, {
      where: { wfUserId: assigneeWfUserId },
    });

    const response = await this.apiRequest({
      url: `cases/${caseId}/reassign-case`,
      method: 'PUT',
      data: {
        usr_uid_source: currentUser?.wfUserId,
        usr_uid_target: assigneeWfUserId,
      },
      token,
    });

    this.auditLogService.emitAction({
      entityId: currentUser.email,
      entityTitle: assignee.email,
      entityType: EntityType.TASK,
      changes: {
        caseId,
        assigneeWfUserId,
      },
      userId: currentUser.id,
      action: AuditAction.REASSIGN_TASKS,
      ipAddress: currentUser.ipAddress,
      origin: ExternalLinkOriginEnum.NOGIC,
    });

    return response;
  }

  /*async getWfTaskAssignee(caseId: string, currentUser: any) {
    const { wfUserPassword, email } = currentUser;
    const token = await this.login(email, wfUserPassword);
    const currentUserPosition = currentUser?.account?.agencyPosition;
    const caseInformation = await this.getCase(caseId, currentUser);
    const taskId = caseInformation?.current_task[0].tas_uid;
    const adhocUsers = await this.getAdhocUsers(
      caseInformation?.pro_uid,
      taskId,
      token,
    );
    const wfUserIds = adhocUsers.map((user) => user.aas_uid);
    const users = await this.usersDbService.findAllByIn('wfUserId', wfUserIds);
    let filterPositionsArray: string[] = [];
    const result = [];
    if (users.length > 0) {
      if (currentUserPosition !== null && currentUserPosition.code) {
        switch (currentUserPosition.code) {
          case 'SP':
            filterPositionsArray = ['SP', 'PO'];
            break;
          case 'DMGR':
            filterPositionsArray = ['MGR', 'DMGR', 'SP', 'PO'];
            break;
          case 'MGR':
            filterPositionsArray = ['DMGR', 'AMGR', 'SP', 'PO'];
            break;
          case 'GM':
            filterPositionsArray = ['MGR', 'DMGR'];
            break;
          default:
            filterPositionsArray = ['PO', 'SP'];
        }

        filterPositionsArray.push('');
      }
      for (const user of users) {
        if (currentUser.id !== user.id) {
          const position = user.account?.agencyPosition;
          if (filterPositionsArray.includes(position)) {
            result[
              user.wfUserId
            ] = `${user.firstName} ${user.lastName} ${position}`;
          }
        }
      }
    }
    return result;
  }*/
  handleException(e) {
    if (e?.response?.data?.error) {
      const message = `${e?.config?.url} - ${e?.response?.data?.error?.message}`;

      throw new WorkFlowException(message, e?.response?.status);
    }

    throw new WorkFlowException(
      e?.message,
      e?.status || e?.response?.status || 500,
    );
  }

  async claim(caseId, user, delIndex) {
    try {
      const { wfUserPassword, email } = user;
      const token = await this.login(email, wfUserPassword);

      return await this.apiRequest({
        url: `light/case/${caseId}/claim?del_index=${delIndex}`,
        method: 'POST',
        token,
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async getUnassignCases(user, caseId) {
    try {
      const { wfUserPassword, email } = user;
      const token = await this.login(email, wfUserPassword);

      const wfCases: any = await this.apiRequest({
        url: `home/unassigned`,
        token,
      });

      const wfCase = wfCases.data.find((item) => item.APP_UID === caseId);

      if (!wfCase) return null;

      return {
        delIndex: wfCase.DEL_INDEX,
        caseId: wfCase.APP_UID,
      };
    } catch (e) {
      this.handleException(e);
    }
  }

  async batchReassignCases(payload: BatchReassignPayload) {
    const { caseIds, assigneeId, ownerId } = payload;

    const currentUser = BaseService.getCurrentUser();

    if (assigneeId === ownerId) {
      throw new CustomForbiddenException(
        'You cannot reassign tasks to yourself.',
      );
    }

    AbilityFactory.hasPermission(
      currentUser,
      PermisionActionTypeEnum.REASSIGN,
      PermisionSubjectTypeEnum.WORKFLOW,
    );

    const owner = await this.entityManager.findOne(User, {
      where: { id: +ownerId },
    });

    const token = await this.login(owner.email, owner.wfUserPassword);

    const assignee = await this.entityManager.findOne(User, {
      where: { id: assigneeId },
    });

    const wfCases = await this.getCases({
      limit: 200,
      raw: true,
      currentUser,
      userId: ownerId,
      page: 1,
    });

    const transformedCases = wfCases
      .filter((item) => caseIds.includes(item.app_uid))
      .map((item) => {
        return {
          APP_UID: item.app_uid,
          DEL_INDEX: item.del_index,
        };
      });

    const data = {
      cases: transformedCases,
      usr_uid_target: assignee.wfUserId,
    };

    const response: any = await this.apiRequest({
      url: `cases/reassign`,
      method: 'POST',
      token,
      data,
    });

    const responseCases = response?.cases || [];

    if (responseCases.length > 0) {
      const hasUnassignedError = responseCases.some(
        (item) => item.STATUS === 'USER_NOT_ASSIGNED_TO_TASK',
      );

      if (hasUnassignedError)
        throw new CustomBadRequestException(
          'Tasks could not be reassigned because the user is not in the assignment pool',
        );
    }

    this.auditLogService.emitAction({
      entityId: owner.email,
      entityTitle: assignee?.email,
      entityType: EntityType.TASK,
      changes: payload,
      userId: currentUser.id,
      action: AuditAction.REASSIGN_TASKS,
      ipAddress: currentUser.ipAddress,
      origin: ExternalLinkOriginEnum.NOGIC,
    });

    return response;
  }

  async cancelCase(caseId: string, user: any) {
    try {
      const { wfUserPassword, email } = user;
      const token = await this.login(email, wfUserPassword);

      await this.apiRequest({
        url: `cases/${caseId}/cancel`,
        method: 'PUT',
        token,
      });
    } catch (e) {
      this.handleException(e);
    }
  }
}
