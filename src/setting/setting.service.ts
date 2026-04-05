import { AuditLogService } from '@app/audit-log/audit-log.service';
import { AuditAction, EntityType } from '@app/audit-log/enum';
import { AuditLogEventPayload } from '@app/audit-log/interfaces';
import { BaseService } from '@app/core/base/base.service';
import {
  CustomBadRequestException,
  CustomNotFoundException,
} from '@app/core/error';
import { StringHelper } from '@app/core/helpers';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SETTING_TYPE_MAP } from './constant';
import { Setting } from './entities/setting.entity';
import { SettingKeyEnum } from './enum';
import { FlatSettingsDto } from './interface';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingService extends BaseService<Setting> {
  constructor(
    private settingRepository: SettingsRepository,
    private readonly auditLibService: AuditLogService,
  ) {
    super(settingRepository);
  }

  async getValue<T = string | number | boolean>(key: SettingKeyEnum) {
    const setting = await this.settingRepository.findFirstBy({ key });
    if (!setting) throw new CustomNotFoundException('setting not found');
    const rawValue = setting.value;

    const type = SETTING_TYPE_MAP[key];

    switch (type) {
      case 'number':
        return { [key]: Number(rawValue) as T };
      case 'boolean':
        return { [key]: (rawValue === 'true') as T };
      default:
        return { [key]: rawValue as T };
    }
  }

  async setValue(dto: FlatSettingsDto, ip: string): Promise<{ msg: string }> {
    const currentUser = BaseService.getCurrentUser();
    const entries = Object.entries(dto) as [
      SettingKeyEnum,
      string | number | boolean,
    ][];

    for (const [key, value] of entries) {
      if (!(key in SETTING_TYPE_MAP)) {
        throw new CustomBadRequestException(`Invalid setting key: ${key}`);
      }

      const existing = await this.settingRepository.findFirstBy({ key });
      const stringValue = StringHelper.stringify(value);

      if (existing) {
        await this.settingRepository.update(existing.id, {
          value: stringValue,
        });
        const auditLogPayload: AuditLogEventPayload = {
          entityId: existing.id.toString(),
          entityTitle: `Setting ${existing.id}`,
          entityType: EntityType.SETTING,
          action: AuditAction.UPDATE,
          ipAddress: ip,
          userId: currentUser.id,
          changes: {
            [existing.key]: {
              oldData: existing.value,
              newData: stringValue,
            },
          },
        };
        this.auditLibService.logAction(auditLogPayload);
      } else {
        const newSetting = await this.settingRepository.create({
          key,
          value: stringValue,
          uuid: uuidv4(),
        });
        const auditLogPayload: AuditLogEventPayload = {
          entityId: newSetting.id.toString(),
          entityTitle: `Setting ${newSetting.id}`,
          entityType: EntityType.SETTING,
          action: AuditAction.CREATE,
          ipAddress: ip,
          userId: currentUser.id,
          changes: null,
        };
        this.auditLibService.logAction(auditLogPayload);
      }
    }

    return { msg: 'All settings saved successfully' };
  }

  async findSettings(): Promise<
    Partial<Record<SettingKeyEnum, string | number | boolean>>
  > {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [data, count] = await this.settingRepository.findAll({}, {});

    if (!data.length) return null;

    const mappedKeys: Partial<
      Record<SettingKeyEnum, string | number | boolean>
    > = {};

    data.forEach((el) => {
      const { value, key } = el;
      const type = SETTING_TYPE_MAP[el.key];
      let mappedValue: number | string | boolean = value;

      switch (type) {
        case 'number':
          mappedValue = Number(value);
          break;
        case 'boolean':
          mappedValue = value === 'true';
          break;
        default:
          // Keep as string
          break;
      }

      mappedKeys[key] = mappedValue;
    });

    return mappedKeys;
  }
}
