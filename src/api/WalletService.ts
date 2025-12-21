import { UriHttpClient } from '@/configs/http.config';
import { walletRoutes } from '@/constants/routes/walletRoutes';
import { FundWalletDto, WalletDto } from '@/models/dtos/WalletDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class WalletService {
  static async getWallet(userId: string): Promise<UriResponse<WalletDto>> {
    const response: Awaited<AxiosResponse<UriResponse<WalletDto>>> = await UriHttpClient.getClient().get(`${walletRoutes.get}/${userId}`);
    return response.data;
  }

  static async fundWallet(data: FundWalletDto): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(walletRoutes.fund, data);
    return response.data;
  }

  static async verifyFunding(reference: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(`${walletRoutes.verify}/${reference}`);
    return response.data;
  }
}
