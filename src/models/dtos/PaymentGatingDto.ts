export enum PaymentModeEnum {
  WALLET = 'WALLET',
  CREDITS = 'CREDITS',
}

export enum LeadActionTypeEnum {
  SCAN = 'SCAN',
  LEAD = 'LEAD',
  ENRICHMENT_EMAIL = 'ENRICHMENT_EMAIL',
  ENRICHMENT_PHONE = 'ENRICHMENT_PHONE',
}

export interface CheckPaymentBalanceRequestDto {
  userId: string;
  paymentMode: PaymentModeEnum;
  actionType: LeadActionTypeEnum;
  quantity?: number;
}

export interface PaymentBalanceResponseDto {
  userId: string;
  paymentMode: PaymentModeEnum;
  availableBalance: number;
  requiredAmount: number;
  hasSufficientBalance: boolean;
  currency?: string;
}

export interface DeductPaymentRequestDto {
  userId: string;
  paymentMode: PaymentModeEnum;
  actionType: LeadActionTypeEnum;
  quantity?: number;
  reference: string;
  narration?: string;
}

export interface DeductPaymentResponseDto {
  success: boolean;
  userId: string;
  paymentMode: PaymentModeEnum;
  amountDeducted: number;
  newBalance: number;
  reference: string;
  message?: string;
}

export interface ActionCostsDto {
  actionType: LeadActionTypeEnum;
  walletCost: number;
  creditCost: number;
}

export interface AllActionCostsDto {
  [key: string]: {
    walletCost: number;
    creditCost: number;
  };
}
