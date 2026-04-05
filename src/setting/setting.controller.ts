import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';
import { EntityType } from '@app/audit-log/enum';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { BaseService } from '@app/core/base/base.service';
import { ApiEndPointRoute } from '@app/core/enum';
import { Permission } from '@app/iam/authorization/decorators';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '@app/iam/enum/permission.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { SETTING_TYPE_MAP } from './constant';
import { SettingKeyEnum } from './enum';
import type { FlatSettingsDto } from './interface';
import { SettingService } from './setting.service';

@Controller(ApiEndPointRoute.SETTINGS)
@ApiTags(ApiEndPointRoute.SETTINGS)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Accounts(AccountTypeEnum.AGENCY)
  @Permission(PermisionActionTypeEnum.UPDATE, PermisionSubjectTypeEnum.SETTINGS)
  @Post()
  async create(@Body() settings: FlatSettingsDto, @Req() req: Request) {
    const ip = BaseService.getClientIp(req);
    return this.settingService.setValue(settings, ip);
  }

  @Get()
  findAll() {
    return this.settingService.findSettings();
  }

  @Get('configurables')
  getConfigurableSettings() {
    return Object.entries(SETTING_TYPE_MAP).map(([key, type]) => ({
      key,
      type,
    }));
  }

  @Get(':key')
  get(@Param('key') key: SettingKeyEnum) {
    return this.settingService.getValue(key);
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Permission(PermisionActionTypeEnum.DELETE, PermisionSubjectTypeEnum.SETTINGS)
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.SETTING,
      service: SettingService,
    }),
  )
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.settingService.delete(id);
  }
}
