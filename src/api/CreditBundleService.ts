import { UriHttpClient } from '@/configs/http.config';
import { creditRoutes } from '@/constants/routes/creditRoutes';
import { CreditBalanceResponseDto, CreditBundleDto, CreditPurchaseHistoryResponseDto, PurchaseCreditBundleRequestDto, PurchaseCreditBundleResponseDto } from '@/models/dtos/CreditBundleDto';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class CreditBundleService {
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

  static async getBundles(): Promise<UriResponse<CreditBundleDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<CreditBundleDto[]>>> = await UriHttpClient.getClient().get(this.buildTransactionsUrl(creditRoutes.getBundles));
    return response.data;
  }

  static async initiatePurchase(data: PurchaseCreditBundleRequestDto): Promise<UriResponse<PurchaseCreditBundleResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<PurchaseCreditBundleResponseDto>>> = await UriHttpClient.getClient().post(this.buildTransactionsUrl(creditRoutes.purchase), data);
    return response.data;
  }

  static async verifyPurchase(reference: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(this.buildTransactionsUrl(`${creditRoutes.verify}/${reference}`));
    return response.data;
  }

  static async getCreditBalance(userId: string): Promise<UriResponse<CreditBalanceResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreditBalanceResponseDto>>> = await UriHttpClient.getClient().get(this.buildTransactionsUrl(`${creditRoutes.getBalance}/${userId}`));
    return response.data;
  }

  static async getPurchaseHistory(userId: string, limit = 50, page = 1): Promise<UriResponse<CreditPurchaseHistoryResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreditPurchaseHistoryResponseDto>>> = await UriHttpClient.getClient().get(
      this.buildTransactionsUrl(`${creditRoutes.getHistory}/${userId}/history`),
      { params: { limit, page } }
    );
    return response.data;
  }
}
