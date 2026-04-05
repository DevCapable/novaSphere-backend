import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@app/role/entities/role.entity';
import { Repository } from 'typeorm';
import roledumps from './raw-data/dump/roles.dump.json';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoleSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    await Bluebird.mapSeries(roledumps, async (data) => {
      try {
        const { name, description, slug, id, origin, special } = data;
        const existingRole = await this.roleRepository.findOne({
          where: { name },
        });
        console.log(existingRole, 'existingRole');

        if (existingRole) {
          console.log(`Skipping ${name}, already exists.`);
          return;
        }

        await this.roleRepository.save({
          ...(id && { id }),
          name,
          description,
          slug,
          origin,
          special,
          uuid: uuidv4(),
        });

        console.log(`✅ Seeded role: ${name}`);
      } catch (error) {
        console.error(`❌ Error seeding role ${data.name}:`, error.message);
      }
    });

    console.log('🌱 Role seeding completed');
  }
}
