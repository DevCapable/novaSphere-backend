import { eventType } from '@app/core/event-type';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AccountEvent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  individualWelcome(payload: any) {
    this.eventEmitter.emit(eventType.INDIVIDUAL_WELCOME, {
      to: payload.user.email,
      subject: 'Welcome to NovaSphere',
      context: {
        name: `${payload.user.firstName} ${payload.user.lastName}`,
        email: payload.user.email,
      },
    });
  }

  institutionWelcome(payload: any) {
    this.eventEmitter.emit(eventType.INSTITUTION_WELCOME, {
      to: payload.user.email,
      subject: 'Institution Onboarding - NovaSphere',
      context: {
        orgName: payload.user.firstName, // Maps to Institution Short Name (e.g., UNILAG)
        email: payload.user.email,
        password: payload.user._raw, // Only present on initial creation
      },
    });
  }

  sugWelcome(payload: any) {
    this.eventEmitter.emit(eventType.SUG_WELCOME, {
      to: payload.user.email,
      subject: 'Student Union Activation - NovaSphere',
      context: {
        unionName: payload.user.firstName, // Maps to SUG Acronym (e.g., ULSU)
        email: payload.user.email,
        password: payload.user._raw,
      },
    });
  }

  individualActivation(payload: any) {
    this.eventEmitter.emit(eventType.INDIVIDUAL_ACTIVATION, {
      to: payload.user.email,
      subject: 'Activate Your NovaSphere Account',
      context: {
        url: `${process.env.MAIL_FRONTEND_URL}/auth/verify/${payload.token}`,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        email: payload.user.email,
        password: payload.user._raw,
      },
    });
  }

  adminWelcome(payload: any) {
    this.eventEmitter.emit(eventType.ADMIN_WELCOME, {
      to: payload.user.email,
      subject: 'Administrative Access Granted - NovaSphere',
      context: {
        email: payload.user.email,
        password: payload.user._raw,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
      },
    });
  }

  // Fallback for any remaining legacy Operator/Vendor logic
  vendorWelcome(payload: any) {
    this.eventEmitter.emit(eventType.VENDOR_WELCOME, {
      to: payload.user.email,
      subject: 'Vendor Portal Access - NovaSphere',
      context: {
        email: payload.user.email,
        password: payload.user._raw,
        orgName: payload.user.firstName,
      },
    });
  }
}
