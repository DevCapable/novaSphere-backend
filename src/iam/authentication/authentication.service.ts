import { AccountService } from '@app/account/account.service';
import {
  validateAccountId,
  generateCryptoString,
  generateRandomNumber,
} from '@app/core/util';
import IORedis from 'ioredis';
import {
  ForgotPasswordDto,
  ImpersonateAccountDto,
  RegisterDto,
  SwitchAccountDto,
} from '@app/iam/authentication/dto';
import jwtConfig from '../../iam/config/jwt.config';
import { UserService } from '@app/user/user.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UpdateUserProfileDto } from '@app/user/dto/update-user-profile.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { UserRepository } from '@app/user/user.repository';
import { HashingService } from '@app/user/hashing/hashing.service';
import type { CurrentUserData, JwtPayload } from '../interfaces';
import { AuthEvent } from './events/auth.event';
import { AuditAction, EntityType } from '@app/audit-log/enum';
import { AuditLogService } from '@app/audit-log/audit-log.service';
import { APP_REDIS } from '@app/redis/constants';
import { InjectRedisConnection } from '@app/redis/decorators';
// import { Events } from '@app/user/constants';
// import { SyncWorkflowEvent } from '@app/user/event';
import { AccountTypeEnum } from '@app/account/enums';
import { Account } from '@app/account/entities/account.entity';
import { ErrorMessages, LOGIN_CHALLENGE, LOGIN_OTP } from './constants';
import { RolesHelper } from '@app/role/helpers';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SessionService } from '../session/session.service';
import { BaseService } from '@app/core/base/base.service';
import {
  CustomBadRequestException,
  CustomForbiddenException,
  CustomNotFoundException,
  CustomUnauthorizedException,
} from '@app/core/error';
import { WorkflowService } from '@app/workflow/workflow.service';
import { ExternalLinkOriginEnum } from '../enum';
import { User } from '@app/user/entities/user.entity';
import { UserSettingKeyEnum } from '@app/user/enum';

export interface LoginContext {
  accountId: number;
  accountType: AccountTypeEnum;
  accountAgencyPosition?: any;
  sessionKey: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
    private readonly authEvent: AuthEvent,
    private readonly auditLogService: AuditLogService,
    private readonly sessionService: SessionService,
    private readonly workflowService: WorkflowService,

    @InjectRedisConnection(APP_REDIS)
    private redis: IORedis,
  ) {}

  async register(data: RegisterDto) {
    try {
      await this.accountService.create({
        ...data,
        accountType: AccountTypeEnum.INDIVIDUAL,
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

  async validateUser(email, password) {
    return await this.userRepository.login(email, password);
  }

  async resendOtp(data: any, ip: string) {
    const user = await this.userRepository.findFirstBy({
      email: data.email,
    });

    if (!user) throw new CustomBadRequestException('User with email not found');
    const cooldownKey = `OTP_RESEND:${user.id}`;

    const isCoolingDown = await this.redis.get(cooldownKey);
    if (isCoolingDown) {
      throw new CustomBadRequestException(
        'Please wait before requesting another OTP',
      );
    }

    await this.redis.set(cooldownKey, '1', 'EX', 60);
    const indexKey = `${LOGIN_OTP}:${user.id}`;

    await this.redis.del(indexKey);
    console.log('Login request received from origin:', data);

    return this.sendOtp(user);
  }

  async verifyLoginOtp(
    data: any,
    ip: string,
    origin: ExternalLinkOriginEnum = ExternalLinkOriginEnum.NOGIC,
  ) {
    const challengeKey = `${LOGIN_CHALLENGE}:${data.otp}`;
    const challenge = await this.redis.get(challengeKey);

    if (!challenge) {
      throw new CustomUnauthorizedException('Invalid otp');
    }

    const { email } = JSON.parse(challenge);
    const user = await this.userRepository.findFirstBy({
      email,
    });

    await this.checkOtp(data.otp, user, origin);
    await this.redis.del(challengeKey);

    return this.login(user, { email }, ip);
  }

  async initiateLogin(
    user: any,
    data: any,
    ip: string,
    // origin: ExternalLinkOriginEnum = ExternalLinkOriginEnum.NOGIC,
  ) {
    const ctx = await this.prepareLoginContext(user, data);

    const isOtpOnLogin = await this.userService.getSettingValue(
      user.id,
      UserSettingKeyEnum.LOGIN_OTP_ENABLED,
    );
    if (isOtpOnLogin) {
      await this.sendOtp(user);
      return {
        data: null,
        code: 'OTP_SENT_TO_EMAIL',
      };
    }
    console.log('Login request received from origin:', data);

    return this.login(user, data, ip, ctx);
  }

  async login(
    user: any,
    data,
    ip,
    // externalOrigin?: ExternalLinkOriginEnum,
    context?: LoginContext,
  ) {
    const ctx = context ?? (await this.prepareLoginContext(user, data));

    const { accountId, accountType, accountAgencyPosition, sessionKey } = ctx;
    const sessionId = await generateCryptoString(16);

    const { accessToken, refreshToken } = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: accountId,
      currentAccountType: accountType,
      currentAccountAdminPosition: accountAgencyPosition || '',
      session: sessionId,
    });

    const hashedRt = await this.hashingService.hash(refreshToken);
    await this.userRepository.update(user.id, {
      lastLogin: new Date(),
      hashedRt,
    });

    await this.sessionService.storeSession(sessionKey, sessionId);

    this.auditLogService.emitAction({
      entityId: user.id,
      entityTitle: String(accountId),
      entityType: EntityType.USER,
      changes: null,
      userId: user.id,
      action: AuditAction.LOGIN,
      ipAddress: ip,
      // origin: externalOrigin,
    });

    /*
    this.eventEmitter.emit(
      Events.SYNC_WORKFLOW_EVENT,
      new SyncWorkflowEvent(user),
    );
     */

    return { accessToken, refreshToken };
  }

  async logout(user: CurrentUserData, externalOrigin: string | null) {
    const email = user.email;
    const sessionKey = externalOrigin
      ? `${user.email}:${externalOrigin}`
      : user.email;

    await this.sessionService.clearSession(sessionKey);
    await this.removeRefreshToken(email);
    await this.workflowService.clearToken(email);
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    try {
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

      const resetToken = await this.userService.generateToken(user.id);

      await this.authEvent.forgotPasswordEvent({
        token: resetToken.token,
        user,
      });
      return {
        message: 'Password reset instructions have been sent to your email.',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: any, data: UpdateUserProfileDto) {
    await this.userService.update(user.id, data);
    const updatedFields = Object.keys(data)
      .filter((key) => data[key] !== undefined)
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ');

    const message = updatedFields
      ? `Your ${updatedFields} ${
          updatedFields.includes(',') ? 'have' : 'has'
        } been updated.`
      : 'No fields were updated.';
    return { message };
  }

  async changePassword(user: any, changePassword: ChangePasswordDto) {
    try {
      return await this.userService.changePassword(user.id, changePassword);
    } catch (error) {
      throw error;
    }
  }

  async refreshTokens(payload, externalOrigin?: string) {
    const user = await this.userRepository.findOne(
      {
        email: payload.user.email,
      },
      ['accounts', 'accounts.admin'],
    );

    if (!user) throw new CustomForbiddenException('Access Denied');

    const isRefreshTokenMatching = await this.hashingService.compare(
      payload.user.refreshToken,
      user.hashedRt,
    );

    if (!isRefreshTokenMatching)
      throw new CustomUnauthorizedException('Invalid Token');

    await this.jwtService.verifyAsync(payload.user.refreshToken, {
      secret: this.jwtConfiguration.refresh_secret,
    });

    const sessionId = await generateCryptoString(16);

    const currentAccountId =
      payload.user.currentAccountId || user.accounts[0]?.id;
    const account =
      user.accounts.find((a) => a.id === currentAccountId) || user.accounts[0];

    const tokens = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: account.id,
      currentAccountType: account.type,
      currentAccountAdminPosition: account?.admin?.position || '',
      session: sessionId,
    });

    const sessionKey = externalOrigin
      ? `${user.email}:${externalOrigin}`
      : user.email;

    await this.sessionService.storeSession(sessionKey, sessionId);

    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async removeRefreshToken(email) {
    // TODO - [Perfomance Improvement] This can be an atomic request
    // const updateResult = await Repository.update({ email }, { hashedRt: null });
    // if (updateResult.affected === 0) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    const user = await this.userRepository.findFirst({ email });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    this.userRepository.update(user.id, {
      hashedRt: null,
    });
  }

  async impersonateAccount(impersonateAccountDto: ImpersonateAccountDto) {
    const requestingUser = BaseService.getCurrentUser();

    if (
      !RolesHelper.hasAdminRole(requestingUser.roles) ||
      requestingUser.account.type !== AccountTypeEnum.ADMIN
    )
      throw new CustomUnauthorizedException();

    const { userId, accountId } = impersonateAccountDto;

    const user = await this.userRepository.findOne(userId, [
      'roles',
      'accounts',
      'accounts.admin',
    ]);

    if (!user) throw new CustomNotFoundException(ErrorMessages.UserNotFound);

    if (requestingUser.id === user.id)
      throw new CustomForbiddenException(
        ErrorMessages.SelfImpersonationForbidden,
      );

    let account: Account | null = user.accounts[0] || null;

    if (accountId) {
      account = user.accounts.find((account) => account.id === accountId);

      if (!account)
        throw new CustomUnauthorizedException(ErrorMessages.InvalidAccount);
    }

    await this.sessionService.clearSession(requestingUser.email);

    const tokens = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: account.id,
      currentAccountType: account.type,
      currentAccountAdminPosition: account?.admin?.position || '',
    });

    this.auditLogService.emitAction({
      entityId: user.id.toString(),
      entityTitle: user.firstName + ' ' + user.lastName,
      entityType: EntityType.USER,
      userId: requestingUser.id,
      action: AuditAction.IMPERSONATE,
      changes: null,
      ipAddress: requestingUser.ipAddress,
    });

    return tokens;
  }

  async switchAccount({ accountId }: SwitchAccountDto) {
    const user = BaseService.getCurrentUser();

    const account = user.accounts.find((account) => account.id === accountId);
    if (!account)
      throw new CustomUnauthorizedException(ErrorMessages.InvalidAccount);

    const { accessToken, refreshToken } = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: account.id,
      currentAccountType: account.type,
      currentAccountAdminPosition: account?.admin?.position || '',
    });

    this.auditLogService.emitAction({
      entityId: user.id.toString(),
      entityTitle: user.firstName + ' ' + user.lastName,
      entityType: EntityType.USER,
      userId: user.id,
      action: AuditAction.SWITCH_ACCOUNT,
      changes: null,
      ipAddress: user.ipAddress,
    });

    return { accessToken, refreshToken };
  }

  getRefreshTokenOptions() {
    return this.getTokenOptions();
  }

  private getTokenOptions() {
    const options: JwtSignOptions = {
      secret: this.jwtConfiguration.refresh_secret,
    };

    const expiration = this.jwtConfiguration.refreshTokenTtl;

    if (expiration) options.expiresIn = expiration;

    return options;
  }

  async getTokens(userId: number, payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<JwtPayload>(userId, this.jwtConfiguration.accessTokenTtl, {
        email: payload.email,
        currentAccountId: payload.currentAccountId,
        currentAccountType: payload.currentAccountType,
        currentAccountAdminPosition: payload.currentAccountAdminPosition || '',
        session: payload.session,
      }),
      this.signToken<JwtPayload>(
        userId,
        this.jwtConfiguration.refreshTokenTtl,
        {
          email: payload.email,
          currentAccountId: payload.currentAccountId,
          currentAccountType: payload.currentAccountType,
          currentAccountAdminPosition:
            payload.currentAccountAdminPosition || '',
        },
        this.jwtConfiguration.refresh_secret,
      ),
    ]);
    return { accessToken, refreshToken };
  }

  private async signToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
    secret = this.jwtConfiguration.secret,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret,
        expiresIn,
      },
    );
  }

  private async sendOtp(user: any) {
    const otp = generateRandomNumber(6);
    const hashedOtp = await this.hashingService.hash(String(otp));
    const otpKey = `${LOGIN_OTP}:${user.id}`;

    await this.redis.set(otpKey, hashedOtp, 'EX', 300);

    await this.redis.set(
      `${LOGIN_CHALLENGE}:${otp}`,
      JSON.stringify({
        userId: user.id,
        email: user.email,
      }),
      'EX',
      300,
    );

    this.authEvent.otpEvent({
      email: user.email,
      otp,
    });

    return {
      requiresOtp: true,
      msg: 'Kindly check your email for a login otp',
    };
  }

  private async checkOtp(
    otp: string,
    user: any,
    origin?: ExternalLinkOriginEnum,
  ) {
    const otpKey = `${LOGIN_OTP}:${user.id}:${origin}`;
    const hashedOtp = await this.redis.get(otpKey);

    if (!hashedOtp) {
      throw new CustomUnauthorizedException('Invalid OTP');
    }

    const isValid = await this.hashingService.compare(String(otp), hashedOtp);

    if (!isValid) {
      throw new CustomUnauthorizedException('Invalid OTP');
    }

    await this.redis.del(otpKey);
  }

  private async prepareLoginContext(
    user: any,
    data: any,
    // origin: ExternalLinkOriginEnum,
  ): Promise<LoginContext> {
    let accountId = data.accountId || null;
    const sessionKey = user.email;

    if (!user?.accounts?.length) {
      throw new CustomNotFoundException('No Accounts created for user');
    }

    if (validateAccountId(accountId, user.accounts)) {
      throw new CustomBadRequestException('Invalid Account Specified');
    }

    const hasActiveSession =
      await this.sessionService.hasActiveSession(sessionKey);

    if (hasActiveSession) {
      throw new CustomUnauthorizedException(
        ErrorMessages.ExistingSessionForUser,
        'ERR_ACT_SESS_EXIST',
      );
    }

    // resolve account
    let accountType: AccountTypeEnum;
    let accountAgencyPosition: string | undefined;

    if (!accountId) {
      const account = user.accounts[0];
      accountId = account.id;
      accountType = account.type;
      accountAgencyPosition = account?.agency?.position;
    } else {
      const account = user.accounts.find((a) => a.id === accountId);
      accountType = account.type;
    }

    return {
      accountId,
      accountType,
      accountAgencyPosition,
      sessionKey,
    };
  }

  private isNcdfAccess(user: User): boolean {
    return user.roles.some(
      (role) => role.slug === 'ncdf-super-admin' || role.slug === 'ncdf-access',
    );
  }
}
