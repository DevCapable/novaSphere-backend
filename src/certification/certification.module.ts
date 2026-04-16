import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certification } from '@app/certification/entities/certification.entity';
import { DocumentModule } from '@app/document/document.module';
import { CertificationRepository } from '@app/certification/certification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Certification]), DocumentModule],
  controllers: [CertificationController],
  providers: [CertificationService, CertificationRepository],
  exports: [CertificationRepository],
})
export class CertificationModule {}
