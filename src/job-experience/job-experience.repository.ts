import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { JobExperience } from '@app/job-experience/entities/job-experience.entity';

@Injectable()
export class JobExperienceRepository extends BaseRepository<JobExperience> {
  public fillable = [
    'accountId',
    'orgAddress',
    'jobFamilyId',
    'jobTypeId',
    'startDate',
    'endDate',
    'description',
    'countryId',
    'orgName',
    'uuid',
  ];

  public relations = ['jobType', 'jobFamily', 'country'];
  constructor(
    @InjectRepository(JobExperience)
    private readonly jobExperienceRepository: Repository<JobExperience>,
  ) {
    super(jobExperienceRepository);
  }

  async findMany(accountId) {
    return this.jobExperienceRepository.find({
      where: {
        accountId,
      },
      relations: {
        jobType: true,
      },
    });
  }
}
