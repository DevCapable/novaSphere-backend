import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { DocumentReview } from '@app/review/entities/document-review.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateDocumentReview } from '@app/review/interface';

@Injectable()
export class DocumentReviewRepository extends BaseRepository<DocumentReview> {
  public fillable: (keyof DocumentReview)[] = [
    'reviewableType',
    'reviewer',
    'remark',
    'status',
    'documentId',
    'reviewableId',
    'uuid',
  ];

  constructor(
    @InjectRepository(DocumentReview)
    private readonly documentReviewRepository: Repository<DocumentReview>,
  ) {
    super(documentReviewRepository);
  }

  async createData(data: CreateDocumentReview, entityManager?: EntityManager) {
    const reviewPayload = {
      ...data,
      uuid: uuidv4(),
    };

    const newDocReview = this.documentReviewRepository.create(reviewPayload);

    if (entityManager) {
      return entityManager.save(DocumentReview, newDocReview);
    } else {
      return this.documentReviewRepository.save(newDocReview);
    }
  }
}
