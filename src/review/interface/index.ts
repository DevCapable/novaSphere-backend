import { ReviewType } from '@app/review/enum/review.enum';

export interface CreateReview {
  app: any;
  reviewer: any;
  initialReviewer?: any;
  nextReviewer?: any;
  discussion: string;
  type?: ReviewType;
  command?: any;
  status?: any;
  stage?: string;
  dateAssigned?: any;
}

export interface CreateDocumentReview {
  reviewer: any;
  documentId?: any;
  remark?: string;
  reviewableType: ReviewType;
  reviewableId: number;
  status?: any;
}
export interface DocumentReviewQueryParams {
  reviewableId: number;
  reviewableType: string;
  parentFileableId?: number;
}
export interface ReviewServiceInterface {
  reviewType: ReviewType;

  _createReviewForAgency(reviewPayload: CreateReview): Promise<CreateReview>;

  _createDocumentReviewForAgency(
    documentReviewPayload: CreateDocumentReview,
  ): Promise<CreateDocumentReview>;

  _createReviewForCompany(reviewPayload: CreateReview): Promise<CreateReview>;
}

export interface ReviewEventInterface {
  submittedEvent(payload: CreateReview): Promise<void>;

  approvedEvent(payload: CreateReview): Promise<void>;

  returnedEvent(payload: CreateReview): Promise<void>;

  reviewedEvent(payload: CreateReview): Promise<void>;
}
