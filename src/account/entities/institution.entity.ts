import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';
import { InstitutionTypeEnum } from '@app/account/enums';

@Entity({
  name: 'ACCOUNT_INSTITUTION',
})
export class Institution {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.institution)
  @JoinColumn()
  account: Account;

  @Column()
  institutionName: string;

  @Column({ enum: InstitutionTypeEnum })
  institutionType: InstitutionTypeEnum;

  @Column()
  registrationNumber: string;

  @Column()
  dateOfEstablishment: Date;

  @Column({ type: 'varchar2', length: 1000 })
  address: string;

  @Column({ type: 'varchar2', length: 20 })
  contactNumber: string;

  @Column({ type: 'varchar2', length: 100 })
  email: string;

  @Column({ nullable: true })
  website?: string;

  @Column()
  representativeName: string;

  @Column()
  representativeDesignation: string;
}
