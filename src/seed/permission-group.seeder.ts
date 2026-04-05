import { PermissionGroup } from '@app/permission/entities/permission-group.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promise as Bluebird } from 'bluebird';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { permissionGroups } from './raw-data/dump/permissions';
import { SeederInterface } from './seeder.interface';

@Injectable()
export class PermissionGroupSeeder implements SeederInterface {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
  ) {}

  async seed() {
    await Bluebird.mapSeries(permissionGroups, async (data) => {
      const permissionGroup = await this.permissionGroupRepository.findOne({
        where: {
          id: data.id,
        },
      });

      if (permissionGroup) {
        Object.assign(permissionGroup, data);
        await this.permissionGroupRepository.save(permissionGroup);
      } else {
        await this.permissionGroupRepository.save({ ...data, uuid: uuidv4() });
      }
    });
  }
}
