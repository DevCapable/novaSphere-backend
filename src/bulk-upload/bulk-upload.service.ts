import { Injectable } from '@nestjs/common';
import { BaseService } from '@app/core/base/base.service';
import { BulkUpload } from './entities/bulk-upload.entity';
import { BulkUploadRepository } from './bulk-upload.repository';

@Injectable()
export class BulkUploadService extends BaseService<BulkUpload> {
  constructor(bulkUploadRepository: BulkUploadRepository) {
    super(bulkUploadRepository);
  }
}
