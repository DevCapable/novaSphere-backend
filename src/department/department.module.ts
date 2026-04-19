import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { AccountModule } from '@app/account/account.module';
import { DepartmentRepository } from './department.repository';
import { Department } from '@app/account/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    forwardRef(() => AccountModule),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository],
  exports: [DepartmentService],
})
export class DepartmentModule {}
