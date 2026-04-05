import { Injectable } from '@nestjs/common';
import { DocumentReviewRepository } from '@app/review/document-review.repository';
import { EntityManager } from 'typeorm';
import { DocumentReviewQueryParams } from '@app/review/interface';

@Injectable()
export class DocumentReviewService {
  constructor(
    private readonly documentReviewRepository: DocumentReviewRepository,
  ) {}

  async findDocumentReviews(
    reviewableId: number,
    reviewableType: string,
    parentFileableId?: number,
  ) {
    const queryParams: DocumentReviewQueryParams = {
      reviewableId,
      reviewableType,
    };

    if (parentFileableId !== undefined) {
      queryParams.parentFileableId = parentFileableId;
    }

    return await this.documentReviewRepository.findAllBy(queryParams, [
      'reviewer',
    ]);
  }

  async create(data: any, entityManager: EntityManager = null): Promise<any> {
    return this.documentReviewRepository.createData(data, entityManager);
  }
}
