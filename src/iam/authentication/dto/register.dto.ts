import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'first_name',
  })
  @IsNotEmpty()
  @IsString({ message: 'Invalid character' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'other_names',
  })
  @IsOptional()
  @IsString({ message: 'Invalid character' })
  otherNames: string;

  @ApiProperty({
    type: String,
    description: 'last_name',
  })
  @IsNotEmpty()
  @IsString({ message: 'Invalid character' })
  lastName: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    minimum: 8,
    maximum: 20,
    description: 'At least 1 capital, 1 small, 1 special character & 1 number',
  })
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  dob?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  gender?: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  countryId?: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  nationalityId?: number;
}
