import { UriHttpClient } from '@/configs/http.config';
import { insightApiRoutes } from '@/constants/routes/insightRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { GetInstagramHashtagSearchDto, GetInstagramInsightsDto, GetInstagramMentionsDto } from '../models/dtos/InsightsDto';

export class InsightService {
  static async getInstagramInsights(data: GetInstagramInsightsDto): Promise<UriResponse<any[]>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<any[]>>> = await UriHttpClient.getClient().get(`${insightApiRoutes.getInstagramInsights}?${queryString}`);
    return response.data;
  }

  static async getInstagramBusinessDiscovery(usernames?: string[]): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(
      `${insightApiRoutes.instagramBusinessDiscovery}?${usernames
        ?.map((username) => {
          return `ig_usernames=${username}`;
        })
        .join('&')}`
    );
    return response.data;
  }

  static async getInstagramHashtagSearch(data: GetInstagramHashtagSearchDto): Promise<UriResponse<any[]>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<any[]>>> = await UriHttpClient.getClient().get(`${insightApiRoutes.instagramHashtagSearch}?${queryString}`);
    return response.data;
  }

  static async getInstagramTags(access_token: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(`${insightApiRoutes.instagramTags}?access_token=${access_token}`);
    return response.data;
  }

  static async getInstagramMentions(data: GetInstagramMentionsDto): Promise<UriResponse<any[]>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<any[]>>> = await UriHttpClient.getClient().get(`${insightApiRoutes.instagramMentions}?${queryString}`);
    return response.data;
  }

  // static async searchDynamicKeywords(
  //     data: SearchDynamicKeywords
  // ): Promise<UriResponse<any[]>> {
  //     const queryString = Object.entries(data)
  //         .map(
  //             ([key, value]) =>
  //                 `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  //         )
  //         .join("&");
  //     const response: Awaited<AxiosResponse<UriResponse<any[]>>> =
  //         await UriHttpClient.getClient().get(
  //             `${insightApiRoutes.searchDynamicKeywords}?${queryString}`
  //         );
  //     return response.data;
  // }
}
