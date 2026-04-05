import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { REQUEST_USER_KEY } from './iam.constant';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import {
  JwtStrategy,
  LocalStrategy,
  RefreshTokenStrategy,
} from './authentication/strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentication/guards';
import { AccountGuard } from '../account/guards/account.guard';
import { HashingService } from '@app/user/hashing/hashing.service';
import { BcryptService } from '@app/user/hashing/bcrypt.service';
import { AuthEvent } from './authentication/events/auth.event';
import { AuthListener } from './authentication/events/listeners/auth.listener';
import { SessionService } from './session/session.service';
import { SessionGuard } from './session/guards';
import { AbilityFactory } from './authorization/permission.ability.factory';
import { PermissionsGuard } from './authorization/guards';

@Module({
  imports: [
    forwardRef(() => UserModule),
    AccountModule,
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: REQUEST_USER_KEY,
      session: false,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    AuthEvent,
    AuthListener,
    SessionService,
    AbilityFactory,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    { provide: HashingService, useClass: BcryptService },
  ],
  exports: [AbilityFactory],
})
export class IamModule {}
