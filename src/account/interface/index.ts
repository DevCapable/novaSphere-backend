import { User } from '@app/user/entities/user.entity';
import { AccountTypeEnum } from '../enums';

export interface IVendor {
  email: string;
  name: string;
  nogicUniqueId?: string;
  phoneNumber: string;
  address: string;
}

export interface IAuditor {
  accountId: number;
  account: any;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface ICreateAuditorDto {
  accountType?: AccountTypeEnum;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
  users?: Partial<User>[];
}

export interface IUpdateAuditorDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
}

export interface AccountData {
  id: number;
  name: string;
  email: string;
  nogicNumber: string;
}
