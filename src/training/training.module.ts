import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingRepository } from './training.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@app/document/document.module';
import { TrainingController } from '@app/training/trainings.controller';
import { Training } from '@app/training/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training]), DocumentModule],
  controllers: [TrainingController],
  providers: [TrainingService, TrainingRepository],
  exports: [TrainingRepository],
})
export class TrainingModule {}
