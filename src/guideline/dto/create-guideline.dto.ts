import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  GuidelineAccountType,
  GuidelineModuleType,
} from '@app/guideline/interfaces';
import { Document } from '@app/document/types';
export class CreateGuidelineDto {
  @ApiProperty({
    type: String,
    description: 'guidelines title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ enum: GuidelineModuleType, required: false })
  @IsOptional()
  @IsEnum(GuidelineModuleType)
  module: GuidelineModuleType;

  @ApiProperty({ enum: GuidelineAccountType, required: false })
  @IsNotEmpty()
  @IsEnum(GuidelineAccountType)
  accountType: GuidelineAccountType;

  @IsNotEmpty()
  documentFiles: Document[];
}
