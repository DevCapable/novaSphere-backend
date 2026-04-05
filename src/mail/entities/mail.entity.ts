import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class EmailTemplate extends BaseEntity<EmailTemplate> {
  @Column()
  subject: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'clob' })
  body: string;
}
