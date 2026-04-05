export interface RemittaPaymentDetails {
  rrr?: string;
  channel?: string;
  billerName?: string;
  amount?: number;
  transactiondate?: string;
  debitdate?: string;
  bank?: string;
  branch?: string;
  serviceTypeId?: string;
  orderRef?: string;
  orderId?: string;
  payerName?: string;
  payerPhoneNumber?: string;
  payerEmail?: string;
  type?: string;
  customFieldData?: CustomField[];
  parentRRRDetails?: Record<string, any>;
  chargeFee?: number;
  paymentDescription?: string;
  integratorsEmail?: string;
  integratorsPhonenumber?: string;
}
interface CustomField {
  DESCRIPTION?: string;
  COLVAL?: string;
}

export interface RemitaPaymentStatusResponse {
  status: string;
  message: string;
  rrr: string;
  billerName: string;
  channel: string;
  amount: number;
  chargeFee: number;
  transactionDate: string;
  bank: string;
  bankName: string;
  serviceTypeId: string;
  orderId: string;
  payerName: string;
  payerPhoneNumber: string;
  payerEmail: string;
  customFields: any[];
  lineItems: any[];
  paymentDescription: string;
}
