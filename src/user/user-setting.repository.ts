import { BaseRepository } from '@app/core/base/base.repository';
import { UserSetting } from './entities/user-setting.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalLinkOriginEnum } from '@app/iam/enum';

@Injectable()
export class UserSettingRepository extends BaseRepository<UserSetting> {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {
    super(userSettingRepository);
  }

  async findUserSettings(
    userId: number,
    origin: ExternalLinkOriginEnum,
  ): Promise<UserSetting[]> {
    return this.userSettingRepository.find({
      where: { user: { id: userId }, origin },
    });
  }
}
