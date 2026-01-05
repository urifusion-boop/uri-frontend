import { UriHttpClient } from '@/configs/http.config';
import { creditRoutes } from '@/constants/routes/creditRoutes';
import { CreditBalanceResponseDto, CreditBundleDto, CreditPurchaseHistoryResponseDto, PurchaseCreditBundleRequestDto, PurchaseCreditBundleResponseDto } from '@/models/dtos/CreditBundleDto';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class CreditBundleService {
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

  static async getBundles(): Promise<UriResponse<CreditBundleDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<CreditBundleDto[]>>> = await this.getClient().get(this.buildTransactionsUrl(creditRoutes.getBundles));
    return response.data;
  }

  static async initiatePurchase(data: PurchaseCreditBundleRequestDto): Promise<UriResponse<PurchaseCreditBundleResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<PurchaseCreditBundleResponseDto>>> = await this.getClient().post(this.buildTransactionsUrl(creditRoutes.purchase), data);
    return response.data;
  }

  static async verifyPurchase(reference: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await this.getClient().post(this.buildTransactionsUrl(`${creditRoutes.verify}/${reference}`));
    return response.data;
  }

  static async getCreditBalance(userId: string): Promise<UriResponse<CreditBalanceResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreditBalanceResponseDto>>> = await this.getClient().get(this.buildTransactionsUrl(`${creditRoutes.getBalance}/${userId}`));
    return response.data;
  }

  static async getPurchaseHistory(userId: string, limit = 50, page = 1): Promise<UriResponse<CreditPurchaseHistoryResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreditPurchaseHistoryResponseDto>>> = await this.getClient().get(this.buildTransactionsUrl(`${creditRoutes.getHistory}/${userId}/history`), {
      params: { limit, page },
    });
    return response.data;
  }
}
