import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkflowPasswordProvider {
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PM_PASSWORD_SECRET_KEY');
  }

  encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, this.secretKey).toString();
  }

  decrypt(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
