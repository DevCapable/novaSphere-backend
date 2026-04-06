import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DepartmentType } from '../enums/department.enum';
import { CreateAccountDto } from '@app/account/dto';

export class CreateDepartmentDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    description: 'The name of the department or faculty',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @ApiProperty({
    description: 'The unique academic code for the department',
    example: 'ENG',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code?: string;

  @ApiProperty({
    description: 'A brief description of the department/faculty goals',
    required: false,
    example:
      'Focuses on civil, mechanical, and electrical engineering research.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    enum: DepartmentType,
    description: 'The structural level (FACULTY, ACADEMIC, ADMIN)',
    example: DepartmentType.FACULTY,
  })
  @IsEnum(DepartmentType)
  @IsNotEmpty()
  type: DepartmentType;

  @ApiProperty({
    description: 'Name of the current Dean or HOD',
    required: false,
    example: 'Prof. Adebayo Johnson',
  })
  @IsOptional()
  @IsString()
  headOfDepartmentName?: string;

  @ApiProperty({
    description: 'The ID of the parent Institution',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  institutionId: number;

  @ApiProperty({
    description:
      'The ID of the parent Faculty/School (if this is a sub-department)',
    required: false,
    example: 2,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
