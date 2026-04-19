import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicRepository } from './academic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@app/document/document.module';
import { AcademicController } from '@app/academic/academic.controller';
import { Academic } from '@app/academic/entities/academic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Academic]), DocumentModule],
  controllers: [AcademicController],
  providers: [AcademicService, AcademicRepository],
  exports: [AcademicRepository],
})
export class AcademicModule {}
