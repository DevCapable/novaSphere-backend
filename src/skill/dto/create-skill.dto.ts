import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateSkillDto {
  @ApiProperty({
    type: Number,
    description: 'select category',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  levelId: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    type: String,
    description: '',
    required: true,
  })
  @IsString()
  @IsOptional()
  description: string;
}
