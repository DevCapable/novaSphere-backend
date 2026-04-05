import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class MultiUnarchiveStaffDto {
  @ApiProperty({
    type: [Number],
    description: 'Array of Employee Numbers',
    required: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  selectedRows: number[];
}
