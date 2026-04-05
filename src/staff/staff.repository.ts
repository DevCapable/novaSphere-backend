import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  BaseRecord,
  BaseRecordEnum,
} from '@app/base-record/entities/base-record.entity';
import { BaseRecordRepository } from '@app/base-record/base-record.repository';
import { buildFillable, buildSearchQueryBuilder } from '@app/core/util';
import {
  CustomBadRequestException,
  CustomNotFoundException,
} from '@app/core/error';

@Injectable()
export class StaffRepository extends BaseRepository<Staff> {
  public fillable = [
    'employeeNumber',
    'employmentNatureId',
    'accountId',
    'individualAccountId',
    'employmentDate',
    'jobTypeId',
    'isManagement',
    'location',
    'deletedAt',
    'workExperienceYears',
    'yearsInCompany',
    'yearsInCurrentPosition',
    'educationLevelId',
    'dateFirstQuota',
    'dateCurrentQuota',
    'expiryDateOfCurrentQuota',
    'completionDate',
    'cumulativeYearsInCountry',
    'project',
    'temporaryWorkPermitRequests',
    'exchangeProgramRequests',
    'uuid',
  ];
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly baseRecordRepository: BaseRecordRepository,
  ) {
    super(staffRepository);
  }

  async findAll(
    filterOptions?: {
      [key: string]: any;
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
    },
    paginationOptions?: { skip?: number; limit?: number },
    relations = [],
  ): Promise<[Staff[], number]> {
    const { sortKey, sortDir, search, type, status, ...searchOptions } =
      filterOptions;
    const { skip, limit } = paginationOptions;
    relations = relations.length ? relations : this.relations;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (limit) {
      queryBuilder.take(Number(limit));
    }

    if (skip) {
      queryBuilder.skip(Number(skip));
    }

    if (sortKey) {
      queryBuilder.orderBy(`entity.${sortKey}`, sortDir || 'ASC');
    }

    queryBuilder.leftJoinAndSelect(
      'entity.individualAccount',
      'individualAccount',
    );
    queryBuilder.leftJoinAndSelect(
      'individualAccount.individual',
      'individual',
    );
    queryBuilder.leftJoinAndSelect('individual.lga', 'lga');
    queryBuilder.leftJoinAndSelect('individual.state', 'state');
    queryBuilder.leftJoinAndSelect('individual.nationality', 'nationality');
    queryBuilder.leftJoinAndSelect('individual.country', 'country');
    queryBuilder.leftJoinAndSelect(
      'individual.stateResidence',
      'stateResidence',
    );
    queryBuilder.leftJoinAndSelect('individualAccount.users', 'users');
    queryBuilder.leftJoinAndSelect(
      'entity.employmentNature',
      'employmentNature',
    );
    queryBuilder.leftJoinAndSelect('entity.educationLevel', 'educationLevel');
    queryBuilder.leftJoinAndSelect('entity.jobType', 'jobType');

    if (search) {
      const searchNumber = Number(search);
      if (!isNaN(searchNumber)) {
        queryBuilder.andWhere('entity.employeeNumber LIKE :searchNumber', {
          searchNumber: `%${searchNumber}%`,
        });
      } else {
        const searchKeyword = `%${search.toUpperCase()}%`;
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere('UPPER(individual.firstName) LIKE :firstName', {
              firstName: searchKeyword,
            })
              .orWhere('UPPER(individual.lastName) LIKE :lastName', {
                lastName: searchKeyword,
              })
              .orWhere('UPPER(users.email) LIKE :email', {
                email: searchKeyword,
              });
          }),
        );
      }
    }

    if (type) {
      const nationality = await this.baseRecordRepository.findFirst({
        name: 'NIGERIAN',
        type: 'NATIONALITY',
      });

      if (type === 'nigerians') {
        queryBuilder.andWhere('individual.nationalityId = :nationalityId', {
          nationalityId: nationality.id,
        });
      } else if (type === 'non-nigerians') {
        queryBuilder.andWhere('individual.nationalityId != :nationalityId', {
          nationalityId: nationality.id,
        });
      }
    }

    if (status === 'archived') {
      queryBuilder.andWhere(`entity.deletedAt IS NOT NULL`);
    }

    buildSearchQueryBuilder(searchOptions, this.searchable, queryBuilder);

    if (status !== 'archived') {
      queryBuilder.andWhere(`entity.deletedAt IS NULL`);
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();
    return [entities, totalCount];
  }

  async findAllStaffNot(
    filterOptions?: {
      [key: string]: any;
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
    },
    paginationOptions?: { skip?: number; limit?: number },
    relations = [],
  ): Promise<[Staff[], number]> {
    const { sortKey, sortDir, search, type, accountId, ...searchOptions } =
      filterOptions;
    const { skip, limit } = paginationOptions;
    relations = relations.length ? relations : this.relations;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (limit) {
      queryBuilder.take(Number(limit));
    }

    if (skip) {
      queryBuilder.skip(Number(skip));
    }

    if (sortKey) {
      queryBuilder.orderBy(`entity.${sortKey}`, sortDir || 'ASC');
    }

    queryBuilder.leftJoinAndSelect(
      'entity.individualAccount',
      'individualAccount',
    );
    queryBuilder.leftJoinAndSelect(
      'individualAccount.individual',
      'individual',
    );
    queryBuilder.leftJoinAndSelect('individual.lga', 'lga');
    queryBuilder.leftJoinAndSelect('individual.state', 'state');
    queryBuilder.leftJoinAndSelect('individual.nationality', 'nationality');
    queryBuilder.leftJoinAndSelect('individual.country', 'country');
    queryBuilder.leftJoinAndSelect(
      'individual.stateResidence',
      'stateResidence',
    );
    queryBuilder.leftJoinAndSelect('individualAccount.users', 'users');
    queryBuilder.leftJoinAndSelect(
      'entity.employmentNature',
      'employmentNature',
    );
    queryBuilder.leftJoinAndSelect('entity.educationLevel', 'educationLevel');
    queryBuilder.leftJoinAndSelect('entity.jobType', 'jobType');

    if (type) {
      const nationality = await this.baseRecordRepository.findFirst({
        name: 'NIGERIAN',
        type: 'NATIONALITY',
      });

      if (type === 'nigerians') {
        queryBuilder.andWhere('individual.nationalityId = :nationalityId', {
          nationalityId: nationality.id,
        });
      } else if (type === 'non-nigerians') {
        queryBuilder.andWhere('individual.nationalityId != :nationalityId', {
          nationalityId: nationality.id,
        });
      }
    }

    // buildSearchQueryBuilder(searchOptions, this.searchable, queryBuilder);
    queryBuilder.andWhere(`entity.deletedAt IS NULL`);

    const [entities, totalCount] = await queryBuilder.getManyAndCount();
    return [entities, totalCount];
  }

  async findById(
    id: number | string,
    relations: string[] = [],
  ): Promise<Staff> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');

    queryBuilder.where({ id });

    if (!relations.length) {
      queryBuilder
        .leftJoinAndSelect('staff.individualAccount', 'individualAccount')
        .leftJoinAndSelect('individualAccount.individual', 'individual')
        .leftJoinAndSelect('individual.state', 'state')
        .leftJoinAndSelect('individual.nationality', 'nationality')
        .leftJoinAndSelect('individual.country', 'country')
        .leftJoinAndSelect('individual.stateResidence', 'stateResidence')
        .leftJoinAndSelect('individualAccount.users', 'users')
        .leftJoinAndSelect('staff.employmentNature', 'employmentNature')
        .leftJoinAndSelect('staff.educationLevel', 'educationLevel')
        .leftJoinAndSelect('staff.jobType', 'jobType');
    }

    const result = await queryBuilder.getOne();

    if (!result) {
      throw new CustomNotFoundException(`Staff with ID ${id} not found`);
    }

    return result;
  }

  async create(data: any, manager?: EntityManager) {
    try {
      const model = manager?.getRepository(Staff) || this.staffRepository;
      const payload = buildFillable({ ...data }, this.fillable);
      return await model.save(payload);
    } catch (error: any) {
      if (error.code === 'ORA-00001') {
        throw new CustomBadRequestException(
          'Duplicate entry: this staff record already exists, please filter by ARCHIVED and restore this staff.',
        );
      }
      throw error;
    }
  }

  async update(id, data, manager?: EntityManager): Promise<Staff> {
    const model = manager ? manager.getRepository(Staff) : this.staffRepository;
    await model.update(id, buildFillable({ ...data }, this.fillable));
    return this.findById(id);
  }

  async deleteStaff(id) {
    const dateNow = new Date();
    return this.staffRepository.update({ id }, { deletedAt: dateNow });
  }

  private createQueryBuilder(): SelectQueryBuilder<Staff> {
    return this.staffRepository.createQueryBuilder('staff');
  }

  private async findBaseRecord(
    type: BaseRecordEnum,
    name: string,
  ): Promise<BaseRecord | undefined> {
    return this.baseRecordRepository.findOne({ type, name });
  }

  async countForStats(accountId: number) {
    return this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.accountId = :accountId', { accountId })
      .andWhere('staff.deletedAt IS NULL')
      .getCount();
  }
}
