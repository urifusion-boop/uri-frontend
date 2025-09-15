import { UriHttpClient } from '@/configs/http.config';
import { creativeFeedApiRoutes } from '@/constants/routes/creativeFeedApiRoutes';
import { CreateFeedDto } from '@/models/dtos/CreateFeedDto';
import { FeedDto } from '@/models/dtos/FeedDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class CreativeFeedService {
  static async createFeedApi(data: CreateFeedDto): Promise<UriResponse<FeedDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedDto>>> = await UriHttpClient.getClient().post(creativeFeedApiRoutes.createFeed, data);
    return response.data;
  }

  static async updateFeedApi(data: FeedDto): Promise<UriResponse<FeedDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedDto>>> = await UriHttpClient.getClient().post(creativeFeedApiRoutes.updateFeed, data);
    return response.data;
  }

  static async deleteFeedApi(feedId: string): Promise<UriResponse<any>> {
    const route = `${creativeFeedApiRoutes.deleteFeed}/${feedId}`;
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().delete(route);
    return response.data;
  }
}
