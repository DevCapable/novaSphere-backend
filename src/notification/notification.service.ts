import { SocketService } from '@app/socket/socket.service';
import { Injectable } from '@nestjs/common';
import { NotificationTypeEnum } from './notification-type.enum';
import { ReviewType } from '@app/review/enum/review.enum';

interface NotificationInterface {
  accountId: number;
  type: NotificationTypeEnum;
  appId: number;
  appNumber: number;
  appModule: ReviewType;
  subject: string;
  from: string;
  dateAssigned: string;
}
@Injectable()
export class NotificationService extends SocketService<NotificationInterface> {
  sendUserNotification(data: NotificationInterface) {
    this.sendToAccount('notification', data);
  }
}
