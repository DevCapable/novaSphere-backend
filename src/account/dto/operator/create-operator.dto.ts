import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { AccountTypeEnum } from '../../enums';
import { CreateAccountDto } from '../create-account.dto';

export class CreateOperatorDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    enum: AccountTypeEnum,
  })
  accountType: AccountTypeEnum;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  remittanceId: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorRemittanceId: string;
}
