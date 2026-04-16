import { Module } from '@nestjs/common';
import { JobExperienceService } from './job-experience.service';
import { JobExperienceRepository } from './job-experience.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobExperienceController } from '@app/job-experience/job-experience.controller';
import { JobExperience } from '@app/job-experience/entities/job-experience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobExperience])],
  controllers: [JobExperienceController],
  providers: [JobExperienceService, JobExperienceRepository],
  exports: [JobExperienceRepository],
})
export class JobExperienceModule {}
