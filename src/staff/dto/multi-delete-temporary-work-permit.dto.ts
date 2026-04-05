import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class MultiDeleteTemporaryWorkPermitDto {
  @ApiProperty({
    type: [Number],
    description: 'Array of Temporary work permit IDs',
    required: true,
  })
  @IsArray()
  @IsNumber({}, { each: true }) // Validate each element of the array as a number
  selectedRows: number[];
}
