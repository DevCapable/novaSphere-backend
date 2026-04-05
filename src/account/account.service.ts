import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';

import { CreateInstitutionDto } from '@app/account/dto/institution/create-institution.dto';
import {
  CustomBadRequestException,
  CustomValidationException,
} from '@app/core/error';
import { omit, pick } from '@app/core/util';
import { DocumentService } from '@app/document/document.service';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { LoggerService } from '@app/logger';
import { APP_REDIS } from '@app/redis/constants';
import { InjectRedisConnection } from '@app/redis/decorators';
import { RolesEnum } from '@app/role/enums';
import { RoleRepository } from '@app/role/role.repository';
import { StatRepository } from '@app/stat/stat.repository';
import { StatService } from '@app/stat/stat.service';
import { UserService } from '@app/user/user.service';
import type IORedis from 'ioredis';
import { stringSimilarity } from 'string-similarity-js';
import { EntityManager, Like } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';
import { Account } from './entities/account.entity';
import { AccountTypeEnum } from './enums';
import { AccountEvent } from './events/account.event';

const FILEABLE_TYPE = 'PROFILE-PICTURE';
const SIMILARITY_THRESHOLD = 0.7;
const DEFAULT_LAST_NAME = 'ADMIN';

/**
 * @TODO verifyCode, resetpassword, sendNotification
 */
@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
    private readonly roleRepository: RoleRepository,
    private readonly documentService: DocumentService,
    private readonly statService: StatService,
    private readonly statRepository: StatRepository,
    private readonly accountEvent: AccountEvent,
    private readonly logger: LoggerService,
    @InjectRedisConnection(APP_REDIS)
    private redis: IORedis,
  ) {}

  private async clearCache(): Promise<void> {
    try {
      const stream = this.redis.scanStream({
        match: 'accounts:*',
        count: 100,
      });

      const keysToDelete: string[] = [];

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          keysToDelete.push(...keys);
        }
      });

      await new Promise((resolve) => stream.on('end', resolve));

      if (keysToDelete.length > 0) await this.redis.del(keysToDelete);
    } catch (e) {
      this.logger.error('Failed to clear accounts cache:');
    }
  }

  async findAll(filterOptions, paginationOptions) {
    const types = filterOptions.type?.split(',');
    const isPublic = filterOptions.isPublic;
    delete filterOptions.isPublic;
    if (
      !types ||
      !types.length ||
      !types.every((type) => Object.keys(AccountTypeEnum).includes(type))
    ) {
      throw new CustomValidationException({
        type: 'Account type is required',
      });
    }

    const cacheKey = `accounts:${JSON.stringify({
      filterOptions,
      paginationOptions,
    })}`;

    try {
      const cachedResult = await this.redis.get(cacheKey);
      if (cachedResult) {
        this.logger.log(`Fetched accounts ${cacheKey} from redis`);
        return JSON.parse(cachedResult);
      }
    } catch (e) {
      this.logger.error('Error while fetching from redis');
    }

    const [data, totalCount] = await this.accountRepository.findAll(
      filterOptions,
      paginationOptions,
    );

    const accountIds = data.map((item) => item.id);

    const allDocuments = await this.documentService.findFilesByFileableIds(
      accountIds,
      FILEABLE_TYPE,
    );

    const documentsByAccountId = allDocuments.reduce((acc, doc) => {
      if (!acc.has(doc.fileableId)) {
        acc.set(doc.fileableId, doc);
      }
      return acc;
    }, new Map());

    let transformedData = data.map((item: any) => {
      let transformedItem = item;

      if (item.type === AccountTypeEnum.COMPANY) {
        transformedItem = {
          ...item,
          id: item.id,
          rcNumber: item?.isOffshore ? 'N/A' : item?.rcNumber,
          name: item.company.name.toUpperCase(),
        };
      }

      if (item.type === AccountTypeEnum.INDIVIDUAL) {
        transformedItem = {
          id: item.id,
          firstName: item.individual.firstName.toUpperCase(),
          lastName: item.individual.lastName.toUpperCase(),
          dob: item.individual.dob,
          gender: item.individual.gender,
          state: item?.individual?.state?.name,
          users: item.users,
          individual: item.individual,
          competencyId: item.individual?.competencyId,
        };
      }

      if (item.type === AccountTypeEnum.COMMUNITY_VENDOR) {
        transformedItem = {
          ...item,
          communityVendor: {
            id: item?.id,
            name: item.communityVendor?.name?.toUpperCase() || '',
            email: item.communityVendor?.email,
            address: item.communityVendor?.address,
            phoneNumber: item.communityVendor?.phoneNumber,
            stateId: item.communityVendor?.stateId,
            nogicNumber: item?.nogicNumber,
            state: item?.communityVendor?.state?.name,
          },
        };
      }

      return {
        ...transformedItem,
        profilePicture: documentsByAccountId.get(item.id) || null,
      };
    });

    if (isPublic) {
      transformedData = data.map((account) =>
        this.sanitizePublicAccount(account),
      );
    }

    const result = { data: transformedData, totalCount };

    try {
      await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    } catch (e) {
      this.logger.error('Error while setting in redis');
    }

    return result;
  }

  async create(data: any) {
    try {
      let userData;
      const accountData = {
        ...data,
        email: data.email?.toLowerCase()?.trim(),
        workflowGroups: data.workflowGroups || [],
      };
      const defaultRole = await this.roleRepository.findOne({
        slug: RolesEnum.SUPER_ADMIN,
      });
      if (
        [
          AccountTypeEnum.COMPANY,
          AccountTypeEnum.OPERATOR,
          AccountTypeEnum.COMMUNITY_VENDOR,
        ].includes(accountData.accountType)
      ) {
        const defaultRole = await this.roleRepository.findOne({
          slug: RolesEnum.SUPER_ADMIN,
        });

        accountData['name'] = data.name.toUpperCase();
        accountData['isOffshore'] = data?.isOffshore === 'YES';
        userData = {
          ...accountData,
          firstName: accountData.name,
          lastName: accountData?.rcNumber || DEFAULT_LAST_NAME,
        };

        if (defaultRole) {
          userData.roles = [defaultRole.id];
        }
      } else if (
        [AccountTypeEnum.INSTITUTION].includes(accountData.accountType)
      ) {
        accountData['name'] = data.institutionName.toUpperCase();
        userData = {
          ...accountData,
          firstName: accountData.name,
          lastName: accountData.registrationNumber,
        };
        if (defaultRole) {
          userData.roles = [defaultRole.id];
        }
      } else {
        accountData['firstName'] = data.firstName.toUpperCase();
        accountData['lastName'] = data.lastName.toUpperCase();
        userData = { ...accountData, isPasswordReset: false };

        if (accountData.stateId === 0) {
          delete accountData.stateId;
        }
        if (accountData.lgaId === 0) {
          delete accountData.lgaId;
        }
        if (defaultRole) {
          userData.roles = [defaultRole.id];
        }
      }

      let user;
      let account;
      const reservedSlugs = new Set<string>();
      const slugName = data.name
        ? data.name
        : `${data.firstName}${data.lastName}`;
      const slug = await this.accountRepository.generateUniqueSlug(
        slugName,
        reservedSlugs,
      );

      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          user = await this.userService.create(userData, entityManager);
          account = await this.accountRepository.create(
            {
              ...accountData,
              slug,
              users: [user],
            },
            entityManager,
          );
        },
      );

      if (user.id && account.id) {
        const verificationData = await this.userService.generateToken(user.id);
        await this.sendNotification(accountData.accountType, {
          token: verificationData.token,
          user,
        });
      }
    } catch (error) {
      throw new CustomBadRequestException(
        'Error encountered please check ' + error,
      );
    } finally {
      await this.clearCache();
    }
  }

  async createInstitution(data: CreateInstitutionDto) {
    try {
      await this.create({
        ...data,
        accountType: AccountTypeEnum.INSTITUTION,
      });
    } catch (error) {
      if (error && error.code === 'ER_DUP_ENTRY') {
        throw new CustomBadRequestException(
          'User with that email already exists',
        );
      }
      throw error;
    }
  }

  async findCompaniesByIdentifiers(
    identifiers: {
      email: string;
      name: string;
      nogicUniqueId?: string;
      phoneNumber: string;
      address: string;
    }[],
  ) {
    return this.accountRepository.findCompaniesByIdentifiers(identifiers);
  }

  async createExternal(
    data: any,
    externalOrigin: ExternalLinkOriginEnum | null,
  ) {
    try {
      const accountData = {
        ...data,
        email: data.email.toLowerCase(),
        workflowGroups: [],
        origin: externalOrigin,
        active: false,
      };

      if (
        [
          AccountTypeEnum.COMPANY,
          AccountTypeEnum.OPERATOR,
          AccountTypeEnum.COMMUNITY_VENDOR,
        ].includes(accountData.accountType)
      ) {
        accountData['name'] = data.name.toUpperCase();
      } else {
        accountData['firstName'] = data.firstName.toUpperCase();
        accountData['lastName'] = data.lastName.toUpperCase();

        if (accountData.stateId === 0) {
          delete accountData.stateId;
        }
        if (accountData.lgaId === 0) {
          delete accountData.lgaId;
        }
      }

      const isEmail = await this.accountRepository.checkEmailExist(
        accountData.email,
      );
      if (isEmail) {
        const sanitizedAccountName = data.name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '_');
        const newEmail = `${sanitizedAccountName}@jqs.com`;
        accountData.email = newEmail;
      }

      const reservedSlugs = new Set<string>();
      const slugName = data.name
        ? data.name
        : `${data.firstName}${data.lastName}`;
      const slug = await this.accountRepository.generateUniqueSlug(
        slugName,
        reservedSlugs,
      );

      const respo = await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          return await this.accountRepository.createExternal(
            {
              ...accountData,
              slug,
              users: [],
            },
            entityManager,
          );
        },
      );
      return respo;
    } catch (error) {
      console.error(`error-check`, error);
      throw error;
    }
  }

  async sendNotification(accountType, payload: any) {
    switch (accountType.toUpperCase()) {
      case AccountTypeEnum.INSTITUTION:
        this.accountEvent.institutionWelcome(payload);
        break;
      case AccountTypeEnum.COMPANY:
        this.accountEvent.companyWelcome(payload);
        break;
      case AccountTypeEnum.OPERATOR:
        this.accountEvent.operatorWelcome(payload);
        break;
      case AccountTypeEnum.AGENCY:
        this.accountEvent.agencyWelcome(payload);
        break;
      default:
        this.accountEvent.individualWelcome(payload);
        setTimeout(() => {
          this.accountEvent.individualActivation(payload);
        }, 2000);
    }
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findById(id);
    const accountTypeData: any =
      await this.accountRepository.findAccountTypeData(
        account.id,
        account.type,
      );

    const documentFiles = await this.documentService.findFilesByFileable(
      account.id,
      FILEABLE_TYPE,
    );

    const accountWithType = {
      ...{ ...account, profilePicture: documentFiles[0] },
      [camelCase(account.type.toLowerCase())]: {
        ...accountTypeData,
        rcNumber: accountTypeData?.isOffshore
          ? 'N/A'
          : accountTypeData?.rcNumber,
      },
    };

    accountWithType['name'] = this._getAccountName(accountWithType);

    return accountWithType;
  }

  async findByUidOrSlug(uuidOrSlug: string, isPublic = false) {
    const account = await this.accountRepository.findByUidOrSlug(uuidOrSlug);
    const accountTypeData: any =
      await this.accountRepository.findAccountTypeData(
        account.id,
        account.type,
      );

    const documentFiles = await this.documentService.findFilesByFileable(
      account.id,
      FILEABLE_TYPE,
    );

    const accountWithType = {
      ...{ ...account, profilePicture: documentFiles[0] },
      [account.type.toLowerCase()]: {
        ...accountTypeData,
        rcNumber: accountTypeData?.isOffshore
          ? 'N/A'
          : accountTypeData?.rcNumber,
      },
    };

    accountWithType['name'] = this._getAccountName(accountWithType);

    if (isPublic) {
      const mappedAccount = omit(account, ['id', 'individual']);
      return { ...mappedAccount, name: accountWithType.name };
    }
    return accountWithType;
  }

  async findStats(id: number) {
    return await this.statService.findStat(id);
  }

  async update(id: number, data) {
    const { profilePicture, isOffshore, active, ...profileData } = data;

    const account = await this.accountRepository.update(id, {
      ...profileData,
      accountId: id,
      isOffshore: isOffshore === 'YES',
    });

    let userData = pick(data, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'roles',
    ]) as any;

    if (profilePicture) {
      await this.documentService.deleteDocumentFileByFileable(
        id,
        FILEABLE_TYPE,
      );
      await this.documentService.createDocumentFile(
        [profilePicture],
        id,
        FILEABLE_TYPE,
      );
    }

    if ([AccountTypeEnum.INSTITUTION].includes(account?.type)) {
      const userData = pick(data, ['email']);

      const userId = account?.users[0]?.id;

      if (userId) await this.userService.update(userId, userData);
    }

    if (
      [
        AccountTypeEnum.COMPANY,
        AccountTypeEnum.OPERATOR,
        AccountTypeEnum.COMMUNITY_VENDOR,
      ].includes(account?.type)
    ) {
      userData = {
        firstName: data.name?.toUpperCase(),
        lastName: data?.rcNumber || DEFAULT_LAST_NAME,
        email: data.email?.toLowerCase()?.trim(),
      } as any;
    }

    // super admin user  for the company
    let superUser = account?.users?.[0];

    if (superUser) await this.userService.update(superUser.id, userData);

    if (
      !superUser &&
      active &&
      account?.type !== AccountTypeEnum.COMMUNITY_VENDOR
    ) {
      const defaultRole = await this.roleRepository.findOne({
        slug: RolesEnum.SUPER_ADMIN,
      });

      if (defaultRole) userData.roles = [defaultRole.id];

      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          let nogicNumber = account?.nogicNumber;

          if (!nogicNumber.includes('201/')) {
            const totalCompanies = await entityManager.count(Account, {
              where: {
                type: AccountTypeEnum.COMPANY,
                nogicNumber: Like('201/%'),
              },
            });

            const year = new Date().getFullYear().toString().slice(-2);
            nogicNumber = `201/${year}/${totalCompanies + 1}`;
          }

          superUser = await this.userService.create(
            { ...userData, isActivated: true },
            entityManager,
          );

          await entityManager.save(Account, {
            id,
            active: true,
            nogicNumber,
            users: [superUser],
          });
        },
      );

      if (superUser) {
        await this.sendNotification(account?.type, {
          user: superUser,
        });
      }
    }

    await this.clearCache();

    return account;
  }

  async matchOrCreateCompany(
    vendors: {
      email: string;
      name: string;
      nogicUniqueId?: string;
      phoneNumber: string;
      address: string;
    }[],
    externalOrigin: ExternalLinkOriginEnum | null,
  ) {
    const companies =
      await this.accountRepository.findCompaniesByIdentifiers(vendors);

    const { matches: matchedCompanies, matchedKeys } =
      this.findBestMatchAccounts(vendors, companies);

    const results: any[] = [...matchedCompanies];

    for (const vendor of vendors) {
      const vendorName = vendor.name.toLowerCase();
      const matchKey = `${vendorName}`;

      if (matchedKeys.has(matchKey)) continue;

      console.log(`vendor to create`, vendor);
      try {
        const vendorEmail = vendor.email.toLowerCase();

        const alreadyMatched = matchedCompanies.some(({ account }) => {
          const source = account.company ?? account.operator;
          const sourceName = source?.name?.toLowerCase() ?? '';
          const sourceEmail = source?.email?.toLowerCase() ?? '';

          const nameScore = stringSimilarity(vendorName, sourceName);

          if (nameScore >= SIMILARITY_THRESHOLD) return true;

          return vendorEmail === sourceEmail;
        });

        if (!alreadyMatched) {
          const created = await this.createExternal(
            {
              email: vendor.email,
              name: vendor.name,
              phoneNumber: vendor.phoneNumber,
              address: vendor.address,
              accountType: AccountTypeEnum.COMPANY,
            },
            externalOrigin,
          );
          results.push({ vendorName, account: created });
        }
      } catch (error) {
        console.log(
          `Failed to create account for`,
          vendorName,
          'with error',
          error,
        );
      }
    }
    return results;
  }

  async updateIndividualWithoutRoleAndPermission(
    userId,
    accountType,
    userData,
  ) {
    if ([AccountTypeEnum.INDIVIDUAL].includes(accountType)) {
      const defaultRole = await this.roleRepository.findOne({
        slug: RolesEnum.SUPER_ADMIN,
      });
      if (defaultRole) {
        userData.roles = [defaultRole.id];
      }

      if (!userData.roles.length) {
        if (userId) return await this.userService.update(userId, userData);
      }
      return;
    }
    return;
  }

  private _getAccountName(account: Account) {
    let name = '';
    switch (account.type) {
      case AccountTypeEnum.INDIVIDUAL:
        name = `${account.individual?.firstName} ${account.individual?.lastName}`;
        break;
      case AccountTypeEnum.COMPANY:
        name = account.company?.name;
        break;
      case AccountTypeEnum.OPERATOR:
        name = account.operator?.name;
        break;
      case AccountTypeEnum.AGENCY:
        name = `${account.agency?.firstName} ${account.agency?.lastName}`;
        break;
      case AccountTypeEnum.COMMUNITY_VENDOR:
        name = account.communityVendor.name;
      case AccountTypeEnum.INSTITUTION:
        name = `${account.institution?.institutionName} ${account.institution?.registrationNumber}`;
        break;
    }
    return name.trim();
  }

  private findBestMatchAccounts(
    identifiers: { email: string; name: string }[],
    companies: Account[],
  ) {
    const matches = [];
    const matchedKeys = new Set<string>();

    for (const identifier of identifiers) {
      const vendorName = identifier.name.toLowerCase();
      const matchKey = `${vendorName}`;

      let bestNameMatch = null;
      let highestScore = 0;

      for (const company of companies) {
        const source = company.company ?? company.operator;
        const sourceName = source?.name?.toLowerCase() ?? '';
        const nameScore = stringSimilarity(vendorName, sourceName);

        if (nameScore > highestScore) {
          bestNameMatch = company;
          highestScore = nameScore;
        }
      }

      if (highestScore >= SIMILARITY_THRESHOLD && bestNameMatch) {
        matches.push({ vendorName, account: bestNameMatch });
        matchedKeys.add(matchKey);
      }
    }

    return { matches, matchedKeys };
  }

  private sanitizePublicAccount(account: any): any {
    const base = {
      uuid: account.uuid,
      slug: account.slug,
      type: account.type,
      active: account.active,
      profilePicture: account.profilePicture ?? null,
    };

    switch (account.type) {
      case 'COMPANY':
        return {
          ...base,
          company: account.company
            ? {
                name: account.company.name,
                nseStatus: account.company.nseStatus,
                businessCategoryId: account.company.businessCategoryId,
              }
            : null,
        };

      case 'INDIVIDUAL':
        return {
          ...base,
          individual: account.individual
            ? {
                firstName: account.individual.firstName,
                lastName: account.individual.lastName,
                gender: account.individual.gender,
              }
            : null,
        };

      case 'OPERATOR':
        return {
          ...base,
          operator: account.operator
            ? {
                name: account.operator.name,
                categoryId: account.operator.categoryId,
                businessCategoryId: account.operator.businessCategoryId,
                nseStatus: account.operator.nseStatus,
              }
            : null,
        };

      case 'AGENCY':
        return {
          ...base,
          agency: account.agency
            ? {
                firstName: account.agency.firstName,
                lastName: account.agency.lastName,
                position: account.agency.position,
              }
            : null,
        };

      default:
        return base;
    }
  }
}
