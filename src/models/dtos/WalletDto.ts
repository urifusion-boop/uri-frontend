export interface WalletBalanceResponseDto {
  balance: number;
  currency: string;
}

export interface FundWalletRequestDto {
  amount: number;
  currency: string;
  userId?: string;
  email?: string;
  callbackUrl?: string;
}

export interface FundWalletResponseDto {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface WalletTransactionDto {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'pending' | 'success' | 'failed';
  reference: string;
}

export interface WalletHistoryResponseDto {
  transactions: WalletTransactionDto[];
  total: number;
  page: number;
  limit: number;
}

export interface WalletResponseDto {
  userId?: string;
  balance?: number;
  currency?: string;
  transactions?: WalletTransactionDto[];
}
