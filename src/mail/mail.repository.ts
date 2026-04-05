import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/core/base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from '@app/mail/entities/mail.entity';

@Injectable()
export class MailRepository extends BaseRepository<EmailTemplate> {
  public searchable = ['subject'];
  constructor(
    @InjectRepository(EmailTemplate)
    emailTemplateRepository: Repository<EmailTemplate>,
  ) {
    super(emailTemplateRepository);
  }
}
