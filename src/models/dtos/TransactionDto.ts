export interface VerifyTransactionResponseDto {
  id?: number;
  domain?: string;
  status?: string;
  reference?: string;
  receipt_number?: any;
  amount?: number;
  message?: any;
  gateway_response?: string;
  paid_at?: string;
  created_at?: string;
  channel?: string;
  currency?: string;
  ip_address?: string;
  metadata?: Metadata;
  log?: Log;
  fees?: number;
  fees_split?: any;
  authorization?: Authorization;
  customer?: Customer;
  plan?: string;
  split?: Split;
  order_id?: any;
  paidAt?: string;
  createdAt?: string;
  requested_amount?: number;
  pos_transaction_data?: any;
  source?: any;
  fees_breakdown?: any;
  connect?: any;
  transaction_date?: string;
  plan_object?: PlanObject;
  subaccount?: Subaccount;
}

export interface Metadata {
  userId?: string;
}

export interface Log {
  start_time?: number;
  time_spent?: number;
  attempts?: number;
  errors?: number;
  success?: boolean;
  mobile?: boolean;
  input?: any[];
  history?: History[];
}

export interface History {
  type?: string;
  message?: string;
  time?: number;
}

export interface Authorization {
  authorization_code?: string;
  bin?: string;
  last4?: string;
  exp_month?: string;
  exp_year?: string;
  channel?: string;
  card_type?: string;
  bank?: string;
  country_code?: string;
  brand?: string;
  reusable?: boolean;
  signature?: string;
  account_name?: any;
  receiver_bank_account_number?: any;
  receiver_bank?: any;
}

export interface Customer {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  customer_code?: string;
  phone?: string;
  metadata?: any;
  risk_action?: string;
  international_format_phone?: any;
}

export interface Split {}

export interface PlanObject {
  id?: number;
  name?: string;
  plan_code?: string;
  description?: string;
  amount?: number;
  interval?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  currency?: string;
}

export interface Subaccount {}

export interface GetTransactionParametersDto {
  pageNumber: number;
  pageSize: number;
  user_id?: string;
  channel?: string;
  status?: string;
  transaction_date?: string;
  transaction_type?: string;
}

export interface GetTransactionResponseDto {
  data?: TransactionDto[];
  page?: string;
  pageSize?: string;
  total?: string;
}

export interface TransactionDto {
  user_id?: string;
  amount?: string;
  channel?: string;
  narration?: string;
  reference?: string;
  status?: string;
  transaction_date?: string;
  transaction_type?: string;
}
