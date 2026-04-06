import { BaseEntity } from '@app/core/base/base.entity';
import { TableName } from '@app/core/enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Department } from '@app/department/entities/department.entity';
import { InstitutionTypeEnum, OwnershipType } from '../enums';

@Entity({
  name: TableName.INSTITUTIONS, // Ensure this maps to 'ACCOUNT_INSTITUTION' in your enum
})
export class Institution {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.institution, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ACCOUNT_ID' })
  account: Account;

  @Column({ unique: true })
  name: string; // e.g., University of Lagos

  @Column({ nullable: true })
  shortName: string; // e.g., UNILAG

  @Column({ type: 'varchar2', length: 3000, nullable: true })
  description?: string;

  @Column({ type: 'varchar2', enum: InstitutionTypeEnum })
  institutionType: InstitutionTypeEnum; // University, Polytechnic, Monotechnic, COE

  @Column({ type: 'varchar2', enum: OwnershipType })
  ownershipType: OwnershipType; // Federal, State, Private

  @Column({ unique: true, nullable: true })
  code: string; // Internal or regulatory code

  @Column({ nullable: true })
  registrationNumber: string; // e.g., NUC/AS/V01

  @Column({ type: 'date', nullable: true })
  establishmentDate: Date;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  address: string;

  @Column({ nullable: true })
  stateId: number; // For Nigerian State mapping

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  vcOrRectorName: string; // Head of Institution

  @Column({ nullable: true })
  registrarName: string;

  @Column({ default: false })
  isAccredited: boolean;

  @Column({ type: 'date', nullable: true })
  lastAccreditationDate: Date;

  @OneToMany(() => Department, (department) => department.institution)
  departments: Department[];
}
