import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class MultiDeleteStaffDto {
  @ApiProperty({
    type: [Number],
    description: 'Array of Employee Numbers',
    required: true,
  })
  @IsArray()
  @IsNumber({}, { each: true }) // Validate each element of the array as a number
  selectedRows: number[];
}
