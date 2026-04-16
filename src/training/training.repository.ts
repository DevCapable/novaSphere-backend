import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { Training } from '@app/training/entities/training.entity';

@Injectable()
export class TrainingRepository extends BaseRepository<Training> {
  public fillable = [
    'accountId',
    'name',
    'orgName',
    'countryId',
    'duration',
    'year',
    'description',
    'uuid',
  ];

  public relations = ['country'];

  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
  ) {
    super(trainingRepository);
  }

  async findMany(accountId) {
    return this.trainingRepository.find({
      where: {
        accountId,
      },
    });
  }
}
