import { CurrentUserData } from '@app/iam/interfaces';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { lastValueFrom } from 'rxjs';
import { CustomInternalServerException } from '../error';
import { ExceptionHelper } from '../error/helper';
import { RemitaPaymentStatusResponse } from '../interface/remitta.interface';

@Injectable()
export class RemittaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendRequest(
    url: string,
    data: Record<string, any>,
    token: string,
  ): Promise<{ RRR: string }> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, data, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }),
      );

      let responseData: unknown = response.data;

      if (typeof responseData === 'string') {
        const match = responseData.match(/^jsonp\s*\((.*)\)\s*$/);
        if (match) {
          try {
            responseData = JSON.parse(match[1]);
          } catch {
            return null;
          }
        }
      }
      return responseData as { RRR: string };
    } catch (error: unknown) {
      const msg = ExceptionHelper.getErrorMessage(
        error,
        'Could not generate RRR',
      );
      throw new CustomInternalServerException(msg);
    }
  }

  async generateRRR(
    amount: number,
    description: string,
    user: CurrentUserData,
    customFields?: Record<string, any>[],
  ): Promise<string> {
    const d = new Date();
    const orderId = d.getTime().toString();
    const payerName = `${user.firstName} ${user.lastName}`;

    const payload = {
      serviceTypeId: this.configService.get<string>('REMITA_SERVICE_TYPE_ID'),
      amount: amount.toString(),
      orderId,
      payerName,
      payerEmail: user.email,
      payerPhone: user?.account?.phoneNumber,
      description,
      customFields,
    };

    const apiKey = this.configService.get<string>('REMITA_API_KEY');
    const merchantId = this.configService.get<string>('REMITA_MERCHANT_ID');
    const apiHash = CryptoJS.SHA512(
      merchantId + payload.serviceTypeId + orderId + payload.amount + apiKey,
    ).toString();

    const remitaApiUrl = this.configService.get<string>('REMITA_URL');
    const url = `${remitaApiUrl}/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit`;

    const token = `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`;

    const response = await this.sendRequest(url, payload, token);

    if (!response.RRR) {
      throw new CustomInternalServerException('RRR code generation failed');
    }
    return response.RRR;
  }

  async confirmPayment(rrr: string): Promise<RemitaPaymentStatusResponse> {
    const apiKey = this.configService.get<string>('REMITA_API_KEY');
    const merchantId = this.configService.get<string>('REMITA_MERCHANT_ID');
    const remitaApiUrl = this.configService.get<string>('REMITA_URL');

    const hash = CryptoJS.SHA512(`${rrr}${apiKey}${merchantId}`).toString();
    const token = `remitaConsumerKey=${merchantId},remitaConsumerToken=${hash}`;

    const url = `${remitaApiUrl}/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${rrr}/${hash}/status.reg`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data as RemitaPaymentStatusResponse;
    } catch (error: any) {
      const msg = ExceptionHelper.getErrorMessage(
        error,
        'Failed to confirm Remita payment',
      );
      throw new CustomInternalServerException(msg);
    }
  }
}
