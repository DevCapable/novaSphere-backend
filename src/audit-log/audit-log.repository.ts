import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { AuditLog } from './entities/audit-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from './enum';
import { ShouldSendOtpPayload } from './interfaces';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  searchable = ['entityId', 'action', 'entityType', 'origin'];
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {
    super(auditLogRepository);
  }

  async shouldSendOtp(payload: ShouldSendOtpPayload): Promise<boolean> {
    const { userId, ipAddress, origin } = payload;

    const audits = await this.auditLogRepository.find({
      where: {
        userId,
        action: AuditAction.LOGIN,
        origin,
      },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    if (!audits.length) {
      return true;
    }

    const ipMatch = audits.some((audit) => audit.ipAddress === ipAddress);

    return !ipMatch;
  }
}
