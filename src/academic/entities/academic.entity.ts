import { Entity, Column, ManyToOne } from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class Academic extends BaseEntity<Academic> {
  @Column()
  accountId: number;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  countryId: number;

  @ManyToOne(() => BaseRecord)
  country: BaseRecord;

  @Column({ nullable: true })
  levelId: number;

  @ManyToOne(() => BaseRecord)
  level: BaseRecord;

  @Column({ nullable: true })
  disciplineId: number;

  @ManyToOne(() => BaseRecord)
  discipline: BaseRecord;

  @Column({ nullable: true })
  courseId: number;

  @ManyToOne(() => BaseRecord)
  course: BaseRecord;

  @Column({
    nullable: true,
  })
  institutionOther: string;

  @Column({
    nullable: true,
  })
  foreignCourse: string;

  @Column({
    nullable: true,
  })
  foreignDiscipline: string;

  @Column({
    nullable: true,
  })
  foreignProgram: string;

  @Column({
    nullable: true,
  })
  secondaryClass: string;

  @Column({ nullable: true })
  institutionId: number;

  @ManyToOne(() => BaseRecord)
  institution: BaseRecord;

  @Column({ nullable: true })
  programId: number;

  @ManyToOne(() => BaseRecord, {
    nullable: true,
  })
  program?: BaseRecord;

  @Column({ nullable: true })
  degreeId: number;

  @ManyToOne(() => BaseRecord)
  degree: BaseRecord;

  @Column()
  year: number;
}
