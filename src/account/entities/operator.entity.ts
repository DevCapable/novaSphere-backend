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
  name: 'ACCOUNT_OPERATORS',
})
export class Operator {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.operator, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  rcNumber: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  acronym?: string;

  @Column({ nullable: true })
  otherPhoneNumbers?: string;

  @Column({ type: 'varchar2', length: 1000 })
  address: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => BaseRecord)
  category: BaseRecord;

  @Column({
    nullable: true,
  })
  businessCategoryId: number;

  @ManyToOne(() => BaseRecord)
  businessCategory: BaseRecord;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  nseStatus?: NseStatus;

  @Column({ nullable: true })
  nseRegNo?: string;

  @Column({ nullable: true })
  incorporationDate?: Date;

  @Column({ type: 'decimal', precision: 16, scale: 2, nullable: true })
  totalCompanyShares?: number;

  @Column({ nullable: true })
  taxNumber?: string;

  @Column({ nullable: true, length: 1000, type: 'varchar2' })
  facilityLocation?: string;

  @Column({ nullable: true, length: 1000, type: 'varchar2' })
  facility?: string;

  @Column({ nullable: true })
  nogicNumber: string;

  @Column({ nullable: true })
  staffStrengthForeignCount?: number;

  @Column({ nullable: true })
  staffStrengthNigeriaCount?: number;

  @Column({ nullable: true })
  remittanceId: string;

  @Column({ nullable: true })
  vendorRemittanceId: string;
}
