import { AccountRepository } from '@app/account/account.repository';
import { Account } from '@app/account/entities/account.entity';
import { AccountTypeEnum } from '@app/account/enums';
import { BaseService } from '@app/core/base/base.service';
import {
  CustomBadRequestException,
  CustomNotFoundException,
  CustomUnauthorizedException,
} from '@app/core/error';
import { ErrorMessages } from '@app/iam/authentication/constants';
import { AbilityFactory } from '@app/iam/authorization/permission.ability.factory';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '@app/iam/enum/permission.enum';
import type { CurrentUserData } from '@app/iam/interfaces';
import { LoggerService } from '@app/logger';
import { RolesHelper } from '@app/role/helpers';
import { settingConstant } from '@app/setting/constant';
import { StaffService } from '@app/staff/staff.service';
import { WorkflowService } from '@app/workflow/workflow.service';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { EntityManager, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomCode, getExpiryDate, omit } from '../core/util';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../iam/authentication/dto';
import ResetPasswordDto from './dto/reset-user-password.dto';
import { UserPassword } from './entities/user-password.entity';
import { UserVerification } from './entities/user-verification.entity';
import { User } from './entities/user.entity';
import { ResetPasswordEvent } from './event/reset-password.event';
import { HashingService } from './hashing/hashing.service';
import { UserPasswordRepository } from './user-password.repository';
import { UserRepository } from './user.repository';
import { UserSettingRepository } from './user-setting.repository';
import { UserSettingKeyEnum } from './enum';
import { FlatSettingsDto } from './dto/settings.dto';
import { StringHelper } from '@app/core/helpers';
import { USER_SETTING_TYPE_MAP } from './constants/events';

interface AuthenticatedRequest extends Request {
  user: CurrentUserData;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly staffService: StaffService,
    private readonly hashingService: HashingService,
    private readonly workFlowService: WorkflowService,
    private readonly userPasswordRepository: UserPasswordRepository,
    private readonly userSettingsRepository: UserSettingRepository,
    private readonly entityManager: EntityManager,
    private readonly resetPasswordEvent: ResetPasswordEvent,
    private readonly loggerService: LoggerService,
  ) {}

  async create(data: any, manager?: any) {
    const wfUserGroups =
      data?.workflowGroups?.length > 0 ? data.workflowGroups : [];
    const baseData = {
      email: data.email.toLowerCase().trim(),
      firstName: data.firstName.toUpperCase().trim(),
      lastName: data.lastName.toUpperCase().trim(),
    };

    const user = await this.userRepository.create(
      { ...data, ...baseData, wfUserGroups, accounts: [data?.accountId] },
      manager,
    );

    const newPassword = user.password;
    await this.userPasswordRepository.create(
      {
        password: newPassword,
        expiryDate: this._getPasswordExpiryDate(),
        userId: user.id,
      },
      manager,
    );

    if (data.accountType !== AccountTypeEnum.INDIVIDUAL) {
      try {
        const { wfUserId, wfUserPassword } =
          await this.workFlowService.createUser({
            ...baseData,
          });

        if (wfUserId) {
          await this.userRepository.update(
            user.id,
            {
              wfUserId,
              wfUserPassword,
            },
            manager,
          );

          try {
            if (wfUserGroups.length > 0) {
              await Promise.all(
                wfUserGroups.map(async (group: any) => {
                  await this.workFlowService.assignUserToGroup(
                    wfUserId,
                    group.id,
                  );
                }),
              );
            }
          } catch {
            this.loggerService.log('Workflow user group assignment failed');
          }
        }
      } catch (e) {
        this.loggerService.log(String(e));
        this.loggerService.log('Workflow user creation failed');
      }
    }

    return user;
  }

  async settings(dto: FlatSettingsDto): Promise<{ msg: string }> {
    const currentUser = BaseService.getCurrentUser();
    const entries = Object.entries(dto) as [
      UserSettingKeyEnum,
      string | number | boolean,
    ][];

    for (const [key, value] of entries) {
      if (!(key in USER_SETTING_TYPE_MAP)) {
        throw new CustomBadRequestException(`Invalid setting key: ${key}`);
      }

      const existing = await this.userSettingsRepository.findFirstBy({
        key,
        origin: ExternalLinkOriginEnum.NOGIC,
        user: { id: currentUser.id },
      });
      const stringValue = StringHelper.stringify(value);

      if (existing) {
        await this.userSettingsRepository.update(existing.id, {
          value: stringValue,
        });
      } else {
        await this.userSettingsRepository.create({
          user: currentUser,
          uuid: uuidv4(),
          key,
          value: stringValue,
        });
      }
    }

    return { msg: 'All settings saved successfully' };
  }

  async findSettings(): Promise<Partial<
    Record<UserSettingKeyEnum, string | number | boolean>
  > | null> {
    const currentUser = BaseService.getCurrentUser();
    const data = await this.userSettingsRepository.findUserSettings(
      currentUser.id,
      ExternalLinkOriginEnum.NOGIC,
    );

    if (!data.length) return null;

    const mappedKeys: Partial<
      Record<UserSettingKeyEnum, string | number | boolean>
    > = {};

    data.forEach((el) => {
      const { value, key } = el;
      const type = USER_SETTING_TYPE_MAP[el.key];
      let mappedValue: number | string | boolean = value;

      switch (type) {
        case 'number':
          mappedValue = Number(value);
          break;
        case 'boolean':
          mappedValue = value === 'true';
          break;
        default:
          // Keep as string
          break;
      }

      mappedKeys[key] = mappedValue;
    });

    return mappedKeys;
  }

  async getSettingValue(
    userId: number,
    key: UserSettingKeyEnum,
  ): Promise<string | number | boolean | null> {
    const setting = await this.userSettingsRepository.findFirstBy({
      user: { id: userId },
      key,
      origin: ExternalLinkOriginEnum.NOGIC,
    });

    if (!setting) return null;

    const type = USER_SETTING_TYPE_MAP[key];
    let mappedValue: number | string | boolean = setting.value;

    switch (type) {
      case 'number':
        mappedValue = Number(setting.value);
        break;
      case 'boolean':
        mappedValue = setting.value === 'true';
        break;
      default:
        // Keep as string
        break;
    }

    return mappedValue;
  }

  _getPasswordExpiryDate() {
    return getExpiryDate(
      new Date(),
      settingConstant.userPasswordExpiryFrequency,
      settingConstant.userPasswordExpiryDuration,
    );
  }

  async validateToken(
    token: string,
  ): Promise<{ isValid: boolean; email?: string }> {
    const userVerification = await this.entityManager.findOne(
      UserVerification,
      {
        where: { token },
        relations: ['user'],
      },
    );

    if (!userVerification || userVerification.completed) {
      return { isValid: false };
    }

    return { isValid: true, email: userVerification?.user?.email };
  }

  async verifyToken(tokenArg: string) {
    const token = await this.entityManager.findOne(UserVerification, {
      where: {
        token: tokenArg,
      },
    });

    if (!token) {
      throw new CustomBadRequestException('Invalid link');
    }

    const user = await this.userRepository.findFirst({
      id: token.userId,
    });

    if (!user) {
      throw new CustomBadRequestException('Invalid link');
    }

    const expiresInHours = 24;
    const currentTime = new Date();
    const codeCreationTime = new Date(token.createdAt);
    const timeDifferenceInHours =
      Math.abs(currentTime.getTime() - codeCreationTime.getTime()) /
      (1000 * 60 * 60);

    if (timeDifferenceInHours > expiresInHours) {
      throw new CustomBadRequestException('Verification code has expired');
    }

    await this.entityManager.transaction(async (manager: EntityManager) => {
      await manager.update(
        UserVerification,
        {
          id: token.id,
        },
        { completed: true },
      );
      await manager.update(
        User,
        {
          id: token.userId,
        },
        { isActivated: true },
      );
    });

    // send mail

    const verificationMessage = `Your account has been successfully verified. An email has been sent to ${user.email}.`;
    // You can send this message through your application's notification system or via email

    this.loggerService.log(verificationMessage);
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const { email } = payload;

    if (!email) {
      throw new CustomBadRequestException('Email is required');
    }

    const user = await this.userRepository.findFirst({
      email,
    });
    if (!user) {
      throw new CustomBadRequestException(
        'Invalid email or password reset is not allowed.',
      );
    }

    // Generate and save password reset token
    const resetToken = await this.generateToken(user.id);

    this.loggerService.log(resetToken.token);
    // Send password reset email
    // await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Password reset instructions have been sent to your email.',
    };
  }

  async _resetPassword(tokenArg: string, resetPassword: ResetPasswordDto) {
    try {
      const token = await this.entityManager.findOne(UserVerification, {
        where: {
          token: tokenArg,
        },
      });

      if (!token) {
        throw new CustomBadRequestException('Invalid link');
      }

      const user = await this.userRepository.findFirst({
        id: token.userId,
      });
      if (!user) {
        throw new CustomBadRequestException('Invalid link');
      }

      const expiresInHours = 24;
      const currentTime = new Date();
      const codeCreationTime = new Date(token.createdAt);
      const timeDifferenceInHours =
        Math.abs(currentTime.getTime() - codeCreationTime.getTime()) /
        (1000 * 60 * 60);

      if (timeDifferenceInHours > expiresInHours) {
        throw new CustomBadRequestException('Verification code has expired');
      }

      const newPasswordHash = await this.hashingService.hash(
        resetPassword.password,
      );
      user.password = newPasswordHash;

      await this.entityManager.transaction(async (manager: EntityManager) => {
        await manager.update(
          UserVerification,
          {
            id: token.id,
          },
          { completed: true },
        );
        await manager.update(
          User,
          {
            id: token.userId,
          },
          user,
        );
        await this.userPasswordRepository.create(
          {
            expiryDate: this._getPasswordExpiryDate(),
            password: newPasswordHash,
            userId: user.id,
          },
          manager,
        );
      });

      // send mail
      await this.resetPasswordEvent.resetPasswordEvent(user);
    } catch (error) {
      this.loggerService.log(
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async generateToken(userId: number) {
    const generatedToken = generateRandomCode(12);
    const token = this.entityManager.create(UserVerification, {
      token: generatedToken,
      userId,
      uuid: uuidv4(),
    });
    await this.entityManager.save(token);

    return token;
  }

  async createFromStaff(data: any) {
    const staff = await this.staffService.findOne(+data.staffId);
    if (staff && staff.individualAccount?.users?.length > 0) {
      const userId = staff.individualAccount.users[0]?.id;
      await this.userRepository.update(userId, {
        ...(data.roles.length && { roles: data.roles }),
        accounts: [staff.individualAccountId, data.accountId],
      });
    }
  }

  async findAll(filterOptions, paginationOptions, req: Request) {
    const authReq = req as AuthenticatedRequest;
    const originApp = authReq.get('X-Origin-Application');
    const externalOrigin = originApp
      ? ExternalLinkOriginEnum[originApp]
      : undefined;

    // Permissions check for NovaSphere User Management
    const shouldBypassPermission =
      externalOrigin === ExternalLinkOriginEnum.NCDF &&
      filterOptions?.filterAccountId;

    if (!shouldBypassPermission) {
      AbilityFactory.hasPermission(
        authReq.user,
        PermisionActionTypeEnum.READ,
        PermisionSubjectTypeEnum.USER,
      );
    }

    // 1. Updated relations to include Institutions and SUGs
    const [users, totalCount] = await this.userRepository.findAll(
      filterOptions,
      paginationOptions,
      [
        'accounts',
        'accounts.individual',
        'accounts.institution', // University/Polytechnic
        'accounts.sug', // Student Union
        'accounts.admin', // Staff/Admin
        'accounts.communityVendor',
        'roles',
        'permissions',
      ],
    );

    // 2. Transform nested accounts for the frontend
    users.forEach((user) => {
      (user.accounts as any) = (user.accounts || []).map((account) => {
        // Uses the updated _getAccountName helper for "UNILAG (Federal)" or "ULSU"
        const name = this._getAccountName(account);

        return {
          id: account.id,
          uuid: account.uuid,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          nogicNumber: account.nogicNumber,
          type: account.type,
          name,
          // Map specific fields if needed for the UI
          institutionType: account.institution?.institutionType,
          sugAcronym: account.sug?.acronym,
        };
      });
    });

    return { data: users, totalCount };
  }

  private _getAccountName(account: Account) {
    let name = '';
    switch (account.type) {
      case AccountTypeEnum.INDIVIDUAL:
        name = `${account.individual?.firstName ?? ''} ${account.individual?.lastName ?? ''}`;
        break;
      case AccountTypeEnum.INSTITUTION:
        name =
          account.institution?.name || account.institution?.shortName || '';
        break;
      case AccountTypeEnum.SUG:
        name = account.sug?.unionName || account.sug?.acronym || '';
        break;
      case AccountTypeEnum.ADMIN:
        name = `${account.admin?.firstName ?? ''} ${account.admin?.lastName ?? ''}`;
        break;
      case AccountTypeEnum.COMMUNITY_VENDOR:
        name = account.communityVendor?.name || '';
        break;
    }
    return name.trim();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findFirstBy({ id }, [
      'accounts',
      'accounts.individual',
      'accounts.institution', // Swapped from company
      'accounts.sug', // Added for NovaSphere
      'accounts.admin', // Swapped from agency
      'accounts.communityVendor',
      'roles',
      'roles.permissions',
      'permissions',
    ]);

    if (!user) {
      throw new CustomNotFoundException('User not found.');
    }

    const accounts = (user.accounts || []).map((account) => {
      return {
        id: account.id,
        uuid: account.uuid,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        // CRITICAL: Use the helper to derive the correct name
        name: this._getAccountName(account),
        nogicNumber: account.nogicNumber,
        type: account.type,
      };
    });

    return {
      ...user,
      accounts,
    };
  }

  async detachAccount(userId: number, accountId: number) {
    const repository = this.userRepository.getBaseRepository();
    const currentUser = BaseService.getCurrentUser();

    if (!RolesHelper.hasAdminRole(currentUser.roles)) {
      throw new CustomUnauthorizedException();
    }

    const user = await repository.findOne({
      where: { id: userId },
      relations: ['accounts'],
    });

    if (!user) throw new CustomNotFoundException(ErrorMessages.UserNotFound);

    const accountToRemove = user.accounts.find((acc) => acc.id === accountId);
    if (!accountToRemove)
      throw new CustomBadRequestException(ErrorMessages.InvalidAccount);

    // Define which account types are allowed to be detached from a user
    const detachableTypes = [
      AccountTypeEnum.INSTITUTION,
      AccountTypeEnum.SUG,
      AccountTypeEnum.COMMUNITY_VENDOR,
    ];

    const isDetachable = detachableTypes.includes(accountToRemove.type);

    if (!isDetachable) {
      throw new CustomBadRequestException(
        'You cannot detach a primary Individual or Admin account.',
      );
    }

    if (user.accounts.length <= 1) {
      throw new CustomBadRequestException(
        ErrorMessages.CannotDeleteOnlyAccount,
      );
    }

    user.accounts = user.accounts.filter((acc) => acc.id !== accountId);
    await this.entityManager.save(User, user);
  }

  async update(id: number, data: any) {
    const updateData: any = omit(data, ['accountId']);

    // Normalize Strings
    if (data?.firstName)
      updateData.firstName = data.firstName.toUpperCase().trim();
    if (data?.lastName)
      updateData.lastName = data.lastName.toUpperCase().trim();
    if (data?.email) updateData.email = data.email.toLowerCase().trim();

    // If updating a "Person" type account, sync the changes to the specific profile table
    const personTypes = [AccountTypeEnum.ADMIN, AccountTypeEnum.INDIVIDUAL];

    if (personTypes.includes(data?.accountType)) {
      const user = await this.userRepository.findById(id, ['accounts']);

      if (user) {
        const validAccounts = user.accounts.filter((acc) =>
          personTypes.includes(acc.type),
        );

        for (const account of validAccounts) {
          // This updates the Individual/Admin specific profile fields
          await this.accountRepository.update(account.id, {
            ...data,
            accountId: account.id,
          });
        }
      }
    }

    const updatedEntity = await this.userRepository.update(id, updateData);

    // ProcessMaker Sync Logic
    if (updatedEntity && updatedEntity.wfUserId) {
      const workflowData = {
        usr_username: updatedEntity.email,
        usr_firstname: updatedEntity.firstName,
        usr_lastname: updatedEntity.lastName,
        usr_email: updatedEntity.email,
        usr_uid: updatedEntity.wfUserId,
      };

      try {
        await this.workFlowService.updateUser(
          workflowData.usr_uid,
          workflowData,
        );
      } catch (e) {
        this.loggerService.error(
          `Workflow sync failed for ${updatedEntity.email}`,
        );
      }
    }

    return updatedEntity;
  }

  async changePassword(
    id: number,
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    const user = await this.userRepository.findFirstBy({ id });

    if (!user) {
      throw new CustomNotFoundException('User not found.');
    }

    const isValidPassword = await this.hashingService.compare(
      oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new CustomBadRequestException('The provided password is incorrect');
    }
    const newPasswordHash = await this.hashingService.hash(newPassword);

    await this.userPasswordRepository.create({
      password: newPasswordHash,
      expiryDate: this._getPasswordExpiryDate(),
      userId: user.id,
    });

    await this.userRepository.update(id, {
      password: newPasswordHash,
      isPasswordReset: false,
      isFirstLogin: false,
    });

    return { message: 'Password changed successfully' };
  }

  async resetPassword(id: number, { password }: ResetPasswordDto) {
    const user = await this.userRepository.findFirst({ id });
    if (!user) {
      throw new CustomNotFoundException('User not found.');
    }

    const newPasswordHash = await this.hashingService.hash(password);
    user.password = newPasswordHash;

    await this.userPasswordRepository.create({
      password: newPasswordHash,
      expiryDate: this._getPasswordExpiryDate(),
      userId: user.id,
    });

    await this.userRepository.update(id, user);

    return { message: 'Password changed successfully' };
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }

  async userExists(email: string) {
    const user = await this.userRepository.findFirstBy({ email });
    return !!user;
  }

  async findByWfUserId(wfUserId: string) {
    return this.userRepository.findFirstBy({
      wfUserId,
    });
  }

  async findAllByWfIds(wfUserIds: string[]) {
    return await this.userRepository.findAllBy(
      {
        wfUserId: In(wfUserIds),
      },
      ['accounts.admin'],
    );
  }

  async findAllByAccountIds(userIds: number[]) {
    return await this.userRepository.findAllBy({
      id: In(userIds),
    });
  }

  async checkPasswordExpiry(
    userId: number,
  ): Promise<{ isExpired: boolean } | undefined> {
    try {
      const user = await this.userRepository.findOne(userId, ['passwords']);

      if (!user) {
        throw new CustomNotFoundException('User not found.');
      }

      let latestPassword = user.passwords.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0];

      if (!latestPassword) {
        latestPassword = await this.createInitialPassword(user);
      }

      const currentDate = new Date();
      const isExpired = latestPassword.expiryDate <= currentDate;

      return { isExpired };
    } catch (error: any) {
      this.loggerService.log(error);
      throw error;
    }
  }

  private async createInitialPassword(user: User): Promise<UserPassword> {
    return await this.userPasswordRepository.create({
      expiryDate: this._getPasswordExpiryDate(),
      password: user.password,
      userId: user.id,
    });
  }
}
