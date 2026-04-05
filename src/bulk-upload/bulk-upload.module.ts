import { forwardRef, Global, Module } from '@nestjs/common';
import { BulkUploadService } from './bulk-upload.service';
import { BulkUploadController } from './bulk-upload.controller';
import { BulkUploadRepository } from './bulk-upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkUpload } from './entities/bulk-upload.entity';
import { BullModule } from '@nestjs/bullmq';
import { BulkUploadProcessor } from './worker/bulk-upload-worker';
import { BulkUploadListener } from './listeners/bulk-upload.listener';
import { StaffModule } from '@app/staff/staff.module';
import { StaffService } from '@app/staff/staff.service';
import { BulkUploadProgressService } from './bulk-upload-progress.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([BulkUpload]),
    BullModule.registerQueueAsync({
      name: 'BULK_UPLOAD_QUEUE',
    }),
    forwardRef(() => StaffModule),
  ],
  controllers: [BulkUploadController],
  providers: [
    BulkUploadService,
    BulkUploadRepository,
    BulkUploadProcessor,
    BulkUploadProgressService,
    BulkUploadListener,
    {
      provide: 'MODULE_HANDLERS',
      useFactory: (staffService: StaffService) => ({
        staff: staffService,
      }),
      inject: [StaffService],
    },
  ],
  exports: [
    BulkUploadService,
    BulkUploadProgressService,
    BulkUploadRepository,
    BulkUploadListener,
  ],
})
export class BulkUploadModule {}
