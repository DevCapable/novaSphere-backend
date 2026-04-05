import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { NseStatus } from '../enums/shared.enum';
import { Account } from './account.entity';

@Entity({
  name: 'ACCOUNT_COMPANIES',
})
export class Company {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar2', length: 3000, nullable: true })
  bio?: string;

  @Column({ unique: true })
  rcNumber: string;

  @Column({ type: 'number', default: 0 })
  isOffshore: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  otherPhoneNumbers?: string;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  address: string;

  @Column({ nullable: true })
  businessCategoryId: number;

  @ManyToOne(() => BaseRecord)
  businessCategory: BaseRecord;

  @Column({ nullable: true })
  newFacilityId: number;

  @ManyToOne(() => BaseRecord)
  newFacility: BaseRecord;

  @Column({ nullable: true, type: 'varchar2', length: 1000 })
  dprNumber?: string;

  @Column({ nullable: true, type: 'varchar2', length: 50 })
  nseStatus?: NseStatus;

  @Column({ nullable: true })
  nseRegNo?: string;

  @Column({ nullable: true })
  incorporationDate?: Date;

  @Column({ type: 'decimal', precision: 16, scale: 2, nullable: true })
  totalCompanyShares?: number;

  @Column({ nullable: true })
  taxNumber?: string;

  @Column({ nullable: true, type: 'varchar2', length: 1000 })
  facilityLocation?: string;

  @Column({ nullable: true, type: 'varchar2', length: 1000 })
  facility?: string;

  @Column({ nullable: true })
  staffStrengthForeignCount?: number;

  @Column({ nullable: true })
  staffStrengthNigeriaCount?: number;

  @Column({ nullable: true })
  nigerianOwnershipPercent?: number;

  @Column({ nullable: true })
  nogicNumber: string;

  @Column({ nullable: true })
  remittanceId: string;

  @Column({ nullable: true })
  vendorRemittanceId: string;
}
