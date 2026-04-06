import { accountPermissionsDbSeed } from '@app/account/seed/permissions';
import { auditLogPermissionsDbSeed } from '@app/audit-log/seeds/permissions';
import { baseRecordPermissionDbSeed } from '@app/base-record/seed/permissions/base-record.permission';
import { documentPermissionDbSeed } from '@app/document/seed/permissions/document.permission';
import { faqPermissionDbSeed } from '@app/faq/seed/permissions/faq.permission';
import { guidelinePermissionDbSeed } from '@app/guideline/seed/permissions/guideline.permission';
import { LoggerService } from '@app/logger';
import { Permission } from '@app/permission/entities/permission.entity';
import { rolePermissionsDbSeed } from '@app/role/seeds/permissions';
import { userPermissionsDbSeed } from '@app/user/seeds/permissions';
import { workflowPermissionsDbSeed } from '@app/workflow/seeds/permissions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promise as Bluebird } from 'bluebird';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SeederInterface } from './seeder.interface';

@Injectable()
export class PermissionSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly loggerService: LoggerService,
  ) {}

  async seed() {
    const permissions = [
      {
        action: 'create',
        title: 'access ncdf',
        subject: 'special-permission',
        permissionGroupId: 8,
      },
      ...accountPermissionsDbSeed,
      ...baseRecordPermissionDbSeed,
      ...documentPermissionDbSeed,
      ...faqPermissionDbSeed,
      ...rolePermissionsDbSeed,
      ...guidelinePermissionDbSeed,
      ...userPermissionsDbSeed,
      ...auditLogPermissionsDbSeed,
      ...workflowPermissionsDbSeed,
    ];
    await Bluebird.mapSeries(permissions, async (data) => {
      try {
        const existing = await this.permissionRepository.findOne({
          where: {
            subject: data.subject,
            action: data.action,
            permissionGroupId: data.permissionGroupId,
          },
        });

        if (existing) {
          Object.assign(existing, data);
          await this.permissionRepository.save(existing);
        } else {
          await this.permissionRepository.save(
            this.permissionRepository.create({ ...data, uuid: uuidv4() }),
          );
        }
      } catch (error: any) {
        this.loggerService.log(error);
      }
    });
  }
}
