import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { AcademicRank } from '../enums';
import { Department } from './department.entity';

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  SABBATICAL = 'SABBATICAL',
  VISITING = 'VISITING',
  ADJUNCT = 'ADJUNCT',
  CONTRACT = 'CONTRACT',
}

@Entity({
  name: 'ACCOUNT_LECTURERS',
})
export class Lecturer {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.lecturer)
  @JoinColumn()
  account: Account;

  // --- BASIC INFORMATION ---
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  otherNames?: string;

  @Column({ nullable: true })
  title?: string; // Prof, Dr, Mr, Mrs, etc.

  // @Column({ type: 'boolean', default: false })
  // isExpatriate: boolean;

  @Column()
  dob: Date;

  @Column()
  gender: string;

  // --- NIGERIAN SPECIFIC IDENTIFIERS   ---
  @Column({ nullable: true, unique: true })
  staffNumber: string; // University-specific ID

  @Column({ nullable: true })
  ippisNumber?: string; // Required for Federal Universities

  @Column({ nullable: true })
  ninNumber?: string; // National Identification Number

  @Column({ nullable: true })
  pensionFundAdmin?: string; // PFA Name

  @Column({ nullable: true })
  rsaNumber?: string; // Retirement Savings Account Number

  // --- ACADEMIC PROFILE ---
  @Column({
    type: 'varchar',
    length: 50,
    default: AcademicRank.GRADUATE_ASSISTANT,
  })
  rank: AcademicRank;

  @Column({ nullable: true })
  highestQualification?: string; // PhD, MSc, etc.

  @Column({ nullable: true })
  areaOfSpecialization?: string;

  @Column({ nullable: true })
  googleScholarLink?: string; // For accreditation/NUC tracking

  @Column({ nullable: true })
  orcidId?: string; // Professional research ID

  // --- EMPLOYMENT DETAILS ---
  @Column({
    type: 'varchar',
    length: 50,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ nullable: true })
  dateOfFirstAppointment?: Date;

  @Column({ nullable: true })
  dateOfPresentAppointment?: Date; // Date of last promotion

  @Column({ nullable: true })
  dateOfConfirmation?: Date;

  // --- GEOGRAPHICAL DATA ---
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  countryId?: number;

  @ManyToOne(() => BaseRecord, { nullable: true })
  country?: BaseRecord;

  @Column()
  nationalityId: number;

  @ManyToOne(() => BaseRecord)
  nationality: BaseRecord;

  @Column({ nullable: true })
  stateOfOriginId?: number;

  @ManyToOne(() => BaseRecord, { nullable: true })
  stateOfOrigin?: BaseRecord;

  @Column({ nullable: true })
  lgaId?: number;

  @ManyToOne(() => BaseRecord, { nullable: true })
  lga?: BaseRecord;

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  residentialAddress?: string;

  // --- EMERGENCY CONTACT ---
  @Column({ nullable: true })
  nextOfKinName?: string;

  @Column({ nullable: true })
  nextOfKinPhone?: string;

  @Column({ nullable: true })
  nextOfKinAddress?: string;

  @Column({ nullable: true })
  nextOfKinRelationship?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  signature?: string; // For digital result processing

  @Column({ name: 'DEPARTMENT_ID', nullable: true })
  departmentId?: number;

  @ManyToOne(() => Department, (department) => department.lecturers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'DEPARTMENT_ID' })
  department: Department;
}
