import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/core/base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from '@app/certification/entities/certification.entity';

@Injectable()
export class CertificationRepository extends BaseRepository<Certification> {
  public fillable = [
    'name',
    'accountId',
    'categoryId',
    'typeId',
    'certificateNo',
    'year',
    'expiryYear',
    'uuid',
  ];

  public relations = ['category', 'type'];

  constructor(
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
  ) {
    super(certificationRepository);
  }

  async findMany(accountId) {
    return this.certificationRepository.find({
      where: {
        accountId,
      },
      relations: {
        type: true,
      },
    });
  }
}
