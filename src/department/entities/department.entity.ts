import { Admin } from '@app/account/entities/admin.entity';
import { BaseEntity } from '@app/core/base/base.entity';
import { TableName } from '@app/core/enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IDepartment } from '../department.interface';
import { DepartmentType } from '../enums/department.enum';
import { Institution } from '@app/account/entities/institution.entity';

@Entity({ name: TableName.DEPARTMENTS })
export class Department extends BaseEntity<Department> implements IDepartment {
  @Column({
    type: 'varchar2',
    length: 500,
  })
  name: string; // e.g., "Computer Science" or "Faculty of Science"

  @Column({
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  code: string; // e.g., "CSC" or "FAS"

  @Column({
    type: 'varchar2',
    length: 2000,
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar2',
    enum: DepartmentType,
  })
  departmentType: DepartmentType; // FACULTY, ACADEMIC_DEPT, ADMINISTRATIVE_UNIT

  @OneToMany(() => Admin, (account) => account)
  admins: Admin[];

  @Column({
    nullable: true,
  })
  institutionId?: number;

  @ManyToOne(() => Institution, (institution) => institution.departments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'INSTITUTION_ID' })
  institution: Institution;

  @Column({
    nullable: true,
  })
  parentId?: number;

  /**
   * Self-referencing relationship:
   * A 'Department' (e.g. Computer Science) belongs to a 'Parent' (e.g. Faculty of Science)
   */
  @ManyToOne(() => Department, (department) => department.children)
  @JoinColumn({ name: 'PARENT_ID' })
  parent: Department;

  @OneToMany(() => Department, (department) => department.parent)
  children: Department[];

  @Column({ nullable: true })
  headOfDepartmentName?: string; // HOD or Dean Name

  @Column({ default: true })
  isActive: boolean;
}
