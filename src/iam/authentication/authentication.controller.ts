import { omit } from '@app/core/util';
import { LocalAuthGuard, RtGuard } from '@app/iam/authentication/guards';
import type { CurrentUserData } from '@app/iam/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public } from '@app/iam/decorators';
import { UpdateUserProfileDto } from '@app/user/dto/update-user-profile.dto';
import { AuthenticationService } from './authentication.service';
import {
  ForgotPasswordDto,
  ImpersonateAccountDto,
  LoginDto,
  RegisterDto,
  ResendOtpDto,
  SwitchAccountDto,
  VerifyOtpDto,
} from './dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { ApiEndPoint } from '@app/core/interface/api-endpoint.interface';
import { EntityType } from '@app/audit-log/enum';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { UserService } from '@app/user/user.service';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { BaseService } from '@app/core/base/base.service';
import type { Request } from 'express';
import { ExternalLinkOriginEnum } from '../enum';

@Controller(ApiEndPoint.AUTH)
@ApiTags(ApiEndPoint.AUTH)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an Individual Account',
  })
  @ApiResponse({
    status: 201,
    description: 'user created successfully',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER,
      service: UserService,
    }),
  )
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Login as user of any Account',
  })
  @Post('/login')
  async login(
    @CurrentUser() user: CurrentUserData,
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin = ExternalLinkOriginEnum[originApp];

    const ip = BaseService.getClientIp(req);
    return this.authService.initiateLogin(user, loginDto, ip, externalOrigin);
  }

  @Public()
  @ApiOperation({
    summary: 'Verify OTP',
  })
  @Post('/verify-otp')
  verifyOtp(@Body() otpDto: VerifyOtpDto, @Req() req: Request) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin = ExternalLinkOriginEnum[originApp];

    const ip = BaseService.getClientIp(req);
    return this.authService.verifyLoginOtp(otpDto, ip, externalOrigin);
  }

  @Public()
  @ApiOperation({
    summary: 'Resend OTP',
  })
  @Post('/resend-otp')
  resendOtp(@Body() otpDto: ResendOtpDto, @Req() req: Request) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin = ExternalLinkOriginEnum[originApp];

    const ip = BaseService.getClientIp(req);
    return this.authService.resendOtp(otpDto, ip, externalOrigin);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Forgot password',
  })
  @ApiResponse({
    status: 201,
    description: '',
  })
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Authenticated user data',
  })
  @Get('/me')
  me(@CurrentUser() user: CurrentUserData) {
    return omit(user, ['password', 'hashedRt', 'wfUserPassword']);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update authenticated user data',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER,
      service: UserService,
    }),
  )
  @Patch('/me')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return await this.authService.updateUser(user, updateUserProfileDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.USER_PASSWORD,
      service: UserService,
    }),
  )
  @Patch('/me/change-password')
  async changePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(user, changePasswordDto);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@CurrentUser() user: CurrentUserData, @Req() req: Request) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin =
      ExternalLinkOriginEnum[originApp] ?? ExternalLinkOriginEnum.NOGIC;

    return this.authService.logout(user, externalOrigin);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/logout-all')
  async logoutAll(@CurrentUser() user: CurrentUserData, @Req() req: Request) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin =
      ExternalLinkOriginEnum[originApp] ?? ExternalLinkOriginEnum.NOGIC;

    return this.authService.logout(user, externalOrigin);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/validate-user')
  async validateUser(@Body() user: { email: string; password: string }) {
    return this.authService.validateUser(user.email, user.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Get('/refresh')
  async refreshToken(@Req() req) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin = ExternalLinkOriginEnum[originApp];
    return await this.authService.refreshTokens(req, externalOrigin);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/impersonate')
  @Accounts(AccountTypeEnum.ADMIN)
  async impersonate(@Body() impersonateAccountDto: ImpersonateAccountDto) {
    return this.authService.impersonateAccount(impersonateAccountDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/switch-account')
  async switchAccount(@Body() switchAccountDto: SwitchAccountDto) {
    return this.authService.switchAccount(switchAccountDto);
  }
}
