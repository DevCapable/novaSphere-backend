import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CreateAccountDto } from '../create-account.dto';
import { InstitutionTypeEnum, OwnershipType } from '@app/account/enums';

export class CreateInstitutionDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    description: 'Full name of the tertiary institution',
    example: 'University of Lagos',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Abbreviated name or acronym',
    example: 'UNILAG',
  })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({
    enum: InstitutionTypeEnum,
    description: 'Category of institution (University, Polytechnic, etc.)',
  })
  @IsEnum(InstitutionTypeEnum)
  @IsNotEmpty()
  institutionType: InstitutionTypeEnum;

  @ApiProperty({
    enum: OwnershipType,
    description: 'Ownership category (Federal, State, or Private)',
  })
  @IsEnum(OwnershipType)
  @IsNotEmpty()
  ownershipType: OwnershipType;

  @ApiProperty({
    description: 'Regulatory registration/accreditation number',
    example: 'NUC/AS/V01',
  })
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty({
    description: 'The date the institution was officially established',
    example: '1962-10-03',
  })
  @IsNotEmpty()
  @IsDateString()
  establishmentDate: string;

  @ApiProperty({
    description: 'Official physical address',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Official primary contact phone number',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Official institution email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Official website URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Full name of the Vice Chancellor or Rector',
  })
  @IsOptional()
  @IsString()
  vcOrRectorName?: string;

  @ApiProperty({
    description: 'Full name of the Registrar',
  })
  @IsOptional()
  @IsString()
  registrarName?: string;
}
