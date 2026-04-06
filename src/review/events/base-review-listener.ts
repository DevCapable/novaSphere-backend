import { Injectable } from '@nestjs/common';
import { MailService } from '@app/mail/mail.service';
import { CreateReview } from '@app/review/interface';
import { AccountTypeEnum } from '@app/account/enums';
import { NotificationService } from '@app/notification/notification.service';
import { NotificationTypeEnum } from '@app/notification/notification-type.enum';

interface NotifyAgencyUserParams {
  subject: string;
  template?: string;
  payload: CreateReview;
  teamEmail?: string;
}

interface SendReturnedEmailToCompanyParams {
  subject: string;
  template?: string;
  payload: CreateReview;
  teamEmail?: string;
  supportEmail?: string;
  supportPhoneNumber?: string;
}

const DEFAULT_TEAM_EMAIL = null;

@Injectable()
export class BaseReviewListener {
  constructor(
    protected readonly mailService: MailService,
    private notificationService: NotificationService,
  ) {}

  notifyAgencyUser({
    subject,
    template = 'review/agency',
    payload,
    teamEmail = DEFAULT_TEAM_EMAIL,
  }: NotifyAgencyUserParams) {
    const agencyAccount = payload.nextReviewer?.accounts?.find(
      ({ type }) => type === AccountTypeEnum.ADMIN,
    );
    const accountId = agencyAccount?.id;

    const {
      app: { appNumber, id: appId },
      type: appModule,
      dateAssigned,
    } = payload;

    if (accountId && appId && appNumber) {
      this.notificationService.sendUserNotification({
        from: payload?.app?.account?.name,
        type: NotificationTypeEnum.AGENCY_APPLICATION,
        subject,
        accountId,
        appNumber,
        appId,
        appModule,
        dateAssigned,
      });
    }

    this.mailService.send(
      {
        to: [payload.nextReviewer?.email, teamEmail],
        subject,
        context: {
          subject,
          dateAssigned: payload?.dateAssigned,
          task: payload?.stage,
          comment: payload?.discussion,
          appNumber: payload?.app?.appNumber,
          company: payload?.app?.account?.name,
          name: `${payload?.nextReviewer?.firstName} ${payload?.nextReviewer?.lastName} (${payload?.nextReviewer?.email})`,
        },
      },
      template,
    );
  }

  sendReturnedEmailToCompany({
    subject,
    template = 'review/company-returned',
    payload,
    teamEmail = DEFAULT_TEAM_EMAIL,
    supportEmail = 'support@capetech.com',
    supportPhoneNumber = '01-6310962',
  }: SendReturnedEmailToCompanyParams) {
    const email = payload.nextReviewer?.email;
    this.mailService.send(
      {
        to: teamEmail ? [email, teamEmail] : [email],
        subject,
        context: {
          subject,
          supportEmail,
          supportPhoneNumber,
          comment: payload?.discussion,
          appNumber: payload?.app?.appNumber,
          company: payload?.app?.account?.name,
        },
      },
      template,
    );
  }

  sendApprovedEmailToCompany({
    subject,
    template = 'review/company-approved',
    payload,
    teamEmail = DEFAULT_TEAM_EMAIL,
  }: NotifyAgencyUserParams) {
    this.mailService.send(
      {
        to: [payload.initialReviewer?.email, teamEmail],
        subject,
        context: {
          subject,
          appNumber: payload?.app?.appNumber,
          company: payload?.app?.account?.name,
        },
      },
      template,
    );
  }

  sendApprovedEmailToAgencyTeam({
    subject,
    template = 'review/agency-approved',
    payload,
    teamEmail = DEFAULT_TEAM_EMAIL,
  }: NotifyAgencyUserParams) {
    this.mailService.send(
      {
        to: [teamEmail],
        subject,
        context: {
          subject,
          appNumber: payload?.app?.appNumber,
          company: payload?.app?.account?.name,
        },
      },
      template,
    );
  }
}
