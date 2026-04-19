import { PartialType } from '@nestjs/swagger';
import { CreateAcademicDto } from '@app/academic/dto/create-academic.dto';

export class UpdateAcademicDto extends PartialType(CreateAcademicDto) {}
