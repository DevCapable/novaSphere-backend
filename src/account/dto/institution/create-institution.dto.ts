import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateAccountDto } from '../create-account.dto';

export class CreateInstitutionDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    type: String,
    description: 'Institution name',
  })
  @IsNotEmpty()
  @IsString()
  institutionName: string;

  @ApiProperty({
    type: String,
    description: 'Institution type',
  })
  @IsNotEmpty()
  @IsString()
  institutionType: string;

  @ApiProperty({
    type: String,
    description: 'Registration number',
  })
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty({
    type: String,
    description: 'Date of establishment',
  })
  @IsNotEmpty()
  @IsString()
  dateOfEstablishment: string;

  @ApiProperty({
    type: String,
    description: 'Institution address',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    description: 'Contact phone number',
  })
  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @ApiProperty({
    type: String,
    description: 'Email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Website URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    type: String,
    description: 'Name of representative',
  })
  @IsNotEmpty()
  @IsString()
  representativeName: string;

  @ApiProperty({
    type: String,
    description: 'Designation of representative',
  })
  @IsNotEmpty()
  @IsString()
  representativeDesignation: string;
}
