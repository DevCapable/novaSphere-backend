import { pick } from '@app/core/util';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class SentryRequestContextInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user = this.cls.get('user');

    if (user) Sentry.setUser(pick(user, SentryUserContextProperties));

    return next.handle();
  }
}

const SentryUserContextProperties = [
  'id',
  'uuid',
  'createdAt',
  'nogicNumber',
  'lastName',
  'firstName',
  'lastLogin',
  'ipAddress',
  'email',
  'updatedAt',
];
