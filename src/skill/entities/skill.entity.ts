import { Entity, Column, ManyToOne } from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class Skill extends BaseEntity<Skill> {
  @Column()
  accountId: number;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  categoryId: number;

  @ManyToOne(() => BaseRecord)
  category: BaseRecord;

  @Column()
  levelId: number;

  @ManyToOne(() => BaseRecord)
  level: BaseRecord;

  @Column()
  year: number;

  @Column({ nullable: true, type: 'clob' })
  description?: string;

  @Column({ nullable: true })
  status?: boolean;
}
