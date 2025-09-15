import { UriHttpClient } from '@/configs/http.config';
import { analyticsRoutes } from '@/constants/routes/analyticsRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class AnalyticsService {
  static async getClientViewsCountByClientIdApi(clientId?: string): Promise<UriResponse<number>> {
    const response: Awaited<AxiosResponse<UriResponse<number>>> = await UriHttpClient.getClient().get(`${analyticsRoutes.getClientViewsCountByClientId}/${clientId}`);
    return response.data;
  }

  static async getTotalClients(): Promise<UriResponse<number>> {
    const response: Awaited<AxiosResponse<UriResponse<number>>> = await UriHttpClient.getClient().get(`${analyticsRoutes.getTotalClients}`);
    return response.data;
  }

  static async getTotalCreatives(): Promise<UriResponse<number>> {
    const response: Awaited<AxiosResponse<UriResponse<number>>> = await UriHttpClient.getClient().get(`${analyticsRoutes.getTotalCreatives}`);
    return response.data;
  }
}
