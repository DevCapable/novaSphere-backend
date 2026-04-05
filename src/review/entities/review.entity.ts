import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReviewType } from '../enum/review.enum';
import { AppStatus } from '@app/core/enum/app-status.enum';
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class Review extends BaseEntity<Review> {
  @Column()
  reviewerId: number;

  @ManyToOne(() => User, (user) => user.reviews)
  reviewer: User;

  @Column()
  reviewableId: number;

  @Column()
  reviewableType: ReviewType;

  @Column({ nullable: true, type: 'clob' })
  discussion?: string;

  @Column({ default: 'PENDING' })
  status: AppStatus;
}
