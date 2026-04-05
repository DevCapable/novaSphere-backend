import { AuditLogModule } from '@app/audit-log/audit-log.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SettingsRepository } from './settings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), AuditLogModule],
  controllers: [SettingController],
  providers: [SettingService, SettingsRepository],
  exports: [SettingsRepository, SettingService],
})
export class SettingModule {}
