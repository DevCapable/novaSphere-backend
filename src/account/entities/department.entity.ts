import { Admin } from '@app/account/entities/admin.entity';
import { BaseEntity } from '@app/core/base/base.entity';
import { TableName } from '@app/core/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Institution } from '@app/account/entities/institution.entity';
import { DepartmentType } from '@app/department/enums';
import { Account } from './account.entity';
import { IDepartment } from '@app/department/department.interface';

@Entity({
  name: 'ACCOUNT_DEPARTMENTS',
})
export class Department extends BaseEntity<Department> implements IDepartment {
  @PrimaryColumn({ name: 'ACCOUNT_ID' })
  accountId: number;

  @OneToOne(() => Account, (account) => account.department, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ACCOUNT_ID' })
  account: Account;

  @Column({ type: 'varchar2', length: 500 })
  name: string;

  @Column({ type: 'varchar2', length: 100, nullable: true })
  code: string;

  @Column({ type: 'varchar2', length: 2000, nullable: true })
  description?: string;

  @Column({ type: 'varchar2', enum: DepartmentType })
  departmentType: DepartmentType;

  @Column({ name: 'INSTITUTION_ID', nullable: true })
  institutionId?: number;

  @ManyToOne(() => Institution, (institution) => institution.departments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'INSTITUTION_ID' })
  institution: Institution;

  // 3. This is the local column for the parent ID
  @Column({ name: 'PARENT_ID', nullable: true })
  parentId?: number;

  /**
   * FIX: Self-referencing relationship
   * We map BOTH columns of the primary key.
   * A child department belongs to the same Account as its Parent.
   */
  @ManyToOne(() => Department, (department) => department.children)
  @JoinColumn([
    { name: 'PARENT_ID', referencedColumnName: 'id' },
    { name: 'ACCOUNT_ID', referencedColumnName: 'accountId' },
  ])
  parent: Department;

  @OneToMany(() => Department, (department) => department.parent)
  children: Department[];

  @Column({ name: 'HEAD_OF_DEPT', nullable: true })
  headOfDepartmentName?: string;

  @Column({ name: 'IS_ACTIVE', default: true })
  isActive: boolean;

  // @OneToMany(() => Admin, (admin) => admin.department)
  // admins: Admin[];
}
