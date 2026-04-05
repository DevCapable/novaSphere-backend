import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AuditLogRepository } from './audit-log.repository';
import { ConfigService } from '@nestjs/config';
import {
  AuditLogEventPayload,
  ShouldSendOtpPayload,
} from '@app/audit-log/interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from './constants';
import { AuditLogEvent } from './events/audit-log.event';
import { AccountTypeEnum } from '@app/account/enums';
import { RolesEnum } from '@app/role/enums';
import { LoggerService } from '@app/logger';
import { StringHelper } from '@app/core/helpers';

@Injectable()
export class AuditLogService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly loggerService: LoggerService,
  ) {}

  getEncryptionKey() {
    return this.configService.get('AUDIT_ENCRYPTION');
  }

  emitAction(payload: AuditLogEventPayload): void {
    this.eventEmitter.emit(Events.AUDIT_LOG_EVENT, new AuditLogEvent(payload));
  }

  async logAction(payload: AuditLogEventPayload): Promise<void> {
    try {
      const { changes, ...other } = payload;
      let encryptedData: {
        iv?: string;
        encryptedChanges?: string;
        encryptedErrorDetails?: string;
      } = {};

      if (changes)
        encryptedData = this._encryptSensitiveData({
          changes,
        });

      await this.auditLogRepository.create({
        ...encryptedData,
        ...other,
      });
    } catch (error) {}
  }

  async findAll(filterOptions: any, paginationOptions: any, user: any) {
    const _all = filterOptions.all;
    const isAgencyUser = user?.account?.type === AccountTypeEnum.AGENCY;

    filterOptions.userId = filterOptions.userId || user.id;

    delete filterOptions.accountId;

    if (isAgencyUser) {
      const hasSuperAdminRole = user.roles.some(
        (role) => role.slug === RolesEnum.SUPER_ADMIN,
      );

      if (filterOptions.entityType && filterOptions.entityId)
        delete filterOptions.userId;

      if (hasSuperAdminRole) {
        if (_all) {
          delete filterOptions.userId;
        }
      }
    }

    const [data, totalCount] = await this.auditLogRepository.findAll(
      filterOptions,
      paginationOptions,
      ['user'],
    );

    const transformedData = data?.map((log) => {
      const {
        changes,
        iv,
        action,
        user: { firstName, lastName, email, id },
        entityType,
        ipAddress,
        entityTitle,
        entityId,
        createdAt,
      } = log;
      let _changes = '';

      if (log.changes) _changes = this._decryptSensitiveData(changes, iv);

      return {
        changes: _changes,
        action,
        entityType,
        user: {
          firstName,
          lastName,
          email,
          id,
        },
        ipAddress,
        entityTitle,
        entityId,
        createdAt,
      };
    });

    return { data: transformedData, totalCount };
  }

  async findOne(id: number) {
    const auditLog = await this.auditLogRepository.findOne(id);

    if (auditLog && auditLog.changes) {
      const sensitiveData = this._decryptSensitiveData(
        auditLog.changes,
        auditLog.iv,
      );

      return { ...auditLog, ...sensitiveData };
    }

    return auditLog;
  }

  async shouldSendOtp(payload: ShouldSendOtpPayload): Promise<boolean> {
    return this.auditLogRepository.shouldSendOtp(payload);
  }

  _generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private _encryptSensitiveData(data: { changes?: any; errorDetails?: any }) {
    const { changes, errorDetails } = data;
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.getEncryptionKey(), 'hex'),
      iv,
    );

    let encryptedChanges: string | null = null;
    let encryptedErrorDetails: string | null = null;

    try {
      if (changes) {
        let encrypted = cipher.update(
          StringHelper.stringify(changes),
          'utf8',
          'base64',
        );
        encrypted += cipher.final('base64');
        encryptedChanges = encrypted;
      }

      if (errorDetails) {
        const cipherErrorDetails = crypto.createCipheriv(
          'aes-256-cbc',
          Buffer.from(this.getEncryptionKey(), 'hex'),
          iv,
        );

        let encrypted = cipherErrorDetails.update(
          StringHelper.stringify(errorDetails),
          'utf8',
          'base64',
        );

        encrypted += cipherErrorDetails.final('base64');
        encryptedErrorDetails = encrypted;
      }
    } catch (error) {
      this.loggerService.error('Error encrypting data:', error);
    }

    return {
      iv: iv.toString('hex'),
      changes: encryptedChanges,
      errorDetails: encryptedErrorDetails,
    };
  }

  _decryptSensitiveData(encrypted: string, encryptedIv: string): any {
    const iv = Buffer.from(encryptedIv, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.getEncryptionKey(), 'hex'),
      iv,
    );

    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}
