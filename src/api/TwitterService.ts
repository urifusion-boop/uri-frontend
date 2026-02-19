import { UriHttpClient } from '@/configs/http.config';
import { twitterApiRoutes } from '@/constants/routes/twitterRoutes';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { UserDto } from '@/models/dtos/UserDto';
import { ApiScopeEnum } from '@/models/enum-models/ApiScopeEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class TwitterService {
  static async getAuthUrl(
    redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? '',
    scope: string = ApiScopeEnum.TwitterScope,
    responseType: string = 'code',
    userId?: string
  ): Promise<UriResponse<{ auth: string; state?: string }>> {
    const url = userId
      ? `${twitterApiRoutes.getAuthUrl}/${scope}?redirectUri=${redirectUri}&responseType=${responseType}&userId=${userId}`
      : `${twitterApiRoutes.getAuthUrl}/${scope}?redirectUri=${redirectUri}&responseType=${responseType}`;
    const response: Awaited<AxiosResponse<UriResponse<{ auth: string; state?: string }>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async connectTwitter(
    userId: string,
    code?: string,
    redirectUri: string = process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? '',
    oauthType: number = 2,
    state?: string
  ): Promise<UriResponse<UserDto>> {
    const url = state
      ? `${twitterApiRoutes.connect}/${userId}?code=${code}&oauthType=${oauthType}&redirectUri=${redirectUri}&state=${state}`
      : `${twitterApiRoutes.connect}/${userId}?code=${code}&oauthType=${oauthType}&redirectUri=${redirectUri}`;
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getAccessToken(code: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${twitterApiRoutes.getAccessToken}/${code}`);
    return response.data;
  }

  static async getUserData(accessToken: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${twitterApiRoutes.getUserData}/${accessToken}`);
    return response.data;
  }

  static async disConnectTwitter(userId: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${twitterApiRoutes.disconnect}/${userId}`);
    return response.data;
  }

  static async fetchTweets(keyword: string, maxTweets: number = 2): Promise<TwitterFetchResponseDto> {
    const response: Awaited<AxiosResponse<TwitterFetchResponseDto>> = await UriHttpClient.getClient().get(
      `${twitterApiRoutes.fetchTweets}?keyword=${encodeURIComponent(keyword)}&max_tweets=${maxTweets}`
    );
    return response.data;
  }
}
