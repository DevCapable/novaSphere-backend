// import { BaseRepository } from '@app/base/base.repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '@app/skill/entities/skill.entity';
import { BaseRepository } from '@app/core/base/base.repository';

@Injectable()
export class SkillRepository extends BaseRepository<Skill> {
  public fillable = [
    'accountId',
    'categoryId',
    'levelId',
    'year',
    'description',
    'uuid',
  ];

  public relations = ['category', 'level'];

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {
    super(skillRepository);
  }

  async findMany(accountId) {
    return this.skillRepository.find({
      where: {
        accountId,
      },
      relations: {
        category: true,
      },
    });
  }
}
