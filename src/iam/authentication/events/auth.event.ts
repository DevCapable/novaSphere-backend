import { eventType } from '@app/core/event-type';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthEvent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  forgotPasswordEvent(payload) {
    this.eventEmitter.emit(eventType.FORGOT_PASSWORD, {
      to: payload.user.email,
      subject: 'Password Reset Request from NOGICJQS',
      context: {
        resetLink: `${process.env.MAIL_FRONTEND_URL}/auth/${payload.token}/reset-password`,
        name: `${payload.user.firstName} ${payload.user.lastName}`,
      },
    });
  }

  otpEvent(payload: { email: string; otp: string }) {
    this.eventEmitter.emit(eventType.AUTH_OTP, {
      to: payload.email,
      subject: 'Login OTP Request from NOVASPHERE',
      context: {
        otp: payload.otp,
      },
    });
  }
}
