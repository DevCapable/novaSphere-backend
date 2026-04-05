import { eventType } from '@app/core/event-type';
import { MailService } from '@app/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ResetPasswordListener {
  constructor(private readonly mailService: MailService) {}
  @OnEvent(eventType.RESET_PASSWORD)
  async passwordResetListener(payload: any) {
    this.mailService.send(payload, 'RESET-PASSWORD');
  }
}
