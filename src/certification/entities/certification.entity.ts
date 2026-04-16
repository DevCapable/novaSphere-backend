import { Column, Entity, ManyToOne } from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class Certification extends BaseEntity<Certification> {
  @Column()
  name: string;

  @Column()
  accountId: number;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  categoryId: number;

  @ManyToOne(() => BaseRecord)
  category: BaseRecord;

  @Column()
  typeId: number;

  @ManyToOne(() => BaseRecord)
  type: BaseRecord;

  @Column()
  certificateNo: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  expiryYear: number;
}
