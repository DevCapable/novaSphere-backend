import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '@app/audit-log/constants';
import { AuditLogService } from '@app/audit-log/audit-log.service';
import { AuditLogEvent } from '@app/audit-log/events/audit-log.event';
import { AuditLogEventPayload } from '@app/audit-log/interfaces';

@Injectable()
export class AuditLogListener {
  constructor(private readonly auditLogService: AuditLogService) {}
  @OnEvent(Events.AUDIT_LOG_EVENT)
  async create(event: AuditLogEvent) {
    await this.logEvent(event.payload);
  }

  async logEvent(payload: AuditLogEventPayload) {
    const {
      action,
      entityId,
      entityType,
      changes,
      ipAddress,
      userId,
      entityTitle,
      origin,
    } = payload;

    await this.auditLogService.logAction({
      action,
      userId,
      ipAddress,
      entityId,
      entityType,
      changes,
      entityTitle,
      origin,
    });
  }
}
