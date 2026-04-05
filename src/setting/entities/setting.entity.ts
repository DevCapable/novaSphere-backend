import { BaseEntity } from '@app/core/base/base.entity';
import { TableName } from '@app/core/enum';
import { Column, Entity } from 'typeorm';
import { SettingKeyEnum } from '../enum';
import { ISetting } from '../interface';

@Entity({ name: TableName.SETTINGS })
export class Setting extends BaseEntity<Setting> implements ISetting {
  @Column({
    type: 'varchar2',
    enum: SettingKeyEnum,
    unique: true,
  })
  key: SettingKeyEnum;

  @Column({ type: 'clob' })
  value: string;
}
