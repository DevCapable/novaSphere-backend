import { Module, forwardRef, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { StaffModule } from '@app/staff/staff.module';
import { RoleModule } from '@app/role/role.module';
import { AccountModule } from '@app/account/account.module';
import { UserVerification } from './entities/user-verification.entity';
import { UserPassword } from './entities/user-password.entity';
import { LoginAttempt } from './entities/login-attempt.entity';
import { UserPasswordRepository } from './user-password.repository';
import { ResetPasswordEvent } from './event/reset-password.event';
import { ResetPasswordListener } from './event/listeners/reset-password.listener';
import { WorkflowModule } from '@app/workflow/workflow.module';
import { SyncWorkflowListener } from '@app/user/event';
import { UserSetting } from './entities/user-setting.entity';
import { UserSettingRepository } from './user-setting.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserVerification,
      LoginAttempt,
      UserPassword,
      UserSetting,
    ]),
    forwardRef(() => StaffModule),
    forwardRef(() => AccountModule),
    RoleModule,
    WorkflowModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserPasswordRepository,
    { provide: HashingService, useClass: BcryptService },
    ResetPasswordEvent,
    ResetPasswordListener,
    SyncWorkflowListener,
    UserSettingRepository,
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}
