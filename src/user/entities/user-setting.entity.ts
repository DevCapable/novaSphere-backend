import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { UserSettingKeyEnum } from '../enum';
import { ExternalLinkOriginEnum } from '@app/iam/enum';

@Entity()
@Unique(['user', 'key', 'origin'])
export class UserSetting extends BaseEntity<UserSetting> {
  @ManyToOne(() => User, (user) => user.settings, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'varchar',
    enum: UserSettingKeyEnum,
  })
  key: UserSettingKeyEnum;

  @Column({ type: 'clob' })
  value: string;

  @Column({
    type: 'varchar2',
    enum: ExternalLinkOriginEnum,
    default: ExternalLinkOriginEnum.NOGIC,
  })
  origin: ExternalLinkOriginEnum;
}
