import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillRepository } from './skill.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '@app/skill/entities/skill.entity';
import { SkillController } from '@app/skill/skill.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [SkillService, SkillRepository],
  exports: [SkillRepository],
})
export class SkillModule {}
