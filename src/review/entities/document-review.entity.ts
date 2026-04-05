import { User } from '@app/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReviewType } from '../enum/review.enum';
import { BaseEntity } from '@app/core/base/base.entity';

export enum DocumentReviewStatus {
  OK = 'OK',
  NOT_OK = 'NOT_OK',
}

@Entity('document_reviews')
export class DocumentReview extends BaseEntity<DocumentReview> {
  @Column()
  documentId: number;

  @ManyToOne(() => User, (user) => user.documentReviews)
  reviewer: User;

  @Column()
  reviewableId: number;

  @Column()
  reviewableType: ReviewType;

  @Column({ nullable: true })
  remark?: string;

  @Column({ nullable: true })
  status: DocumentReviewStatus;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;

  // @Column({
  //   type: 'timestamp',
  //   default: () => 'CURRENT_TIMESTAMP',
  //   onUpdate: 'CURRENT_TIMESTAMP',
  // })
  // updatedAt: Date;

  @Column({ nullable: true })
  parentFileableId?: number;
}
