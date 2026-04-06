import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { Guideline } from '@app/guideline/entities/guideline.entity';
import { GuidelineAccountType } from '@app/guideline/interfaces';

@Injectable()
export class GuidelineRepository extends BaseRepository<Guideline> {
  public fillable = [
    'title',
    'module',
    'description',
    'accountType',
    'accountId',
    'videoLink',
    'uuid',
  ];
  public searchable = ['title'];

  constructor(
    @InjectRepository(Guideline) guidelineRepository: Repository<Guideline>,
  ) {
    super(guidelineRepository);
  }

  _findAll(
    queryBuilder: SelectQueryBuilder<Guideline>,
    options: Record<string, any>,
  ) {
    const { module, accountType, ids } = options;

    if (accountType && accountType !== 'AGENCY') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('(entity.accountType = :accountType)', {
            accountType: accountType,
          });

          if (['INSTITUTION', 'SUG'].includes(accountType)) {
            qb.orWhere('entity.accountType = :specificAccountType', {
              specificAccountType: GuidelineAccountType.INSTITUTION,
            });
          }
        }),
      );
    }

    if (module) {
      queryBuilder.andWhere('entity.module = :module', {
        module: module,
      });
    }

    if (ids) {
      const idArray = ids.split(',').map((id: string) => Number(id));
      queryBuilder.andWhere('entity.id IN (:...ids)', { ids: idArray });
    }

    return queryBuilder;
  }
}
