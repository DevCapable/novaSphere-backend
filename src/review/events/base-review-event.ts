import { LoggerService } from '@app/logger';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BaseReviewEvent {
  constructor(
    protected readonly eventEmitter: EventEmitter2,
    private readonly loggerService: LoggerService,
  ) {}

  async submittedEvent(payload: any) {
    this.loggerService.log(payload);
  }

  async returnedEvent(payload: any) {
    this.loggerService.log(payload);
  }

  async approvedEvent(payload: any) {
    this.loggerService.log(payload);
  }

  async reviewedEvent(payload: any) {
    this.loggerService.log(payload);
  }
}
