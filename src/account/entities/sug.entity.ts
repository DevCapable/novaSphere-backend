import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Institution } from './institution.entity';
import { BaseEntity } from '@app/core/base/base.entity';
import { TableName } from '@app/core/enum';

@Entity({
  name: TableName.SUG, // Maps to 'ACCOUNT_SUG'
})
export class Sug extends BaseEntity<Sug> {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.sug, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ACCOUNT_ID' })
  account: Account;

  @Column({ nullable: true })
  institutionId: number;

  @ManyToOne(() => Institution)
  @JoinColumn({ name: 'INSTITUTION_ID' })
  institution: Institution;

  @Column({ unique: true })
  unionName: string; // e.g., "UNILAG SUG" or "LASU SRC"

  @Column({ nullable: true })
  acronym: string; // e.g., "SUG", "SRC", "ULSU"

  @Column({ type: 'date', nullable: true })
  electionDate: Date; // Date current executive was sworn in

  @Column({ type: 'date', nullable: true })
  tenureEndDate: Date;

  @Column()
  presidentName: string;

  @Column({ nullable: true })
  generalSecretaryName: string;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  officeAddress: string; // Usually the SUG Secretariat building

  @Column({ type: 'varchar2', length: 20, nullable: true })
  officialContactNumber: string;

  @Column({ type: 'varchar2', length: 100 })
  officialEmail: string;

  @Column({ default: true })
  isActive: boolean;
}
