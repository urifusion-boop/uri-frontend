export enum CreditBundleTierEnum {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
}

export interface CreditBundleDto {
  bundleId?: string;
  tier: CreditBundleTierEnum;
  name: string;
  credits: number;
  price: number;
  currency: string;
  isActive?: boolean;
}

export interface PurchaseCreditBundleRequestDto {
  userId: string;
  bundleTier?: CreditBundleTierEnum;
  email: string;
  callbackUrl?: string;
  customAmount?: number;
  customCredits?: number;
}

export interface PurchaseCreditBundleResponseDto {
  authorization_url: string;
  access_code: string;
  reference: string;
  bundle: {
    tier: CreditBundleTierEnum;
    name: string;
    credits: number;
    price: number;
    currency: string;
  };
}

export interface CreditBalanceResponseDto {
  userId: string;
  creditsAvailable: number;
  creditsUsed: number;
  totalCredits: number;
}

export interface CreditPurchaseHistoryDto {
  purchaseId: string;
  userId: string;
  bundleTier: CreditBundleTierEnum;
  credits: number;
  amount: number;
  currency: string;
  reference: string;
  status: 'pending' | 'success' | 'failed';
  purchaseDate: string;
}

export interface CreditPurchaseHistoryResponseDto {
  purchases: CreditPurchaseHistoryDto[];
  total: number;
  page: number;
  limit: number;
}
