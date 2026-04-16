import { Injectable } from '@nestjs/common';
import { SkillRepository } from './skill.repository';
import { Skill } from '@app/skill/entities/skill.entity';
import { BaseService } from '@app/core/base/base.service';

@Injectable()
export class SkillService extends BaseService<Skill> {
  constructor(private readonly skillRepository: SkillRepository) {
    super(skillRepository);
  }
}
