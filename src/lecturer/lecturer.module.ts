import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '@app/account/account.module';
import { Department } from '@app/account/entities/department.entity';
import { Lecturer } from '@app/account/entities/lecturer.entity';
import { LecturerController } from './lecturer.controller';
import { LecturerRepository } from './lecturer.repository';
import { LecturerService } from './lecturer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecturer]),
    forwardRef(() => AccountModule),
  ],
  controllers: [LecturerController],
  providers: [LecturerService, LecturerRepository],
  exports: [LecturerService],
})
export class LecturerModule {}
