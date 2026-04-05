import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({
    type: Number,
    description: 'Employee Numbers',
    required: false,
  })
  @IsOptional()
  employeeNumber: string;

  @IsOptional()
  type: string;
}
