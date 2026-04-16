import { PartialType } from '@nestjs/swagger';
import { CreateJobExperienceDto } from './create-job-experience.dto';

export class UpdateJobExperienceDto extends PartialType(
  CreateJobExperienceDto,
) {}
