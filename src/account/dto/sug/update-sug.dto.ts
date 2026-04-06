import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateSugDto } from './create-sug.dto';
import { UpdateAccountDto } from '../update-account.dto';

export class UpdateSugDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateSugDto, ['accountType'])),
) {
  @ApiProperty({
    description: 'photos',
    required: false,
    type: Array,
  })
  @IsOptional()
  photos: any;
}
