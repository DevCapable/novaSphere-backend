import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Faq extends BaseEntity<Faq> {
  @Column({ nullable: false })
  question: string;

  @Column({ nullable: true, type: 'clob' })
  answer?: string;

  @Column({ default: false })
  status: boolean;

  @Column({ nullable: false })
  email: string;
}
