import { IsNumber, IsOptional } from 'class-validator';

export class ImpersonateAccountDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @IsOptional()
  accountId?: number;
}
