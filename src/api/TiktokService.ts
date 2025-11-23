import { UriHttpClient } from '@/configs/http.config';
import { tiktokApiRoutes, tiktokInsightsApiRoutes } from '@/constants/routes/tiktokRoutes';
import { GetTiktokInsightDto, TiktokBusinessDiscoveryResponseDataDto, TiktokInsightDto } from '@/models/dtos/TiktokInsightDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class TiktokService {
  static async getAuthUrl(
    redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL || '',
    scope: string = 'user.info.basic,user.info.profile,user.info.stats,video.list,video.publish,video.upload'
  ): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${tiktokApiRoutes.getAuthUrl}/${scope}?redirectUri=${redirectUri}`);
    return response.data;
  }

  static async fetchPosts(keyword: string, maxPosts: number = 2): Promise<any> {
    const response: Awaited<AxiosResponse<any>> = await UriHttpClient.getClient().get(
      `${tiktokInsightsApiRoutes.getTiktokPosts}?keyword=${encodeURIComponent(keyword)}&max_posts=${maxPosts}`
    );
    return response.data;
  }

  static async getAccessToken(code: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${tiktokApiRoutes.getAccessToken}/${code}`);
    return response.data;
  }

  static async getUserData(accessToken: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${tiktokApiRoutes.getUserData}/${accessToken}`);
    return response.data;
  }

  static async connectTiktok(userId: string, code?: string, redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? ''): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${tiktokApiRoutes.connect}/${userId}?code=${code}&redirectUri=${redirectUri}`);
    return response.data;
  }

  static async disConnectTiktok(userId: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${tiktokApiRoutes.disconnect}/${userId}`);
    return response.data;
  }

  // Tiktok insights

  static async saveTiktokAccount(data: GetTiktokInsightDto, accessToken: string): Promise<UriResponse<any>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Tiktok-Access-Token'] = accessToken;
    }

    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(`${tiktokInsightsApiRoutes.saveTiktokAccount}?${queryString}`, { headers });

    return response.data;
  }

  static async getTiktokBusinessDiscovery(data: TiktokInsightDto, accessToken: string): Promise<UriResponse<TiktokBusinessDiscoveryResponseDataDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Tiktok-Access-Token'] = accessToken;
    }

    const response: Awaited<AxiosResponse<UriResponse<TiktokBusinessDiscoveryResponseDataDto>>> = await UriHttpClient.getClient().get(
      `${tiktokInsightsApiRoutes.getTiktokBusinessDiscovery}?${queryString}`,
      { headers }
    );

    return response.data;
  }
}
