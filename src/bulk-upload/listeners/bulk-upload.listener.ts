import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { Queue } from 'bullmq';
import { BulkUploadEvent } from '../enum';
import type { BulkUploadQueueData } from '../interface';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class BulkUploadListener {
  constructor(
    @InjectQueue('BULK_UPLOAD_QUEUE')
    private readonly bulkUploadQueue: Queue,
    private readonly loggerService: LoggerService,
  ) {}

  @OnEvent(BulkUploadEvent.GENERIC)
  async handleBulkUploadEvent(payloadToQueue: BulkUploadQueueData) {
    const delay = 10000;
    const payload = payloadToQueue;

    try {
      await this.bulkUploadQueue.add('bulkUpload', payload, {
        delay,
        attempts: 3,
        removeOnComplete: true,
      });
    } catch (error) {
      this.loggerService.log('Failed to add bulk upload job to queue');
    }
  }
}
