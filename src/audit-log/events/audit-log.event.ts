import { Injectable } from '@nestjs/common';
import type { AuditLogEventPayload } from '@app/audit-log/interfaces';
@Injectable()
export class AuditLogEvent {
  constructor(public readonly payload: AuditLogEventPayload) {}
}
