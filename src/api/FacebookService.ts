import { UriHttpClient } from '@/configs/http.config';
import { facebookApiRoutes } from '@/constants/routes/facebookApiRoutes';
import { facebookInsightsRoutes } from '@/constants/routes/facebookInsightsRoutes';
import { ApiScopeEnum } from '@/models/enum-models/ApiScopeEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class FacebookService {
  static async getAuthUrl(redirectUri: string, scope: string = ApiScopeEnum.FacebookScope, userId?: string): Promise<UriResponse<{ url: string; state?: string }>> {
    const url = userId ? `${facebookApiRoutes.getAuthUrl}/${scope}?redirectUri=${redirectUri}&userId=${userId}` : `${facebookApiRoutes.getAuthUrl}/${scope}?redirectUri=${redirectUri}`;
    const response: Awaited<AxiosResponse<UriResponse<{ url: string; state?: string }>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getAccessToken(code: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${facebookApiRoutes.getAccessToken}/${code}`);
    return response.data;
  }

  static async getUserData(accessToken: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${facebookApiRoutes.getUserData}/${accessToken}`);
    return response.data;
  }

  static async connectFacebook(userId: string, token?: string, code?: string, state?: string): Promise<UriResponse<string>> {
    const url = state ? `${facebookApiRoutes.connect}/${userId}?code=${code}&token=${token}&state=${state}` : `${facebookApiRoutes.connect}/${userId}?code=${code}&token=${token}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async disConnectFacebook(userId: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${facebookApiRoutes.disconnect}/${userId}`);
    return response.data;
  }

  static async fetchPosts(keyword: string, maxPosts: number = 2): Promise<any> {
    const response: Awaited<AxiosResponse<any>> = await UriHttpClient.getClient().get(`${facebookInsightsRoutes.getFacebookPosts}?keyword=${encodeURIComponent(keyword)}&max_posts=${maxPosts}`);
    return response.data;
  }
}
