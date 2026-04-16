import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UpdateAccountDto } from '../update-account.dto';
import { CreateLecturerDto } from './create-lecturer.dto';

export class UpdateLecturerDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateLecturerDto, ['accountType'])),
) {}
