import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @ApiProperty({
    type: String,
    minimum: 8,
    maximum: 20,
  })
  @IsString()
  password: string;
}
