import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import type { StaffQueue } from '../interface';
import { BulkUploadEvent } from '@app/bulk-upload/enum';
import { LoggerService } from '@app/logger';

@Injectable()
export class StaffBulkUploadListener {
  constructor(
    @InjectQueue('STAFF_BULK_UPLOAD_QUEUE')
    private readonly staffBulkuploadQueue: Queue,
    private readonly loggerService: LoggerService,
  ) {}

  @OnEvent(BulkUploadEvent.STAFF)
  async handleBulkUploadEvent(payloadToQueue: StaffQueue) {
    const delay = 10000;

    try {
      await this.staffBulkuploadQueue.add('staffBulkUpload', payloadToQueue, {
        delay,
        attempts: 3,
        removeOnComplete: true,
      });
    } catch (error) {
      this.loggerService.log('Failed to add job to queue');
    }
  }
}
