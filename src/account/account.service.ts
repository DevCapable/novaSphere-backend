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

    // Validate account types against the new AccountTypeEnum
    if (
      !types ||
      !types.length ||
      !types.every((type) => Object.values(AccountTypeEnum).includes(type))
    ) {
      throw new CustomValidationException({
        type: 'A valid Account type is required',
      });
    }
    // const keys = await this.redis.keys('accounts:*');
    // await this.redis.re(keys);
    const cacheKey = `accounts:${JSON.stringify({ filterOptions, paginationOptions })}`;

    // try {
    //   const cachedResult = await this.redis.get(cacheKey);
    //   if (cachedResult) {
    //     return JSON.parse(cachedResult);
    //   }
    // } catch (e) {
    //   this.logger.error('Redis cache fetch failed');
    // }

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
      if (!acc.has(doc.fileableId)) acc.set(doc.fileableId, doc);
      return acc;
    }, new Map());

    const transformedData = data.map((item: any) => {
      let transformedItem = { ...item };

      // 1. INSTITUTION Transformation
      if (item.type === AccountTypeEnum.INSTITUTION) {
        transformedItem = {
          ...item,
          name: item.institution?.name?.toUpperCase(),
          shortName: item.institution?.shortName,
          institutionType: item.institution?.institutionType,
          ownershipType: item.institution?.ownershipType,
          regNumber: item.institution?.registrationNumber,
        };
      }

      // 2. SUG (Student Union) Transformation
      if (item.type === AccountTypeEnum.SUG) {
        transformedItem = {
          ...item,
          name: item.sug?.unionName?.toUpperCase(),
          acronym: item.sug?.acronym,
          president: item.sug?.presidentName,
          institution: item.sug?.institution?.name,
        };
      }

      // 3. INDIVIDUAL (Student/Staff) Transformation
      if (item.type === AccountTypeEnum.INDIVIDUAL) {
        transformedItem = {
          ...item,
          firstName: item.individual?.firstName?.toUpperCase(),
          lastName: item.individual?.lastName?.toUpperCase(),
          state: item?.individual?.state?.name,
          competencyId: item.individual?.competencyId,
        };
      }

      // 4. ADMIN Transformation
      if (item.type === AccountTypeEnum.ADMIN) {
        transformedItem = {
          ...item,
          firstName: item.admin?.firstName?.toUpperCase(),
          lastName: item.admin?.lastName?.toUpperCase(),
          position: item.admin?.position,
          department: item.admin?.department?.name,
        };
      }

      // 5. COMMUNITY VENDOR Transformation
      if (item.type === AccountTypeEnum.COMMUNITY_VENDOR) {
        transformedItem = {
          ...item,
          name: item.communityVendor?.name?.toUpperCase() || '',
          state: item?.communityVendor?.state?.name,
        };
      }

      // 6. DEPARTMENT Transformation
      if (item.type === AccountTypeEnum.DEPARTMENT) {
        transformedItem = {
          ...item,
          name: item.department?.name?.toUpperCase(),
          code: item.department?.code,
          institution: item.department?.institution?.name,
        };
      }

      // 7. LECTURER Transformation
      if (item.type === AccountTypeEnum.LECTURER) {
        transformedItem = {
          ...item,
          firstName: item.lecturer?.firstName?.toUpperCase(),
          lastName: item.lecturer?.lastName?.toUpperCase(),
          title: item.lecturer?.title,
          staffNumber: item.lecturer?.staffNumber,
        };
      }

      return {
        ...transformedItem,
        profilePicture: documentsByAccountId.get(item.id) || null,
      };
    });

    const result = { data: transformedData, totalCount };

    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    } catch (e) {
      this.logger.error('Redis cache set failed');
    }
    return result;
  }

  async create(data: any) {
    try {
      let userData: any;
      const accountData = {
        ...data,
        email: (data.email || data.officialEmail)?.toLowerCase()?.trim(),
        workflowGroups: data.workflowGroups || [],
      };

      const defaultRole = await this.roleRepository.findOne({
        where: { slug: RolesEnum.SUPER_ADMIN },
      });

      // 1. Logic for Organizational Accounts (Institutions, SUG, Vendors, Operators)
      const orgTypes = [
        AccountTypeEnum.INSTITUTION,
        AccountTypeEnum.SUG,
        AccountTypeEnum.COMMUNITY_VENDOR,
        AccountTypeEnum.DEPARTMENT,
      ];

      if (orgTypes.includes(accountData.accountType)) {
        // Determine the display name and "Last Name" identifier based on account type
        let displayName = '';
        let identifier = DEFAULT_LAST_NAME;

        if (accountData.accountType === AccountTypeEnum.SUG) {
          displayName = data.unionName?.toUpperCase();
          identifier = data.acronym || 'SUG';
        } else if (accountData.accountType === AccountTypeEnum.INSTITUTION) {
          displayName =
            data.name?.toUpperCase() || data.institutionName?.toUpperCase();
          identifier = data.registrationNumber || data.shortName || 'INST';
        } else {
          displayName = data.name?.toUpperCase();
          identifier = data.rcNumber || DEFAULT_LAST_NAME;
        }

        accountData['name'] = displayName;
        accountData['isOffshore'] = data?.isOffshore === 'YES';

        userData = {
          ...accountData,
          firstName: displayName,
          lastName: identifier,
        };

        if (defaultRole) {
          userData.roles = [defaultRole.id];
        }
      }
      // 2. Logic for Individual Accounts (Students/Staff/Alumni)
      else {
        accountData['firstName'] = data.firstName?.toUpperCase();
        accountData['lastName'] = data.lastName?.toUpperCase();

        userData = {
          ...accountData,
          isPasswordReset: false,
        };

        // Clean up optional location IDs
        if (Number(accountData.stateId) === 0) delete accountData.stateId;
        if (Number(accountData.lgaId) === 0) delete accountData.lgaId;

        if (defaultRole) {
          userData.roles = [defaultRole.id];
        }
      }

      let user;
      let account;
      const reservedSlugs = new Set<string>();

      // Generate slug from the most relevant name field
      const slugName =
        accountData.name || `${accountData.firstName}${accountData.lastName}`;
      const slug = await this.accountRepository.generateUniqueSlug(
        slugName,
        reservedSlugs,
      );

      // 3. Database Transaction for Atomicity
      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          // Create the User first
          user = await this.userService.create(userData, entityManager);

          // Create the Account and link the User
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

      // 4. Post-Creation Notification
      if (user?.id && account?.id) {
        const verificationData = await this.userService.generateToken(user.id);
        await this.sendNotification(accountData.accountType, {
          token: verificationData.token,
          user,
        });
      }

      return account;
    } catch (error: any) {
      console.error('Error during account creation:', error);
      throw new CustomBadRequestException(
        'Error encountered during account creation: ' + error.message,
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
    } catch (error: any) {
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

  // async createExternal(
  //   data: any,
  //   externalOrigin: ExternalLinkOriginEnum | null,
  // ) {
  //   try {
  //     const accountData = {
  //       ...data,
  //       email: data.email.toLowerCase(),
  //       workflowGroups: [],
  //       origin: externalOrigin,
  //       active: false,
  //     };

  //     if (
  //       [
  //         AccountTypeEnum.INSTITUTION,
  //         AccountTypeEnum.COMMUNITY_VENDOR,
  //       ].includes(accountData.accountType)
  //     ) {
  //       accountData['name'] = data.name.toUpperCase();
  //     } else {
  //       accountData['firstName'] = data.firstName.toUpperCase();
  //       accountData['lastName'] = data.lastName.toUpperCase();

  //       if (accountData.stateId === 0) {
  //         delete accountData.stateId;
  //       }
  //       if (accountData.lgaId === 0) {
  //         delete accountData.lgaId;
  //       }
  //     }

  //     const isEmail = await this.accountRepository.checkEmailExist(
  //       accountData.email,
  //     );
  //     if (isEmail) {
  //       const sanitizedAccountName = data.name
  //         .toLowerCase()
  //         .replace(/[^\w\s]/gi, '')
  //         .replace(/\s+/g, '_');
  //       const newEmail = `${sanitizedAccountName}@jqs.com`;
  //       accountData.email = newEmail;
  //     }

  //     const reservedSlugs = new Set<string>();
  //     const slugName = data.name
  //       ? data.name
  //       : `${data.firstName}${data.lastName}`;
  //     const slug = await this.accountRepository.generateUniqueSlug(
  //       slugName,
  //       reservedSlugs,
  //     );

  //     const respo = await this.entityManager.transaction(
  //       async (entityManager: EntityManager) => {
  //         return await this.accountRepository.createExternal(
  //           {
  //             ...accountData,
  //             slug,
  //             users: [],
  //           },
  //           entityManager,
  //         );
  //       },
  //     );
  //     return respo;
  //   } catch (error) {
  //     console.error(`error-check`, error);
  //     throw error;
  //   }
  // }

  sendNotification(accountType: string, payload: any) {
    // Normalize the account type to match the Enum keys
    const type = accountType?.toUpperCase();

    switch (type) {
      case AccountTypeEnum.INSTITUTION:
        this.accountEvent.institutionWelcome(payload);
        break;

      case AccountTypeEnum.SUG:
        this.accountEvent.sugWelcome(payload);
        break;

      case AccountTypeEnum.ADMIN:
        this.accountEvent.adminWelcome(payload);
        break;

      case AccountTypeEnum.COMMUNITY_VENDOR:
        this.accountEvent.vendorWelcome(payload);
        break;

      case AccountTypeEnum.INDIVIDUAL:
      default:
        // Standard flow for Students, Alumni, and Staff individuals
        this.accountEvent.individualWelcome(payload);

        setTimeout(() => {
          this.accountEvent.individualActivation(payload);
        }, 2000);
        break;
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

  async update(id: number, data: any) {
    const { profilePicture, isOffshore, active, ...profileData } = data;

    // 1. Update the base Account table
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    await this.accountRepository.update(id, {
      ...profileData,
      establishmentDate: data.establishmentDate
        ? new Date(data.establishmentDate)
        : null,
      isOffshore: isOffshore === 'YES',
    });

    // 2. Prepare user data for the associated Super Admin
    let userData = pick(data, [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'roles',
    ]) as any;

    // Handle Profile Picture updates
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

    // 3. Logic for Organizational Accounts (Institution, SUG, Vendor, Operator)
    const personTypes = [
      AccountTypeEnum.ADMIN,
      AccountTypeEnum.INDIVIDUAL,
      AccountTypeEnum.LECTURER,
    ];

    const orgTypes = [
      AccountTypeEnum.INSTITUTION,
      AccountTypeEnum.SUG,
      AccountTypeEnum.COMMUNITY_VENDOR,
    ];

    if (orgTypes.includes(account?.type)) {
      // Map the Org Name to the User's Display name
      const displayName = data.name || data.unionName || data.institutionName;

      userData = {
        firstName: displayName?.toUpperCase(),
        lastName: data?.registrationNumber || data?.acronym || 'OFFICIAL',
        email:
          data.email?.toLowerCase()?.trim() ||
          data.officialEmail?.toLowerCase()?.trim(),
      } as any;
    }

    let superUser = account?.users?.[0];

    // 4. Update existing super user if found
    if (superUser) {
      await this.userService.update(superUser.id, userData);
    }

    // 5. Create Super User if account is being activated for the first time
    if (!superUser && active) {
      const defaultRole = await this.roleRepository.findOne({
        where: { slug: RolesEnum.SUPER_ADMIN },
      });

      if (defaultRole) userData.roles = [defaultRole.id];

      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          let nogicNumber = account?.nogicNumber;
          const year = new Date().getFullYear().toString().slice(-2);

          // Handle NOGIC Number generation based on type
          if (!nogicNumber || nogicNumber.length < 5) {
            if (account.type === AccountTypeEnum.SUG) {
              const count = await entityManager.count(Account, {
                where: {
                  type: AccountTypeEnum.SUG,
                  nogicNumber: Like('301/%'),
                },
              });
              nogicNumber = `301/${year}/${count + 1}`;
            } else if (account.type === AccountTypeEnum.INSTITUTION) {
              const count = await entityManager.count(Account, {
                where: {
                  type: AccountTypeEnum.INSTITUTION,
                  nogicNumber: Like('101/%'),
                },
              });
              nogicNumber = `101/${year}/${count + 1}`;
            }
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
        await this.sendNotification(account?.type, { user: superUser });
      }
    }

    await this.clearCache();
    return account;
  }

  // async matchOrCreateCompany(
  //   vendors: {
  //     email: string;
  //     name: string;
  //     nogicUniqueId?: string;
  //     phoneNumber: string;
  //     address: string;
  //   }[],
  //   externalOrigin: ExternalLinkOriginEnum | null,
  // ) {
  //   const companies =
  //     await this.accountRepository.findCompaniesByIdentifiers(vendors);

  //   const { matches: matchedCompanies, matchedKeys } =
  //     this.findBestMatchAccounts(vendors, companies);

  //   const results: any[] = [...matchedCompanies];

  //   for (const vendor of vendors) {
  //     const vendorName = vendor.name.toLowerCase();
  //     const matchKey = `${vendorName}`;

  //     if (matchedKeys.has(matchKey)) continue;

  //     console.log(`vendor to create`, vendor);
  //     try {
  //       const vendorEmail = vendor.email.toLowerCase();

  //       const alreadyMatched = matchedCompanies.some(({ account }) => {
  //         const source = account.company ?? account.operator;
  //         const sourceName = source?.name?.toLowerCase() ?? '';
  //         const sourceEmail = source?.email?.toLowerCase() ?? '';

  //         const nameScore = stringSimilarity(vendorName, sourceName);

  //         if (nameScore >= SIMILARITY_THRESHOLD) return true;

  //         return vendorEmail === sourceEmail;
  //       });

  //       if (!alreadyMatched) {
  //         const created = await this.createExternal(
  //           {
  //             email: vendor.email,
  //             name: vendor.name,
  //             phoneNumber: vendor.phoneNumber,
  //             address: vendor.address,
  //             accountType: AccountTypeEnum.COMPANY,
  //           },
  //           externalOrigin,
  //         );
  //         results.push({ vendorName, account: created });
  //       }
  //     } catch (error) {
  //       console.log(
  //         `Failed to create account for`,
  //         vendorName,
  //         'with error',
  //         error,
  //       );
  //     }
  //   }
  //   return results;
  // }

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

  private _getAccountName(account: Account): string {
    let name = '';

    switch (account.type) {
      case AccountTypeEnum.INSTITUTION:
        // Primary display: "University of Lagos (UNILAG)"
        const inst = account.institution;
        name = inst?.shortName
          ? `${inst.name} (${inst.shortName})`
          : inst?.name || '';
        break;

      case AccountTypeEnum.SUG:
        // Primary display: "UNILAG SUG"
        name = account.sug?.unionName || '';
        break;

      case AccountTypeEnum.DEPARTMENT:
        name = account.department?.name || '';
        break;

      case AccountTypeEnum.INDIVIDUAL:
        name = `${account.individual?.firstName ?? ''} ${account.individual?.lastName ?? ''}`;
        break;

      case AccountTypeEnum.LECTURER:
        const lec = account.lecturer;
        name = `${lec?.title ?? ''} ${lec?.firstName ?? ''} ${lec?.lastName ?? ''}`;
        break;

      case AccountTypeEnum.ADMIN:
        name = `${account.admin?.firstName ?? ''} ${account.admin?.lastName ?? ''}`;
        break;

      case AccountTypeEnum.COMMUNITY_VENDOR:
        name = account.communityVendor?.name || '';
        break;

      case AccountTypeEnum.AUDITOR:
        name = `${account.auditor?.firstName ?? ''} ${account.auditor?.lastName ?? ''}`;
        break;

      default:
        name = account.nogicNumber || 'Unknown Account';
    }

    return name.trim();
  }

  // private findBestMatchAccounts(
  //   identifiers: { email: string; name: string }[],
  //   companies: Account[],
  // ) {
  //   const matches = [];
  //   const matchedKeys = new Set<string>();

  //   for (const identifier of identifiers) {
  //     const vendorName = identifier.name.toLowerCase();
  //     const matchKey = `${vendorName}`;

  //     let bestNameMatch = null;
  //     let highestScore = 0;

  //     for (const company of companies) {
  //       const source = company.company;
  //       const sourceName = source?.name?.toLowerCase() ?? '';
  //       const nameScore = stringSimilarity(vendorName, sourceName);

  //       if (nameScore > highestScore) {
  //         bestNameMatch = company;
  //         highestScore = nameScore;
  //       }
  //     }

  //     if (highestScore >= SIMILARITY_THRESHOLD && bestNameMatch) {
  //       matches.push({ vendorName, account: bestNameMatch });
  //       matchedKeys.add(matchKey);
  //     }
  //   }

  //   return { matches, matchedKeys };
  // }

  private sanitizePublicAccount(account: any): any {
    const base = {
      uuid: account.uuid,
      slug: account.slug,
      type: account.type,
      active: account.active,
      profilePicture: account.profilePicture ?? null,
    };

    switch (account.type) {
      case 'INSTITUTION':
        return {
          ...base,
          institution: account.institution
            ? {
                name: account.institution.name,
                shortName: account.institution.shortName,
                institutionType: account.institution.institutionType,
                ownershipType: account.institution.ownershipType,
                isAccredited: account.institution.isAccredited,
              }
            : null,
        };

      case 'SUG':
        return {
          ...base,
          sug: account.sug
            ? {
                unionName: account.sug.unionName,
                acronym: account.sug.acronym,
                presidentName: account.sug.presidentName,
                isActive: account.sug.isActive,
                // Link to the parent institution name if the relation is loaded
                institutionName: account.sug.institution?.name ?? null,
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
                competencyId: account.individual.competencyId,
              }
            : null,
        };

      case 'ADMIN':
        return {
          ...base,
          admin: account.admin
            ? {
                firstName: account.admin.firstName,
                lastName: account.admin.lastName,
                position: account.admin.position,
                // Return department name for academic context
                departmentName: account.admin.department?.name ?? null,
              }
            : null,
        };

      case 'COMMUNITY_VENDOR':
        return {
          ...base,
          communityVendor: account.communityVendor
            ? {
                name: account.communityVendor.name,
                nogicNumber: account.communityVendor.nogicNumber,
              }
            : null,
        };

      default:
        return base;
    }
  }
}
