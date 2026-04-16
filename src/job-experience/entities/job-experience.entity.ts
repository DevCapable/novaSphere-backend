import { Entity, Column, ManyToOne } from 'typeorm';

import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class JobExperience extends BaseEntity<JobExperience> {
  @Column()
  accountId: number;

  @ManyToOne(() => Account)
  account: Account;

  @Column({ type: 'clob', nullable: true })
  orgAddress: string;

  @Column()
  jobFamilyId: number;

  @ManyToOne(() => BaseRecord)
  jobFamily: BaseRecord;

  @Column()
  jobTypeId: number;

  @ManyToOne(() => BaseRecord)
  jobType: BaseRecord;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true, type: 'clob' })
  description: string;

  @Column()
  countryId: number;

  @ManyToOne(() => BaseRecord)
  country: BaseRecord;

  @Column({ nullable: true })
  orgName: string;
}
