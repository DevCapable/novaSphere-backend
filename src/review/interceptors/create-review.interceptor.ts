import {
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import type { CallHandler, NestInterceptor, Type } from '@nestjs/common';
import { map, Observable, switchMap } from 'rxjs';
import { AccountTypeEnum } from '@app/account/enums';
import { AppStatus } from '@app/core/enum/app-status.enum';
import { ReviewService } from '@app/review/review.service';
import type { CreateReview, ReviewEventInterface } from '@app/review/interface';
import { ReviewType } from '@app/review/enum/review.enum';
import { WorkflowService } from '@app/workflow/workflow.service';
import { BaseReviewEvent } from '@app/review/events/base-review-event';
import {
  CustomBadRequestException,
  CustomNotFoundException,
} from '@app/core/error';

export const CreateReviewInterceptor = (
  Service: Type,
  ReviewEvent: Type<ReviewEventInterface> = BaseReviewEvent,
  isNewApplication = false,
): any => {
  @Injectable()
  class CreateReviewInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: any,
      @Inject(ReviewEvent)
      private readonly reviewEvent: ReviewEventInterface,
      private readonly reviewService: ReviewService,
      private readonly workflowService: WorkflowService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { status, discussion } = request.body;
      const { id } = request.params;
      const { createReview } = request.query; // for new application opt in to create review

      const reviewPayload: CreateReview = {
        app: {},
        reviewer: user,
        discussion: discussion,
        type: this.service.getReviewType(),
        status,
      };

      if (isNewApplication) {
        return await this._processNew({
          reviewPayload,
          next,
          createReview: createReview || false,
        });
      }

      return await this._process({ id, reviewPayload, next });
    }

    private async _processNew({
      reviewPayload,
      next,
      createReview,
    }: {
      reviewPayload: CreateReview;
      next: CallHandler;
      createReview: boolean;
    }) {
      return next.handle().pipe(
        switchMap(async (app) => {
          if (!app) {
            throw new CustomNotFoundException('Application not found');
          }

          if (!createReview) {
            return app;
          }

          const [createdApp] = await Promise.all([
            this.service.findOne(app.id),
          ]);

          reviewPayload.app = createdApp;
          reviewPayload.command = AppStatus.PENDING;
          reviewPayload.status = AppStatus.PENDING;

          await this._createReview(reviewPayload);

          return app;
        }),
      );
    }

    private async _process({
      id,
      reviewPayload,
      next,
    }: {
      id: string;
      reviewPayload: CreateReview;
      next: CallHandler;
    }) {
      const { status } = reviewPayload;

      if (!status) {
        throw new CustomBadRequestException(
          'Status is not in the request body',
        );
      }

      const [app] = await Promise.all([this.service.findOne(id)]);

      //TODO  check if the application exists and update the COR create handler

      /*if (!app) {
        throw new BadRequestException('Application not found');
      }*/

      if (app?.status === AppStatus.APPROVED && !app.canRenew) {
        throw new CustomBadRequestException(
          'Application approved cannot be updated',
        );
      }

      reviewPayload.app = app;

      reviewPayload = await this.service.createReview(reviewPayload);

      // Set the next approval command if not in the service createReviews
      if (!reviewPayload?.command) {
        reviewPayload.command =
          await this._getNextApprovalCommand(reviewPayload);
      }

      await this._createReview(reviewPayload);

      return next.handle().pipe(
        map(() => {
          return {
            status: reviewPayload.status,
            discussion: reviewPayload.discussion,
          };
        }),
      );
    }

    private async _createReview(reviewPayload: CreateReview) {
      let createData = {};
      const { app, reviewer } = reviewPayload;
      const isAgency = reviewer.account.type === AccountTypeEnum.ADMIN;
      const position = reviewer.account.agencyPosition;

      if (isAgency) {
        if (!position)
          throw new CustomBadRequestException('Reviewer position not found');

        if (!app?.wfCaseId) {
          throw new CustomBadRequestException(
            'Application is not synced with workflow',
          );
        }

        createData = await this.reviewService.createForAgency(reviewPayload);
      }

      if (!isAgency) {
        createData = await this.reviewService.createForCompany(reviewPayload);
      }

      if (Object.keys(createData).length) {
        await this.service.updateReview(app.id, {
          wfCaseId: app.wfCaseId,
          ...createData,
        });

        await this._sendNotification(reviewPayload, createData);
      }
    }

    private async _sendNotification(reviewPayload: CreateReview, createData) {
      const { reviewer, status, app, command } = reviewPayload;
      const wfCaseId = app?.wfCaseId || createData?.wfCaseId;
      const wfCase = await this.workflowService.getCase(
        wfCaseId,
        reviewer,
        false,
      );

      reviewPayload.initialReviewer = wfCase?.initialTaskUser;
      reviewPayload.nextReviewer = wfCase?.currentTaskUser;
      reviewPayload.stage = wfCase?.currentTaskStage;
      reviewPayload.dateAssigned = wfCase?.dateAssigned;

      let reviewStatus = status; // PENDING, APPROVED, REJECTED;

      if (command === AppStatus.RETURNED) reviewStatus = AppStatus.RETURNED;
      if (
        command !== AppStatus.RETURNED &&
        status !== AppStatus.PENDING &&
        status !== AppStatus.NOT_SUBMITTED
      )
        reviewStatus = AppStatus.UNDER_REVIEW; // Case of NCDMB sending forward and rejecting to subordinates

      if (wfCase?.status === 'COMPLETED') reviewStatus = AppStatus.APPROVED;

      switch (reviewStatus) {
        // Application submitted by company
        case AppStatus.PENDING:
          await this.reviewEvent.submittedEvent(reviewPayload);
          break;
        case AppStatus.RETURNED:
          await this.reviewEvent.returnedEvent(reviewPayload);
          break;
        case AppStatus.UNDER_REVIEW:
          await this.reviewEvent.reviewedEvent(reviewPayload);
          break;
        case AppStatus.APPROVED:
          await this.reviewEvent.approvedEvent(reviewPayload);
          break;
      }
    }

    private async _getNextApprovalCommand(
      reviewPayload: CreateReview,
    ): Promise<string | null> {
      const { reviewer, status, type, app } = reviewPayload;
      const position = reviewer.account.agencyPosition;

      const isCBModules = [
        ReviewType.NCRC,
        ReviewType.MARINE_VESSEL_APPLICATION,
        ReviewType.MARINE_VESSEL_REPORT_APPLICATION,
      ].includes(type);

      if (status === AppStatus.REJECTED) {
        if (isCBModules && position === 'SP') {
          const wfCase = await this.workflowService.getCase(
            app.wfCaseId,
            reviewer,
            true,
          );

          if (wfCase.currentTaskAdhocUsers.length > 0)
            return AppStatus.RETURNED;
        }

        if (!isCBModules && ['PO', 'SP'].includes(position))
          return AppStatus.RETURNED;

        if (
          [ReviewType.MARINE_VESSEL_REPORT_APPLICATION].includes(type) &&
          ['PO'].includes(position)
        )
          return AppStatus.RETURNED;

        return AppStatus.REJECTED;
      }

      if (status === AppStatus.NOT_SUBMITTED) return AppStatus.NOT_SUBMITTED;

      if (status === AppStatus.RETURNED) return AppStatus.RETURNED;

      const positionMap: Record<string, string> = {
        PO: 'SP',
        SP: 'MGR',
        MGR: isCBModules ? 'GM' : 'DIR',
        DIR: 'ES',
        GM: isCBModules ? 'DIR' : 'ES',
        ES: 'APPROVE',
      };

      return positionMap[position] || 'PO';
    }
  }

  return mixin(CreateReviewInterceptorClass);
};
