import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { AccountModule } from '@app/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    forwardRef(() => AccountModule),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
