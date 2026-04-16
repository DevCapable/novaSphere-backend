import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateAccountDto } from '../create-account.dto';
import { AcademicRank } from '../../enums';
import { EmploymentType } from '@app/account/entities/lecturer.entity';

export class CreateLecturerDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({ type: String, example: 'lecturer@university.edu.ng' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @ApiPropertyOptional({ type: String, example: 'Dr.' })
  @IsOptional()
  title?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  otherNames?: string;

  @ApiProperty({ type: String, example: 'UNIV/STAFF/2024/001' })
  @IsNotEmpty()
  staffNumber: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  ippisNumber?: string;

  @ApiProperty({ enum: AcademicRank })
  @IsEnum(AcademicRank)
  @IsNotEmpty()
  rank: AcademicRank;

  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  @IsNotEmpty()
  employmentType: EmploymentType;

  @ApiProperty({ type: String, format: 'date', example: '1985-01-01' })
  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty({ type: String, example: 'Male' })
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  nationalityId: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  stateOfOriginId?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  lgaId?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  ninNumber?: string;
}
