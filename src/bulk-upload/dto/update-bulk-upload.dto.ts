import { PartialType } from '@nestjs/swagger';
import { CreateBulkUploadDto } from './create-bulk-upload.dto';

export class UpdateBulkUploadDto extends PartialType(CreateBulkUploadDto) {}
