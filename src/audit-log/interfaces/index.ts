import { AuditAction, EntityType } from '@app/audit-log/enum';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { Type } from '@nestjs/common';
import { Request } from 'express';

export interface AuditLogEventPayload {
  changes?: Record<string, any> | null;
  action: AuditAction;
  userId: number;
  ipAddress: string;
  entityId: string;
  entityType: EntityType;
  entityTitle: string;
  origin?: ExternalLinkOriginEnum;
}

export interface AuditFactoryPayload {
  service: any;
  reqBody: any;
  entityTitleKey: string | number;
}

export interface AuditFactoryValue {
  data: any;
  title: string;
}

export type AuditLogFactory<T> = (
  service: T,
  request: Request,
) => Promise<AuditFactoryValue>;

export interface AuditLogInterceptorOptions<T> {
  entityType: EntityType;
  service: Type<T>;
  entityTitleKey?: string;
  factory?: AuditLogFactory<T>;
  action?: AuditAction;
  changeKeys?: string[] | null;
}

export interface AuditLogInterceptorServiceInterface {
  findOne(id: number, relations?: any[]): Promise<any>;
}

export type AuditLogChanges<T> = {
  oldData: T;
  newData: T;
};

export interface ShouldSendOtpPayload {
  userId: number;
  ipAddress: string;
  origin: ExternalLinkOriginEnum;
}
