import { eventType } from '@app/core/event-type';
import { MailService } from '@app/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AuthListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(eventType.FORGOT_PASSWORD)
  async forgotPasswordListener(payload: any) {
    this.mailService.send(payload, 'FORGOT-PASSWORD');
  }

  @OnEvent(eventType.AUTH_OTP)
  async floginOtpListener(payload: any) {
    this.mailService.send(payload, 'LOGIN-OTP');
  }
}
