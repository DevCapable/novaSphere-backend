import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Document } from '@app/document/types';

export class CreateCertificationDto {
  @ApiProperty({
    type: String,
    description: 'name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @ApiProperty({
    type: String,
    description: 'certificate number ',
  })
  @IsString()
  @IsNotEmpty()
  certificateNo: string;

  @ApiProperty({
    type: String,
    description: 'year',
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    type: Number,
    description: 'expiration date',
  })
  @IsNotEmpty()
  @IsNumber()
  expiryYear: number;

  @ApiProperty({
    type: Array,
  })
  @IsOptional()
  @IsArray()
  documentFiles: Document[];
}
