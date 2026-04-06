import { Account } from '@app/account/entities/account.entity';
import { Admin } from '@app/account/entities/admin.entity';
import { Institution } from '@app/account/entities/institution.entity';
import { Individual } from '@app/account/entities/individual.entity';
import { BaseRecordRepository } from '@app/base-record/base-record.repository';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { Document } from '@app/document/entities/document.entity';
import { Faq } from '@app/faq/entities/faq.entity';
import { LoggerModule } from '@app/logger';
import { PermissionGroup } from '@app/permission/entities/permission-group.entity';
import { Permission } from '@app/permission/entities/permission.entity';
import { Role } from '@app/role/entities/role.entity';
import { User } from '@app/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { seedDataSourceOptions } from '../../typeorm.config';
import { BaseRecordSeeder } from './base-record-seeder';
import { DocumentSeeder } from './document.seeder';
import { FaqSeeder } from './faq.seeder';
import { PermissionGroupSeeder } from './permission-group.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { SeedService } from './seed.service';
import { UserSeeder } from './user-seeder';
import { Sug } from '@app/account/entities/sug.entity';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...seedDataSourceOptions }),
    TypeOrmModule.forFeature([
      BaseRecord,
      Account,
      Individual,
      Institution,
      Sug,
      Admin,
      User,
      Document,
      PermissionGroup,
      Permission,
      Role,
      Faq,
    ]),
  ],
  controllers: [],
  providers: [
    BaseRecordRepository,
    Repository,
    SeedService,
    BaseRecordSeeder,
    DocumentSeeder,
    UserSeeder,
    PermissionGroupSeeder,
    PermissionSeeder,
    RoleSeeder,
    FaqSeeder,
  ],
})
export class SeedModule {}
