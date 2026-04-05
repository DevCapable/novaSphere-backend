import { eventType } from '@app/core/event-type';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ResetPasswordEvent {
  constructor(private eventEmitter: EventEmitter2) {}

  async resetPasswordEvent(payload) {
    this.eventEmitter.emit(eventType.RESET_PASSWORD, {
      to: payload.email,
      subject: 'Password Reset Successful',
      context: {
        name: `${payload.firstName} ${payload.lastName}`,
      },
    });
  }
}
