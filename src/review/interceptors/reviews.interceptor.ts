import {
  Injectable,
  ExecutionContext,
  mixin,
  Inject,
} from '@nestjs/common';
import type { NestInterceptor, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ReviewService } from '@app/review/review.service';
import { CustomNotFoundException } from '@app/core/error';

export const ReviewsInterceptor = (Service: any): any => {
  @Injectable()
  class ReviewsInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: any,
      private readonly reviewService: ReviewService,
    ) {}
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      const app = await this.service.findOne(request.params.id);

      if (!app) {
        throw new CustomNotFoundException('Application not found');
      }

      const reviews = this.reviewService.findAll(
        {
          reviewableId: app.id,
          reviewableType: this.service.reviewType,
          reviewableStatus: app.status,
        },
        user,
      );

      return next.handle().pipe(map(() => reviews));
    }
  }
  return mixin(ReviewsInterceptorClass);
};
