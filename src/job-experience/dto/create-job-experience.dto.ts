import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJobExperienceDto {
  @ApiProperty({
    type: String,
    description: ' ',
  })
  @IsNotEmpty()
  @IsString()
  orgAddress: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  jobFamilyId: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  jobTypeId: number;

  @ApiProperty({
    type: Date,
    required: true,
    description: 'start date',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: 'end date',
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    type: String,
    description: 'description',
    required: true,
  })
  @IsNotEmpty()
  @IsString({ message: 'Invalid character' })
  description: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orgName: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Country of employment',
  })
  @IsNotEmpty()
  @IsNumber()
  countryId: number;
}
