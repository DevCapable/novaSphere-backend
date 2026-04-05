import { ICreateAuditorDto } from '@app/account/interface';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuditorDto implements ICreateAuditorDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => String(value).toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Phone Number is required',
  })
  @IsNumberString()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  address: string;
}
