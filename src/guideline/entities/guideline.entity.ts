import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/core/base/base.entity';
import {
  GuidelineAccountType,
  GuidelineModuleType,
} from '@app/guideline/interfaces';

@Entity()
export class Guideline extends BaseEntity<Guideline> {
  @Column()
  title: string;

  @Column({ enum: GuidelineAccountType, default: GuidelineAccountType.ALL })
  accountType: GuidelineAccountType;

  @Column({ enum: GuidelineModuleType, default: GuidelineModuleType.OTHERS })
  module: GuidelineModuleType;

  @Column({ nullable: true, length: 3000, type: 'varchar2' })
  description: string;

  @Column({ nullable: true })
  videoLink: string;
}
