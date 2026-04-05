import {
  BadRequestException,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import type { CallHandler, NestInterceptor, Type } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { CreateDocumentReview } from '@app/review/interface';
import { DocumentReviewService } from '@app/review/document-review.service';
import { AppStatus } from '@app/core/enum/app-status.enum';
import { DocumentService } from '@app/document/document.service';
import { AccountTypeEnum } from '@app/account/enums';

export const CreateDocumentReviewInterceptor = (Service: Type): any => {
  @Injectable()
  class CreateDocumentReviewInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: any,
      private readonly documentReviewService: DocumentReviewService,
      private readonly documentService: DocumentService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { status, remark, documentId } = request.body;
      const { id: reviewableId } = request.params;

      const document = await this.documentService.getDocumentById(documentId);

      if (!document) throw new BadRequestException('Document not found');

      const documentReviewPayload: CreateDocumentReview = {
        reviewer: user,
        documentId: document.id,
        reviewableType: this.service.reviewType,
        remark,
        reviewableId,
        status,
      };

      return (await this._process(documentReviewPayload, next)) as any;
    }

    private async _process(
      documentReviewPayload: CreateDocumentReview,
      next: CallHandler,
    ) {
      const { status, reviewableId, documentId, reviewableType, remark } =
        documentReviewPayload;

      if (!status)
        throw new BadRequestException('Status is not in the request body');

      const [app] = await Promise.all([this.service.findOne(reviewableId)]);

      if ([AppStatus.APPROVED, AppStatus.EXPIRED].includes(app?.status))
        throw new BadRequestException('Application approved cannot be updated');

      await this._createOrUpdateDocumentReview(documentReviewPayload);

      return next.handle().pipe(
        map(() => {
          return {
            status,
            documentId,
            reviewableType,
            remark,
          };
        }),
      );
    }

    private async _createOrUpdateDocumentReview(
      documentReviewPayload: CreateDocumentReview,
    ) {
      const { reviewer } = documentReviewPayload;
      const isAgency = reviewer.account.type === AccountTypeEnum.ADMIN;
      const position = reviewer.account.agencyPosition;

      if (isAgency) {
        if (!position)
          throw new BadRequestException('Reviewer position not found');

        await this.documentReviewService.create(documentReviewPayload);
      }
    }
  }

  return mixin(CreateDocumentReviewInterceptorClass);
};
