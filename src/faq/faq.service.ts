import { Injectable } from '@nestjs/common';
import { Faq } from './entities/faq.entity';
import { FaqRepository } from './faq.repository';
import { BaseService } from '@app/core/base/base.service';

@Injectable()
export class FaqService extends BaseService<Faq> {
  constructor(private readonly faqRepository: FaqRepository) {
    super(faqRepository);
  }
}
