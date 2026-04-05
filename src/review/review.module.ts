import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { BaseReviewEvent } from './events/base-review-event';
import { DocumentReview } from '@app/review/entities/document-review.entity';
import { DocumentReviewRepository } from '@app/review/document-review.repository';
import { DocumentReviewService } from '@app/review/document-review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, DocumentReview])],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewRepository,
    DocumentReviewRepository,
    DocumentReviewService,
    BaseReviewEvent,
  ],
  exports: [
    ReviewRepository,
    DocumentReviewRepository,
    DocumentReviewService,
    ReviewService,
    BaseReviewEvent,
  ],
})
export class ReviewModule {}
