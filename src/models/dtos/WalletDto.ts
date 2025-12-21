export interface FundWalletDto {
  userId: string;
  amount: number;
  email: string;
  currency: string;
  callbackUrl?: string;
}

export interface DeductWalletDto {
  userId: string;
  amount: number;
  reference: string;
  narration: string;
}

export interface WalletDto {
  _id: string;
  userId: string;
  balance: number;
  currency: string;
  ledger_balance: number;
  is_locked: boolean;
  createdAt: string;
  updatedAt: string;
  transactions?: WalletTransactionDto[];
}

export interface WalletTransactionDto {
  userId: string;
  amount: number;
  currency: string;
  transaction_type: string;
  reference: string;
  narration: string;
  status: string;
  transaction_date: string;
  channel?: string;
}
