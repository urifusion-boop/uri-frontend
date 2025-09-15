import { PaginationDto } from './PaginationDto';

export interface SubscriptionPlan {
  plan_code: string;
  name: string;
  amount: number;
  description: string;
  interval: string;
  created_at: string;
  updated_at: string;
  plan_type: string;
}

export interface SubscriptionResponseData {
  page: string;
  pageSize: string;
  data: SubscriptionPlan[];
  total: string;
}

export class SubscriptionPlanFilterDto extends PaginationDto {
  plan_code?: string;
  amount?: number;
  interval?: string;
  plan_type?: string;
}

export interface SubscriptionDto {
  amount: number;
  email: string;
  callback_url?: string;
  channels?: string[];
  currency: string;
  plan: string;
  reference: string;
}

export interface TrialSubscriptionDto {
  user_id: string;
  email: string;
}

export interface SubscriptionResponseDto {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface ActiveSubscriptionResponseDto {
  id: number;
  domain: string;
  status: string;
  start: number;
  quantity: number;
  subscription_code: string;
  email_token: string;
  amount: number;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: any;
  createdAt: string;
  integration: number;
  plan: Plan;
  authorization: Authorization;
  customer: Customer;
  invoice_limit: number;
  split_code: any;
  metadata: any;
  payments_count: number;
  most_recent_invoice: MostRecentInvoice;
}

export interface GetSubscriptionProviderParametersDto {
  pageNumber: number;
  pageSize: number;
  user_id?: string;
  status?: string;
  transaction_date?: string;
  transaction_type?: string;
  email?: string;
  customer_id?: number;
}

export interface SubscriptionsResponseDto {
  data: PaystackSubscriptionDto[];
  page: number;
  pageSize: string;
  total: number;
}

export interface PaystackSubscriptionDto {
  id: number;
  domain: string;
  name: string;
  status: string;
  start: number;
  quantity: number;
  subscription_code: string;
  email_token: string;
  amount: number;
  cron_expression: string;
  next_payment_date?: string;
  open_invoice?: string;
  createdAt: string;
  integration: number;
  plan: Plan;
  authorization: Authorization;
  customer: Customer;
  invoice_limit: number;
  split_code: any;
  metadata: any;
  payments_count: number;
  most_recent_invoice: MostRecentInvoice;
}

export interface Plan {
  id: number;
  domain: string;
  name: string;
  plan_code: string;
  description: string;
  amount: number;
  interval: string;
  send_invoices: boolean;
  send_sms: boolean;
  currency: string;
  integration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Authorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: number;
  signature: string;
  account_name: any;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string;
  metadata: any;
  risk_action: string;
  international_format_phone: any;
}

export interface MostRecentInvoice {
  subscription: number;
  integration: number;
  domain: string;
  invoice_code: string;
  customer: number;
  transaction?: number;
  amount: number;
  period_start: string;
  period_end: string;
  status: string;
  paid: number;
  retries: number;
  authorization: number;
  paid_at?: string;
  next_notification?: string;
  notification_flag: any;
  description: any;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateSubscriptionParametersDto {
  code: string;
  token: string;
}

export interface DisableSubscriptionResponseDto {
  status?: boolean;
  message?: string;
  data?: {
    status: string;
  };
}
