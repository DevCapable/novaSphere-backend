import {
  CreateDocumentReview,
  CreateReview,
  ReviewServiceInterface,
} from '@app/review/interface';
import { AccountTypeEnum } from '@app/account/enums';

class ReviewServiceClass implements ReviewServiceInterface {
  reviewType: any;

  async createReview(reviewPayload: CreateReview): Promise<CreateReview> {
    const { reviewer } = reviewPayload;
    const isAgency = reviewer.account.type === AccountTypeEnum.ADMIN;

    if (isAgency) {
      return await this._createReviewForAgency(reviewPayload);
    }

    return await this._createReviewForCompany(reviewPayload);
  }

  _createReviewForAgency(reviewPayload: CreateReview): Promise<CreateReview> {
    throw new Error('_createReviewForAgency Method not implemented.');
  }

  _createReviewForCompany(reviewPayload: CreateReview): Promise<CreateReview> {
    throw new Error('_createReviewForCompany Method not implemented.');
  }

  _createDocumentReviewForAgency(
    documentReviewPayload: CreateDocumentReview,
  ): Promise<CreateDocumentReview> {
    throw new Error('_createReviewForCompany Method not implemented.');
  }
}

export function ReviewServiceDecorator(): ClassDecorator {
  return function (constructor: Function) {
    Object.setPrototypeOf(constructor.prototype, ReviewServiceClass.prototype);
  };
}
