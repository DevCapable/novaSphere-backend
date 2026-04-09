import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';

export enum Position {
  // ... (existing enum values)
  PO = 'PO',
  SP = 'SP',
  MGR = 'MGR',
  DMGR = 'DMGR',
  GM = 'GM',
  DIR = 'DIR',
  ES = 'ES',
}

@Entity({
  name: 'ACCOUNT_ADMIN',
})
export class Admin {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.admin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  otherNames?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  position: Position;

  @Column({ type: 'clob', nullable: true })
  workflowGroups: string;

  @Column({ nullable: true })
  departmentId: number;
}
