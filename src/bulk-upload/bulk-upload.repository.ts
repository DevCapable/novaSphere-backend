import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { BulkUpload } from './entities/bulk-upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BulkUploadRepository extends BaseRepository<BulkUpload> {
  public fillable = [
    'accountId',
    'filePath',
    'uploadableType',
    'uploadableId',
    'totalImported',
    'totalFailed',
    'totalUpdated',
    'total',
    'messageLog',
    'status',
    'uuid',
  ];

  public searchable = ['filePath'];

  public relations = ['account.operator', 'account.company'];

  constructor(
    @InjectRepository(BulkUpload) bulkUploadRepository: Repository<BulkUpload>,
  ) {
    super(bulkUploadRepository);
  }
}
