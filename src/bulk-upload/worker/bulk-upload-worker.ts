import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BulkUploadQueueData } from '../interface';
import { Inject } from '@nestjs/common';
import { LoggerService } from '@app/logger/logger.service';

@Processor('BULK_UPLOAD_QUEUE')
export class BulkUploadProcessor extends WorkerHost {
  constructor(
    @Inject('MODULE_HANDLERS')
    private readonly moduleHandlers: Record<string, any>,
    private readonly loggerService: LoggerService,
  ) {
    super();
  }
  async process(job: Job): Promise<any> {
    const { moduleKey, handler, ...data }: BulkUploadQueueData = job.data;
    const moduleService = this.moduleHandlers[moduleKey];

    if (!moduleService || !moduleService[handler]) {
      throw new Error(`Handler ${handler} not found for module ${moduleKey}`);
    }

    try {
      await moduleService[handler](data);
    } catch (error) {
      this.loggerService.log('Failed to process bulk upload job');
    }
  }
}
