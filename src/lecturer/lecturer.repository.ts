import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { LoggerService } from '@app/logger';
import { Department } from '@app/account/entities/department.entity';
import { Lecturer } from '@app/account/entities/lecturer.entity';

@Injectable()
export class LecturerRepository extends BaseRepository<Lecturer> {
  public fillable: string[] = [
    'name',
    'code',
    'description',
    'departmentType',
    'headOfDept',
    'isActive',
    'email',
    'phoneNumber',
    'accountId',
    'institutionId',
    'parentId',
  ];

  public searchable = ['name', 'code', 'email'];

  constructor(
    @InjectRepository(Lecturer)
    private readonly lecturerRepository: Repository<Lecturer>,
    private readonly entityManager: EntityManager,
    private readonly loggerService: LoggerService,
  ) {
    super(lecturerRepository);
  }

  _findAll(
    queryBuilder: SelectQueryBuilder<Lecturer>,
    options: Record<string, any>,
  ) {
    const { isActive, search, accountId } = options;

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(entity.name) LIKE :search OR LOWER(entity.code) LIKE :search)',
        {
          search: `%${search.toLowerCase()}%`,
        },
      );
    }

    if (isActive !== undefined) {
      const activeValue = isActive === 'true' || isActive === true ? 1 : 0;
      queryBuilder.andWhere('entity.isActive = :activeValue', {
        activeValue,
      });
    }

    console.log('accountId in repository:', accountId); // Debug log to check accountId value
    if (accountId) {
      queryBuilder.andWhere('entity.accountId = :accountId', { accountId });
    }

    return queryBuilder;
  }
}
