import { UriHttpClient } from '@/configs/http.config';
import { feedApiRoutes } from '@/constants/routes/feedApiRoutes';
import { FeedDto } from '@/models/dtos/FeedDto';
import { FeedFilterDto } from '@/models/dtos/FeedFilterDto';
import { GetCreativesFeedsDto } from '@/models/dtos/GetCreativesFeedsDto';
import { LikeFeedDto } from '@/models/dtos/LikeFeedDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class FeedService {
  static async getFeedsByFilterApi(data: FeedFilterDto): Promise<UriResponse<GetCreativesFeedsDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetCreativesFeedsDto>>> = await UriHttpClient.getClient().get(`${feedApiRoutes.getFeedByFilters}?${queryString}`);
    return response.data;
  }

  static async getFeedByIdApi(id?: string): Promise<UriResponse<FeedDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedDto>>> = await UriHttpClient.getClient().get(`${feedApiRoutes.getFeedById}/${id}`);
    return response.data;
  }

  static async likeFeedApi(data: LikeFeedDto): Promise<UriResponse<FeedDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedDto>>> = await UriHttpClient.getClient().post(feedApiRoutes.likeFeed, data);
    return response.data;
  }

  static async unlikeFeedApi(data: LikeFeedDto): Promise<UriResponse<FeedDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedDto>>> = await UriHttpClient.getClient().post(feedApiRoutes.unlikeFeed, data);
    return response.data;
  }
}
