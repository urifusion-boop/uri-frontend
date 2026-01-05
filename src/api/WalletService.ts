import { UriHttpClient } from '@/configs/http.config';
import { walletRoutes } from '@/constants/routes/walletRoutes';
import { FundWalletRequestDto, FundWalletResponseDto, WalletResponseDto, WalletTransactionDto } from '@/models/dtos/WalletDto';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class WalletService {
  private static isLocalDevelopment(): boolean {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }

  private static buildTransactionsUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BackendUrlEnum.TRANSACTIONS}${normalizedPath}`;
  }

  private static getClient(): AxiosInstance {
    // In local development, use axios without baseURL to leverage Next.js rewrites proxy
    // In production, use the standard UriHttpClient with full baseURL
    if (this.isLocalDevelopment()) {
      const authHeader = UriHttpClient.getClient().defaults.headers.common?.['Authorization'];
      return axios.create({
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });
    }
    return UriHttpClient.getClient();
  }

  static async getWallet(userId: string): Promise<UriResponse<WalletResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await this.getClient().get(this.buildTransactionsUrl(`${walletRoutes.getWallet}/${userId}`));

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
    const response: Awaited<AxiosResponse<UriResponse<FundWalletResponseDto>>> = await this.getClient().post(this.buildTransactionsUrl(walletRoutes.fund), data);
    return response.data;
  }

  static async verifyFunding(reference: string): Promise<UriResponse<WalletResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await this.getClient().post(this.buildTransactionsUrl(`${walletRoutes.verify}/${reference}`));
    return response.data as UriResponse<WalletResponseDto>;
  }
}
