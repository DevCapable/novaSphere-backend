import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateAccountDto } from '../create-account.dto';

export class CreateSugDto extends PickType(CreateAccountDto, ['accountType']) {
  @ApiProperty({
    description: 'The official name of the Student Union',
    example: 'University of Lagos Student Union',
  })
  @IsNotEmpty({ message: 'Union Name is required' })
  @IsString()
  unionName: string;

  @ApiProperty({
    description: 'Union acronym',
    example: 'ULSU',
  })
  @IsOptional()
  @IsString()
  acronym?: string;

  @ApiProperty({
    description: 'Official SUG email address',
    example: 'sug@unilag.edu.ng',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  officialEmail: string;

  @ApiProperty({
    description: 'The ID of the Institution this SUG belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  institutionId: number;

  @ApiProperty({
    description: 'Full name of the current SUG President',
    example: 'Comrade John Doe',
  })
  @IsNotEmpty({ message: 'President Name is required' })
  @IsString()
  presidentName: string;

  @ApiProperty({
    description: 'Full name of the current General Secretary',
    example: 'Jane Smith',
  })
  @IsOptional()
  @IsString()
  generalSecretaryName?: string;

  @ApiProperty({
    description: 'Official contact phone number',
  })
  @IsNotEmpty({ message: 'Contact Number is required' })
  @IsString()
  officialContactNumber: string;

  @ApiProperty({
    description: 'Physical address of the SUG Secretariat',
  })
  @IsOptional()
  @IsString()
  officeAddress?: string;

  @ApiProperty({
    description: 'Date current executives were sworn in',
    example: '2026-01-15',
  })
  @IsOptional()
  @IsDateString()
  electionDate?: string;

  @ApiProperty({
    description: 'Expected end date of current tenure',
    example: '2027-01-15',
  })
  @IsOptional()
  @IsDateString()
  tenureEndDate?: string;
}
