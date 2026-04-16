import { Sug } from '@app/account/entities/sug.entity';
import { AccountSubscriber } from '@app/account/entities/subscribers/account.subscriber';
import { BaseRecordModule } from '@app/base-record/base-record.module';
import { DocumentModule } from '@app/document/document.module';
import { RoleModule } from '@app/role/role.module';
import { StatModule } from '@app/stat/stat.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AccountProfileController } from './account-profile.controller';
import { AccountController } from './account.controller';
import { AccountPublicController } from './account.public.controller';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

import { Account } from './entities/account.entity';
import { Admin } from './entities/admin.entity';
import { Auditor } from './entities/auditor.entity';
import { CommunityVendor } from './entities/community-vendor.entity';
import { Institution } from './entities/institution.entity';
import { Individual } from './entities/individual.entity';
import { Lecturer } from './entities/lecturer.entity';
import { AccountEvent } from './events/account.event';
import { AccountListener } from './events/listeners/account.listener';
import { Department } from './entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Admin,
      Institution,
      Individual,
      CommunityVendor,
      Auditor,
      Department,
      Sug,
      Lecturer,
    ]),
    forwardRef(() => UserModule),
    RoleModule,
    DocumentModule,
    forwardRef(() => StatModule),
    BaseRecordModule,
  ],
  controllers: [
    AccountController,
    AccountProfileController,
    AccountPublicController,
  ],
  providers: [
    AccountService,
    AccountRepository,
    AccountSubscriber,
    AccountListener,
    AccountEvent,
  ],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
