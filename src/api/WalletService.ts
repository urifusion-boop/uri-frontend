import { UriHttpClient } from '@/configs/http.config';
import { walletRoutes } from '@/constants/routes/walletRoutes';
import { FundWalletRequestDto, FundWalletResponseDto, WalletResponseDto, WalletTransactionDto } from '@/models/dtos/WalletDto';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class WalletService {
  private static isDirectTransactionsBaseUrl(apiBaseUrl: string): boolean {
    const normalized = (apiBaseUrl ?? '').toLowerCase();
    return normalized.includes('localhost:9001') || normalized.includes('127.0.0.1:9001') || normalized.endsWith(':9001') || normalized.includes(':9001/');
  }

  private static getTransactionsBaseUrlForDirect(): string {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_URI_API_BASE_URL ?? '').replace(/\/$/, '');

    return apiBaseUrl
      .replace(/\/uri-transactions\/api\/v1$/i, '')
      .replace(/\/uri-transactions$/i, '')
      .replace(/\/api\/v1$/i, '')
      .replace(/\/api$/i, '');
  }

  private static buildTransactionsUrl(path: string): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_URI_API_BASE_URL ?? '';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (this.isDirectTransactionsBaseUrl(apiBaseUrl)) {
      const directBaseUrl = this.getTransactionsBaseUrlForDirect();
      return `${directBaseUrl}${normalizedPath}`;
    }

    return `${BackendUrlEnum.TRANSACTIONS}${normalizedPath}`;
  }

  static async getWallet(userId: string): Promise<UriResponse<WalletResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(this.buildTransactionsUrl(`${walletRoutes.getWallet}/${userId}`));

    if (!response.data?.status || !response.data.responseData) {
      return response.data as UriResponse<WalletResponseDto>;
    }

    const wallet = response.data.responseData as any;
    const transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];

    return {
      ...response.data,
      responseData: {
        userId: wallet.userId,
        balance: wallet.balance ?? 0,
        currency: wallet.currency ?? 'NGN',
        transactions: transactions.map((tx: any): WalletTransactionDto => {
          const status = String(tx.status ?? '').toLowerCase();
          const txType = String(tx.transaction_type ?? '').toLowerCase();
          const normalizedStatus: WalletTransactionDto['status'] = status.includes('success') ? 'success' : status.includes('fail') ? 'failed' : 'pending';
          const normalizedType: WalletTransactionDto['type'] = txType.includes('income') ? 'credit' : 'debit';

          const amount = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount ?? 0);

          return {
            id: String(tx.reference ?? tx.id ?? ''),
            type: normalizedType,
            amount,
            currency: String(tx.currency ?? wallet.currency ?? 'NGN'),
            description: String(tx.narration ?? 'Transaction'),
            date: tx.transaction_date ? new Date(tx.transaction_date).toISOString() : new Date().toISOString(),
            status: normalizedStatus,
            reference: String(tx.reference ?? ''),
          };
        }),
      },
    };
  }

  static async initiateFunding(data: FundWalletRequestDto): Promise<UriResponse<FundWalletResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FundWalletResponseDto>>> = await UriHttpClient.getClient().post(this.buildTransactionsUrl(walletRoutes.fund), data);
    return response.data;
  }

  static async verifyFunding(reference: string): Promise<UriResponse<WalletResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(this.buildTransactionsUrl(`${walletRoutes.verify}/${reference}`));
    return response.data as UriResponse<WalletResponseDto>;
  }
}
