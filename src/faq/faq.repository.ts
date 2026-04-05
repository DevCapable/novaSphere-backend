import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { BaseRepository } from '@app/core/base/base.repository';

@Injectable()
export class FaqRepository extends BaseRepository<Faq> {
  public searchable = ['question'];

  constructor(@InjectRepository(Faq) faqRepository: Repository<Faq>) {
    super(faqRepository);
  }
}
