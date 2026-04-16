import { Entity, Column, ManyToOne } from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class Training extends BaseEntity<Training> {
  @Column()
  accountId: number;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  name: string;

  @Column()
  orgName: string;

  @Column()
  countryId: number;

  @ManyToOne(() => BaseRecord)
  country: BaseRecord;

  @Column()
  duration: number;

  @Column()
  year: number;

  @Column({ nullable: true, type: 'clob' })
  description: string;
}
