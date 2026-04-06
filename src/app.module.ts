import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule } from '@sentry/nestjs/setup';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { IamModule } from './iam/iam.module';
import { BaseRecordModule } from './base-record/base-record.module';
import { DatabaseModule } from '@app/database/database.module';
import { DocumentModule } from './document/document.module';
import { ReviewModule } from './review/review.module';
import { FaqModule } from './faq/faq.module';
import { StaffModule } from './staff/staff.module';
import { BulkUploadModule } from './bulk-upload/bulk-upload.module';
import { WorkflowModule } from '@app/workflow/workflow.module';
// import { MailModule } from './mail/mail.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from './notification/notification.module';
import { GuidelineModule } from '@app/guideline/guideline.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpExceptionFilter } from '@app/core/error/http-error.filter';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ClsModule } from 'nestjs-cls';
import { UserStorageInterceptor } from './core/interceptors/user-storage.interceptor';
import IORedis from 'ioredis';
import { RedisModule } from './redis/redis.module';
import { APP_REDIS } from './redis/constants';
import { getConnectionToken } from './redis/utils';
import { SentryRequestContextInterceptor } from './sentry/sentry.interceptor';
import { LoggerModule } from '@app/logger';
import { AppSocketGateway } from './socket/socket.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { StatModule } from './stat/stat.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      name: APP_REDIS,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          host: configService.getOrThrow('REDIS_URL'),
          port: configService.getOrThrow('REDIS_PORT'),
          password: configService.getOrThrow('REDIS_PASSWORD'),
          maxRetriesPerRequest: null,
          ...(isProduction && { tls: {} }),
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [RedisModule],
      useFactory: (connection: IORedis) => ({ connection }),
      inject: [getConnectionToken(APP_REDIS)],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    EventEmitterModule.forRoot(),
    SentryModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule,
    NotificationModule,
    DatabaseModule,
    BaseRecordModule,
    IamModule,
    AccountModule,
    UserModule,
    DocumentModule,
    ReviewModule,
    FaqModule,
    StaffModule,
    BulkUploadModule,
    WorkflowModule,
    MailModule,
    NotificationModule,
    RoleModule,
    PermissionModule,
    StatModule,
    GuidelineModule,
    AuditLogModule,
    DepartmentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserStorageInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryRequestContextInterceptor,
    },
    AppSocketGateway,
  ],
})
export class AppModule {}
