import { Module } from '@nestjs/common';
import { GuidelineService } from './guideline.service';
import { GuidelineRepository } from './guideline.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@app/document/document.module';
import { Guideline } from '@app/guideline/entities/guideline.entity';
import { GuidelineController } from '@app/guideline/guideline.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Guideline]), DocumentModule],
  controllers: [GuidelineController],
  providers: [GuidelineService, GuidelineRepository],
  exports: [GuidelineRepository],
})
export class GuidelineModule {}
