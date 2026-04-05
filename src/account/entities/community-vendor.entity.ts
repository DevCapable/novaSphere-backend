import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity({
  name: 'ACCOUNT_COMMUNITY_VENDORS',
})
export class CommunityVendor {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.communityVendor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  stateId?: number;

  @ManyToOne(() => BaseRecord, {
    nullable: true,
  })
  state?: BaseRecord;

  @Column({ nullable: true })
  nogicNumber: string;
}
