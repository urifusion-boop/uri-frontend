import { UriHttpClient } from '@/configs/http.config';
import { xInsightsApiRoutes } from '@/constants/routes/xInsightsRoutes';
import { SearchAllTweetDto, TwitterSentimentsDto, TwitterTrackResponseDto, TwitterTrackTopLocationDto, XBusinessDiscovery } from '@/models/dtos/XInsightsDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class XInsightsService {
  static searchAllTweets(data: SearchAllTweetDto): Promise<UriResponse<any>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return UriHttpClient.getClient().get(`${xInsightsApiRoutes.searchAllTweets}?${queryString}`);
  }

  static async track(data: SearchAllTweetDto): Promise<UriResponse<TwitterTrackResponseDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const response: Awaited<AxiosResponse<UriResponse<TwitterTrackResponseDto>>> = await UriHttpClient.getClient().get(`${xInsightsApiRoutes.track}?${queryString}`);
    return response.data;
  }

  static async topCountries(cache_key: string): Promise<UriResponse<TwitterTrackTopLocationDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TwitterTrackTopLocationDto>>> = await UriHttpClient.getClient().get(`${xInsightsApiRoutes.topCountries}?cache_key=${cache_key}`);
    return response.data;
  }

  static async sentiments(cache_key: string): Promise<UriResponse<TwitterSentimentsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TwitterSentimentsDto>>> = await UriHttpClient.getClient().get(`${xInsightsApiRoutes.sentiments}?cache_key=${cache_key}`);
    return response.data;
  }

  static async businessDiscovery(access_token: string): Promise<UriResponse<XBusinessDiscovery>> {
    const url = `${xInsightsApiRoutes.businessDiscovery}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['x-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<XBusinessDiscovery>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async saveTwitterAccount(access_token: string, user_id: string): Promise<UriResponse<any>> {
    const url = `${xInsightsApiRoutes.saveTwitterAccount}?user_id=${user_id}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['x-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }
}
