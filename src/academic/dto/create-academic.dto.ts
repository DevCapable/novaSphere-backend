import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
export class CreateAcademicDto {
  @ApiProperty({
    type: Number,
    description: 'select country',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  countryId: number;

  @ApiProperty({
    type: Number,
    description: 'select education level',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  levelId: number;

  @ApiProperty({
    type: Number,
    description: 'select discipline',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  disciplineId: number;

  @ApiProperty({
    type: Number,
    description: 'select course of study',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  courseId: number;

  @ApiProperty({
    type: Number,
    description: 'select institution',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  institutionId: number;

  @ApiProperty({
    type: Number,
    description: 'select program',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  programId: number;

  @ApiProperty({
    type: Number,
    description: 'select degree',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  degreeId: number;

  @ApiProperty({
    type: Number,
    description: 'select year obtained',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  year: number;
}
