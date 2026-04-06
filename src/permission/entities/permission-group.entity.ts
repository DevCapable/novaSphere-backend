import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';

enum ACCOUNTTYPE {
  ADMIN = 'ADMIN',
  INSTITUTION = 'INSTITUTION',
  SUG = 'SUG',
  INDIVIDUAL = 'INDIVIDUAL',
  COMMUNITY_VENDOR = 'COMMUNITY_VENDOR',
}

export enum GROUPTYPE {
  USER_MANAGEMENT = 'USER_MANAGEMENT',
}

@Entity()
export class PermissionGroup extends BaseEntity<PermissionGroup> {
  @OneToMany(() => Permission, (permission) => permission.permissionGroup)
  permissions: Permission[];

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  type: ACCOUNTTYPE;

  @Column({
    nullable: true,
  })
  slug: GROUPTYPE;

  @Column({ nullable: true })
  parentId: string;
}
