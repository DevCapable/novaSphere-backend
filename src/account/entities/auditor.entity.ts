import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IAuditor } from '../interface';
import { Account } from './account.entity';

@Entity({
  name: 'ACCOUNT_AUDITORS',
})
export class Auditor implements IAuditor {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.communityVendor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  address: string;
}
