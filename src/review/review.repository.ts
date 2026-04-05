import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { AppStatus } from '@app/core/enum/app-status.enum';

@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  public fillable = [
    'type',
    'reviewer',
    'discussion',
    'reviewableId',
    'reviewableType',
    'status',
    'reviewerId',
    'uuid',
  ];
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {
    super(reviewRepository);
  }

  async create(data, entityManager?: EntityManager) {
    // check if the review exists
    const review = await this.reviewRepository.findOne({
      where: {
        reviewableId: data.reviewableId,
        reviewableType: data.reviewableType,
        reviewerId: data.reviewerId,
        status: AppStatus.NOT_SUBMITTED,
      },
      order: {
        id: 'DESC',
      },
    });

    if (review) {
      if (entityManager) {
        return entityManager.update(Review, review.id, data);
      }
      return await this.reviewRepository.update(review.id, data);
    }

    if (entityManager) {
      return entityManager.save(Review, data);
    }

    return await this.reviewRepository.save(data);
  }

  async updateReview(id: number, data, entityManager?: EntityManager) {
    if (entityManager) {
      await entityManager.update(Review, { id }, data);
    } else {
      await this.reviewRepository.update(id, data);
    }
  }
}
