import { IsNumber, IsOptional } from 'class-validator';

export class SwitchAccountDto {
  @IsNumber()
  @IsOptional()
  accountId: number;
}
