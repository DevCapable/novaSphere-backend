import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { Academic } from '@app/academic/entities/academic.entity';

@Injectable()
export class AcademicRepository extends BaseRepository<Academic> {
  public fillable = [
    'accountId',
    'countryId',
    'levelId',
    'disciplineId',
    'courseId',
    'institutionId',
    'degreeId',
    'uuid',
    'year',
    'institutionOther',
    'foreignCourse',
    'foreignDiscipline',
    'foreignProgram',
    'secondaryClass',
  ];

  public relations = [
    'country',
    'level',
    'discipline',
    'course',
    'institution',
    'degree',
  ];

  constructor(
    @InjectRepository(Academic)
    private readonly academicRepository: Repository<Academic>,
  ) {
    super(academicRepository);
  }

  async findMany(accountId) {
    return this.academicRepository.find({
      where: {
        accountId,
      },
      relations: {
        degree: true,
        course: true,
        level: true,
      },
    });
  }
}
