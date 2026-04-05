import { Institution } from '@app/account/entities/institution.entity';
import { BaseEntity } from '@app/core/base/base.entity';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { User } from '@app/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { AccountTypeEnum } from '../enums';
import { Admin } from './admin.entity';
import { CommunityVendor } from './community-vendor.entity';
import { Company } from './company.entity';
import { Individual } from './individual.entity';
import { Auditor } from './auditor.entity';

@Entity()
export class Account extends BaseEntity<Account> {
  @Column({
    type: 'varchar',
    length: 50,
  })
  type?: AccountTypeEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bio?: string;

  @Column({
    nullable: true,
  })
  oldId?: number;

  @Column({
    nullable: true,
    length: 250,
    unique: true,
  })
  slug?: string;

  @Column()
  nogicNumber?: string;

  @Column({ default: true })
  active?: boolean;

  @OneToOne(() => Institution, (institution) => institution.account, {
    cascade: true,
  })
  institution?: Institution;

  @OneToOne(() => Individual, (individual) => individual.account, {
    cascade: true,
  })
  individual?: Individual;

  @OneToOne(() => Admin, (admin) => admin.account, { cascade: true })
  admin?: Admin;

  @OneToOne(() => Company, (company) => company.account, { cascade: true })
  company?: Company;

  @OneToOne(() => Auditor, (auditor) => auditor.account, {
    cascade: true,
  })
  auditor?: Auditor;

  @OneToOne(
    () => CommunityVendor,
    (communityVendor) => communityVendor.account,
    { cascade: true },
  )
  communityVendor?: CommunityVendor;

  @ManyToMany(() => User, (user) => user.accounts, { cascade: true })
  @JoinTable({
    name: 'account_users',
  })
  users?: User[];

  name?: string;
}
