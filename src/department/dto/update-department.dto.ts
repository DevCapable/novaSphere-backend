import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends IntersectionType(
  PartialType(OmitType(CreateDepartmentDto, ['accountType'])),
) {}
