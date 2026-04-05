import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateInstitutionDto } from './create-institution.dto';

export class UpdateInstitutionDto extends IntersectionType(
  PartialType(OmitType(CreateInstitutionDto, ['accountType'])),
) {}
