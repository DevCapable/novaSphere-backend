import { Module, forwardRef } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffRepository } from './staff.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { BulkUploadModule } from '@app/bulk-upload/bulk-upload.module';
import { BaseRecordModule } from '@app/base-record/base-record.module';
import { AccountModule } from '@app/account/account.module';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    BaseRecordModule,
    forwardRef(() => BulkUploadModule),
    forwardRef(() => AccountModule),
    forwardRef(() => UserModule),
  ],
  controllers: [StaffController],
  providers: [StaffService, StaffRepository],
  exports: [StaffService, StaffRepository],
})
export class StaffModule {}
