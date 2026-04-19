import { Admin } from '@app/account/entities/admin.entity';
import { IBase } from '@app/core/base/interface';
// import { DepartmentType } from './enums';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface IDepartment extends IBase {
  name: string;
  // departmentType: DepartmentType;
  parentId?: number;
  parent: IDepartment;
  description?: string;
  admins?: Admin[];
}

export interface ICreateDepartmentDto {
  name: string;
  parentId?: number;
}

export interface IUpdateDepartmentDto {
  name?: string;
  parentId?: number;
}
