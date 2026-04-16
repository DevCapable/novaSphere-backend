import { Injectable } from '@nestjs/common';
import { JobExperienceRepository } from './job-experience.repository';

import { JobExperience } from '@app/job-experience/entities/job-experience.entity';
import { BaseService } from '@app/core/base/base.service';

@Injectable()
export class JobExperienceService extends BaseService<JobExperience> {
  constructor(
    private readonly jobExperienceRepository: JobExperienceRepository,
  ) {
    super(jobExperienceRepository);
  }

  async create(data: any) {
    data.measurementUnitId === 0 ? delete data.measurementUnitId : data;
    return super.create(data);
  }
}
