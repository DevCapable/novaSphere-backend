import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateBulkUploadDto {
  @IsInt()
  @ApiProperty({ type: 'integer' })
  accountId: number;

  @IsString()
  @ApiProperty()
  filePath: string;

  @IsString()
  @ApiProperty()
  uploadableType: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: 'integer' })
  uploadableId?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: 'integer' })
  totalImported?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: 'integer' })
  totalFailed?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: 'integer' })
  total?: number;

  @IsOptional()
  @IsJSON()
  @ApiProperty({ type: 'object' })
  messageLog?: any;
}
