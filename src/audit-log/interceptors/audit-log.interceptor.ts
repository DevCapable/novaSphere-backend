import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditAction, EntityType } from '../enum';

import {
  AuditLogChanges,
  AuditLogInterceptorOptions,
  AuditLogInterceptorServiceInterface,
} from '../interfaces';
import { AuditLogService } from '../audit-log.service';
import { AuditLogHelper } from '../helpers';

const MethodActionMap: Record<string, AuditAction> = {
  POST: AuditAction.CREATE,
  PUT: AuditAction.UPDATE,
  PATCH: AuditAction.UPDATE,
  DELETE: AuditAction.DELETE,
};

const exceptionEntities: EntityType[] = [
  EntityType.SHAREHOLDER,
  EntityType.EQUIPMENT,
  EntityType.NC_POLICY,
  EntityType.NCEC,
  EntityType.NCEC_REVIEW,
  EntityType.NCRC_REVIEW,
  EntityType.NCTRC_REVIEW,
  EntityType.ORGANOGRAM,
  EntityType.FACILITY,
  EntityType.SUBSIDIARY,
  EntityType.QUALITY,
  EntityType.RAW_MATERIAL,
  EntityType.OEM,
];

export const AuditLogInterceptor = <
  T extends AuditLogInterceptorServiceInterface,
>({
  entityType,
  entityTitleKey = 'id',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  service,
  factory,
  action: defaultAction,
  changeKeys = null,
}: AuditLogInterceptorOptions<T>): Type<NestInterceptor> => {
  @Injectable()
  class AuditLogInterceptorClass implements NestInterceptor {
    constructor(
      private readonly auditLogService: AuditLogService,
      @Inject(service) private readonly service: T,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const ipAddress =
        request.headers['x-forwarded-for']?.split(',')[0] ||
        request.ip ||
        request.connection?.remoteAddress;
      const { method, user } = request;

      const action = defaultAction || MethodActionMap[method];

      if (!action || !user || exceptionEntities.includes(entityType))
        return next.handle();

      let entityId = request.params.id || request.body.id;
      let oldData: Record<string, any> | null = null;
      let entityTitle =
        request.body[entityTitleKey] || request.params[entityTitleKey];

      if (factory) {
        const { data, title } = await factory(this.service, request);
        oldData = data;
        entityTitle = title;
      } else if (entityId && action === AuditAction.UPDATE) {
        oldData = await this.service.findOne(entityId);
      }

      return next.handle().pipe(
        tap((result) => {
          let changes: Record<string, AuditLogChanges<any>> | null;
          entityId = entityId || result?.id;
          if (action === AuditAction.UPDATE && changeKeys) {
            changes = oldData
              ? AuditLogHelper.compareChanges(oldData, result, changeKeys)
              : null;
          } else {
            changes = null;
          }

          if (!entityId) return next.handle();

          const payload = {
            changes,
            action,
            userId: user?.id,
            ipAddress,
            entityId,
            entityType,
            entityTitle: entityTitle || result?.id,
          };

          this.auditLogService.emitAction(payload);
        }),
      );
    }
  }
  return mixin(AuditLogInterceptorClass);
};
