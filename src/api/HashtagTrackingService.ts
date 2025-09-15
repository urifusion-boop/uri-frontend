import { AiPostReportResponse, HashtagTrackResponse, SentimentResponse } from '@/models/dtos/HashTagDto';

import { UriHttpClient } from '@/configs/http.config';
import { hashtagTrackerApiRoutes } from '@/constants/routes/hashtagTracking';
import { AiPostConversationInsights } from '@/models/dtos/TrackerDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class HashtagTrackingService {
  static async trackHashtagApi(hashtag: string, meta_access_token?: string): Promise<UriResponse<HashtagTrackResponse>> {
    const query = meta_access_token ? `?hashtag=${hashtag}&meta_access_token=${meta_access_token}` : `?hashtag=${hashtag}`;

    const response: Awaited<AxiosResponse<UriResponse<HashtagTrackResponse>>> = await UriHttpClient.getClient().get(`${hashtagTrackerApiRoutes.track}${query}`);
    return response.data;
  }

  static async aiPostReportApi(hashtag_cache_key: string) {
    const response: Awaited<AxiosResponse<UriResponse<AiPostReportResponse>>> = await UriHttpClient.getClient().get(
      `${hashtagTrackerApiRoutes.ai_post_report}?hashtag_cache_key=hashtag-${hashtag_cache_key}`
    );
    return response.data;
  }

  static async getAiConversationInsight(hashtag: string): Promise<UriResponse<AiPostConversationInsights>> {
    const response: Awaited<AxiosResponse<UriResponse<AiPostConversationInsights>>> = await UriHttpClient.getClient().get(`${hashtagTrackerApiRoutes.ai_hashtag_report}?hashtag=${hashtag}`);
    return response.data;
  }

  static async getHashtagSentiment(hashtag_cache_key: string) {
    const response: Awaited<AxiosResponse<UriResponse<SentimentResponse>>> = await UriHttpClient.getClient().get(`${hashtagTrackerApiRoutes.sentiment}?hashtag_cache_key=hashtag-${hashtag_cache_key}`);
    return response.data;
  }
}
