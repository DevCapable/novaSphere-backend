import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateFaqDto {
  @ApiProperty({
    type: String,
    description: 'Faq Question',
    required: false,
  })
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Invalid character' })
  answer: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @IsString({ message: 'Invalid character' })
  email: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}
