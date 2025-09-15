import { UriHttpClient } from '@/configs/http.config';
import { linkedInApiRoutes } from '@/constants/routes/linkedInRoutes';
import { UserDto } from '@/models/dtos/UserDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class LinkedInService {
  static async getAuthUrl(scope: string, redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? '', responseType: string = 'code'): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(
      `${linkedInApiRoutes.getAuthUrl}/${scope}?redirectUri=${redirectUri}&responseType=${responseType}`
    );
    return response.data;
  }

  static async getCommMgtAuthUrl(scope: string, redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? '', responseType: string = 'code'): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(
      `${linkedInApiRoutes.getCommMgtAuthUrl}/${scope}?redirectUri=${redirectUri}&responseType=${responseType}`
    );
    return response.data;
  }

  static async connectLinkedIn(userId: string, code?: string, redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? ''): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().get(`${linkedInApiRoutes.connect}/${userId}?code=${code}&redirectUri=${redirectUri}`);
    return response.data;
  }

  static async connectCommMgtApi(userId: string, code?: string, redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? ''): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().get(`${linkedInApiRoutes.connectCommMgt}/${userId}?code=${code}&redirectUri=${redirectUri}`);
    return response.data;
  }

  static async getAccessToken(code: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${linkedInApiRoutes.getAccessToken}/${code}`);
    return response.data;
  }

  static async getUserData(accessToken: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${linkedInApiRoutes.getUserData}/${accessToken}`);
    return response.data;
  }

  static async disConnectLinkedIn(userId: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${linkedInApiRoutes.disconnect}/${userId}`);
    return response.data;
  }
}
