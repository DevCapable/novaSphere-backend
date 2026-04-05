import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseEntity } from '@app/core/base/base.entity';
import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id', 'individualAccountId'])
export class Staff extends BaseEntity<Staff> {
  @Column({ nullable: true })
  employeeNumber: string;

  @Column()
  employmentNatureId: number;

  @ManyToOne(() => BaseRecord)
  employmentNature: BaseRecord;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  accountId: number;

  @Column()
  individualAccountId: number;

  @OneToOne(() => Account)
  @JoinColumn()
  individualAccount: Account;

  @Column()
  employmentDate: Date;

  @Column()
  jobTypeId: number;

  @ManyToOne(() => BaseRecord)
  jobType: BaseRecord;

  @Column({ nullable: true, default: false })
  isManagement: boolean;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column()
  workExperienceYears: number;

  @Column()
  yearsInCompany: number;

  @Column()
  yearsInCurrentPosition: number;

  @Column({ nullable: true })
  educationLevelId: number;

  @ManyToOne(() => BaseRecord, { nullable: true })
  educationLevel: BaseRecord;

  @Column({ nullable: true })
  dateFirstQuota: Date;

  @Column({ nullable: true })
  dateCurrentQuota: Date;

  @Column({ nullable: true })
  expiryDateOfCurrentQuota: Date;

  @Column({ nullable: true })
  completionDate: Date;

  @Column({ nullable: true })
  cumulativeYearsInCountry: number;

  @Column({ nullable: true })
  project: string;

  @Column({ nullable: true })
  oldId: number;

  @Expose()
  get status(): string {
    return this.deletedAt ? 'Archived' : 'Active';
  }
}
