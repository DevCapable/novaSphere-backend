import { Account } from '@app/account/entities/account.entity';
import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum UploadableType {
  STAFF = 'STAFF',
  JOB_FORECAST = 'JOB_FORECAST',
  SERVICE_UTILIZATION_REPORT = 'SERVICE_UTILIZATION_REPORT',
}

@Entity()
export class BulkUpload extends BaseEntity<BulkUpload> {
  @Column()
  accountId: number;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  filePath: string;

  @Column({ type: 'varchar2' }) // Use VARCHAR2 for enum
  uploadableType: string;

  @Column({ nullable: true })
  uploadableId: number;

  @Column({ nullable: true })
  totalImported: number;

  @Column({ nullable: true })
  totalUpdated: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  totalFailed: number;

  @Column({ nullable: true })
  total: number;

  @Column({ type: 'clob', nullable: true })
  messageLog: string;
}
