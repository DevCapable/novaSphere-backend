import { eventType } from '@app/core/event-type';
import { MailService } from '@app/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AccountListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(eventType.INDIVIDUAL_WELCOME)
  async individualWelcomeListener(payload: any) {
    await this.mailService.send(payload, eventType.INDIVIDUAL_WELCOME);
  }

  @OnEvent(eventType.INDIVIDUAL_ACTIVATION)
  async individualActivationListener(payload: any) {
    await this.mailService.send(payload, eventType.INDIVIDUAL_ACTIVATION);
  }

  @OnEvent(eventType.INSTITUTION_WELCOME)
  async institutionWelcomeListener(payload: any) {
    await this.mailService.send(payload, eventType.INSTITUTION_WELCOME);
  }

  @OnEvent(eventType.SUG_WELCOME)
  async sugWelcomeListener(payload: any) {
    await this.mailService.send(payload, eventType.SUG_WELCOME);
  }

  @OnEvent(eventType.ADMIN_WELCOME)
  async adminWelcomeListener(payload: any) {
    // Replaces the old AGENCY_WELCOME listener
    await this.mailService.send(payload, eventType.ADMIN_WELCOME);
  }

  @OnEvent(eventType.VENDOR_WELCOME)
  async vendorWelcomeListener(payload: any) {
    // Replaces the old COMPANY/OPERATOR logic for generic vendors
    await this.mailService.send(payload, eventType.VENDOR_WELCOME);
  }
}
