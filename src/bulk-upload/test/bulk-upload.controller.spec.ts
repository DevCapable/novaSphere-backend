import { Test, TestingModule } from '@nestjs/testing';
import { BulkUploadController } from './bulk-upload.controller';
import { BulkUploadService } from './bulk-upload.service';

describe('BulkUploadController', () => {
  let controller: BulkUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkUploadController],
      providers: [BulkUploadService],
    }).compile();

    controller = module.get<BulkUploadController>(BulkUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
