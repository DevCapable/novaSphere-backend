import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsRepository extends BaseRepository<Setting> {
  public searchable = ['key'];

  constructor(
    @InjectRepository(Setting)
    settingsRepository: Repository<Setting>,
  ) {
    super(settingsRepository);
  }
}
