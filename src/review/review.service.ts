import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { AccountTypeEnum } from '@app/account/enums';
import { AppStatus } from '@app/core/enum/app-status.enum';
import { ReviewType } from './enum/review.enum';
import { EntityManager } from 'typeorm';
import { WorkflowService } from '@app/workflow/workflow.service';
import { CreateReview } from '@app/review/interface';
import { v4 as uuidv4 } from 'uuid';
import { CustomBadRequestException } from '@app/core/error';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly workFlowService: WorkflowService,
  ) {}

  async findAll(reviewable, user) {
    const { reviewableId, reviewableType } = reviewable;

    const reviews = await this.reviewRepository.findAllBy(
      {
        reviewableId,
        reviewableType,
      },
      ['reviewer.accounts.admin'],
    );

    if (user.account.type !== AccountTypeEnum.ADMIN) {
      const companyReviews = reviews.filter((review: any) => {
        const position = review?.reviewer?.accounts[0]?.agency?.position;
        return (
          review.status === AppStatus.PENDING ||
          ([AppStatus.RETURNED].includes(review.status) &&
            ['PO', 'SP', 'MGR', 'GM'].includes(position))
        );
      });

      return companyReviews.map((review: any) => {
        const reviewer =
          review.status === AppStatus.RETURNED
            ? {
                firstName: 'Admin Reviewing Officer',
                lastName: '',
                email: 'support@capetech.org',
              }
            : review.reviewer;
        return {
          ...review,
          reviewer,
        };
      });
    }

    return reviews;
  }

  async create(data: any, entityManager: EntityManager = null) {
    return await this.reviewRepository.create(
      {
        status: data.status || AppStatus.PENDING,
        discussion: data.discussion || '',
        reviewableId: data.reviewableId,
        reviewableType: data.reviewableType,
        reviewerId: data.reviewerId,
        uuid: uuidv4(),
      },
      entityManager,
    );
  }

  async createForCompany({
    app,
    reviewer,
    discussion,
    type,
  }: CreateReview): Promise<any> {
    let metadata = {};

    const status = AppStatus.PENDING;

    if (!app?.wfCaseId) {
      const caseId = await this.workFlowService.start(
        type,
        {
          APP_ID: app.id,
          APP_NUMBER: app.appNumber,
          APP_COMPANY: app?.account?.name,
          APP_OTHER_INFO: '',
          COMMAND: 'NEW',
          SUBMISSION_TYPE: app.parentId ? 'RENEW' : 'NEW',
        },
        reviewer,
      );

      if (caseId) {
        metadata = {
          status,
          wfCaseId: caseId,
        };
      }
    }

    if (app?.wfCaseId) {
      await this.workFlowService.resume(
        app.wfCaseId,
        { COMMAND: 'NEW' },
        reviewer,
      );

      metadata = {
        status: AppStatus.PENDING,
      };
    }

    await this.create({
      discussion,
      reviewableId: app.id,
      reviewableType: type,
      reviewerId: reviewer.id,
    });

    return metadata;
  }

  async createForAgency({
    app,
    reviewer,
    discussion,
    type,
    command,
  }: CreateReview) {
    const position = reviewer?.account?.agencyPosition;
    const isNcrcSp =
      reviewer?.roles?.some((role) => role.name.includes('NCRC SP')) || false;
    const isResearchModules = [ReviewType.RESEARCH].includes(type);

    let status: AppStatus = command in AppStatus ? command : AppStatus.APPROVED;

    if (command === AppStatus.REJECTED && position === 'PO' && !isNcrcSp) {
      command = 'SP';
      status = AppStatus.REJECTED;
    }

    if (command === AppStatus.REJECTED && position === 'PO' && isNcrcSp) {
      command = 'SP';
      status = AppStatus.REJECTED;
    }

    let metadata = {
      status: AppStatus.UNDER_REVIEW,
    };

    if (command === AppStatus.RETURNED) {
      metadata = {
        status: AppStatus.REJECTED,
      };
    }

    if (isResearchModules && command === AppStatus.CANCELLED) {
      try {
        metadata = {
          status: AppStatus.CANCELLED,
        };

        await this.workFlowService.cancelCase(app.wfCaseId, reviewer);
        return metadata;
      } catch (error) {
        throw new CustomBadRequestException(
          `Failed to delete case ${app.wfCaseId} for reviewer ${reviewer.id}: ${error.message}`,
        );
      }
    }

    if (status !== AppStatus.NOT_SUBMITTED) {
      await this.workFlowService.resume(
        app.wfCaseId,
        { COMMAND: command },
        reviewer,
      );

      const wfCase = await this.workFlowService.getCase(app.wfCaseId, reviewer);

      if (wfCase?.status === 'CANCELLED') {
        metadata = {
          status: AppStatus.CANCELLED,
        };
      }
      if (wfCase?.status === 'COMPLETED') {
        metadata = {
          status: AppStatus.APPROVED,
        };
      }
    }

    await this.create({
      discussion,
      status,
      reviewableId: app.id,
      reviewableType: type,
      reviewerId: reviewer.id,
    });

    if (status == AppStatus.NOT_SUBMITTED) return {};

    return metadata;
  }
}
