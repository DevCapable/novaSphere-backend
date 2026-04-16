import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
export class CreateTrainingDto {
  @ApiProperty({
    type: String,
    description: 'name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orgName: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  countryId: number;

  @ApiProperty({
    type: Number,
    description: 'duration',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    type: String,
    description: 'year',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
