import {
  BadRequestException,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import type { CallHandler, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DocumentReviewService } from '@app/review/document-review.service';

export const DocumentReviewsInterceptor = (Service: any): any => {
  @Injectable()
  class DocumentReviewsInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: any,
      private readonly documentReviewService: DocumentReviewService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const reviewableId = request.params.id;

      const reviews = await this.documentReviewService.findDocumentReviews(
        reviewableId,
        this.service.reviewType,
      );

      if (!reviews) throw new BadRequestException('Reviews not found');

      return next.handle().pipe(map(() => reviews));
    }
  }

  return mixin(DocumentReviewsInterceptorClass);
};
