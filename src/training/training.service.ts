import { Injectable } from '@nestjs/common';
import { TrainingRepository } from './training.repository';
import { BaseService } from '@app/core/base/base.service';
import { Training } from '@app/training/entities/training.entity';

@Injectable()
export class TrainingService extends BaseService<Training> {
  constructor(private readonly trainingRepository: TrainingRepository) {
    super(trainingRepository);
  }
}
