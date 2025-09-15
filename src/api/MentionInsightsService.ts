import { UriHttpClient } from '@/configs/http.config';
import { mentionInsightsApiRoutes } from '@/constants/routes/mentionInsightsApiRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import { AlertAnalyticsResponse, GetMentionsByFiltersDto, MentionInsightsDto } from '@/models/dtos/MentionInsightsDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class MentionService {
  static async getMentionByFilters(data: GetMentionsByFiltersDto): Promise<UriResponse<MentionInsightsDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const url = `${mentionInsightsApiRoutes.getByFilters}?${queryString}`;

    const response: Awaited<AxiosResponse<UriResponse<MentionInsightsDto>>> = await UriHttpClient.getClient().get(url);

    return response.data;
  }

  static async markAsRead(mentionId: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().post(`${mentionInsightsApiRoutes.markAsRead}?mention_id=${mentionId}`);

    return response.data;
  }

  static async markAsStarred(mentionId: string, starred: boolean): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().post(`${mentionInsightsApiRoutes.markAsStarred}?mention_id=${mentionId}&starred=${starred}`);

    return response.data;
  }

  static async delete(mentionId: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().delete(`${mentionInsightsApiRoutes.delete}?mention_id=${mentionId}`);

    return response.data;
  }

  static async analysis(userId: string, date_filter: string): Promise<UriResponse<AlertAnalyticsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<AlertAnalyticsResponse>>> = await UriHttpClient.getClient().get(
      `${mentionInsightsApiRoutes.analytics}?user_id=${userId}&date_filter=${date_filter}`
    );

    return response.data;
  }
}
