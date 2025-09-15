import { CreateTrackerDto, GetAiCampaignInsight } from '../models/dtos/CreateTrackerDto';
import {
  AIConversationResponse,
  GetTrackerByFilter,
  KeywordTrackDto,
  KeywordTrackResponseDto,
  KeywordTrackerDailyFrequencyDto,
  KeywordTrackerInfluencersDto,
  KeywordTrackerPostDto,
  KeywordTrackerPostTypeDto,
  KeywordTrackerSentimentsDto,
  KeywordTrackerTopCountriesDto,
  KeywordTrackerTopPlatformsDto,
  KeywordTrackerTopWordsDto,
  SentimentOverTimeDto,
  TrackerDto,
  TrackerFilterDto,
} from '../models/dtos/TrackerDto';

import { UriHttpClient } from '@/configs/http.config';
import { keywordTrackerApiRoutes } from '@/constants/routes/trackerRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class KeywordTrackerService {
  static async createTrackerApi(data: CreateTrackerDto): Promise<UriResponse<TrackerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TrackerDto>>> = await UriHttpClient.getClient().post(keywordTrackerApiRoutes.create, data);
    return response.data;
  }

  // keyword only
  static async getAiConversationInsight(data: GetAiCampaignInsight): Promise<UriResponse<AIConversationResponse>> {
    const queryString = ObjectHelper.filterMap(data);
    const response: Awaited<AxiosResponse<UriResponse<AIConversationResponse>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.aiConversationsInsights}?${queryString}`);
    return response.data;
  }

  static async updateTrackerApi(data: Partial<TrackerDto>): Promise<UriResponse<TrackerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TrackerDto>>> = await UriHttpClient.getClient().post(keywordTrackerApiRoutes.update, data);
    return response.data;
  }

  static async getTrackerByIdApi(trackerId?: string): Promise<UriResponse<TrackerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TrackerDto>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.getById}?tracker_id=${trackerId}`);
    return response.data;
  }

  static async getTrackersByFilters(data: TrackerFilterDto): Promise<UriResponse<GetTrackerByFilter>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetTrackerByFilter>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async keywordTrack(data: KeywordTrackDto): Promise<UriResponse<KeywordTrackResponseDto>> {
    const queryString = ObjectHelper.filterMap(data);
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackResponseDto>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.track}?${queryString}`);
    return response.data;
  }

  static async deleteTrackerApi(trackerId: string): Promise<UriResponse<TrackerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TrackerDto>>> = await UriHttpClient.getClient().delete(`${keywordTrackerApiRoutes.delete}?tracker_id=${trackerId}`);
    return response?.data;
  }

  // keyword only
  static async keywordSentiments(data: KeywordTrackDto): Promise<UriResponse<KeywordTrackerSentimentsDto>> {
    const queryString = ObjectHelper.filterMap(data);
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerSentimentsDto>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.sentiments}?${queryString}`);
    return response.data;
  }

  static async postType(cacheKey: string): Promise<UriResponse<KeywordTrackerPostTypeDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerPostTypeDto[]>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.postType}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async topCountries(cacheKey: string): Promise<UriResponse<KeywordTrackerTopCountriesDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerTopCountriesDto[]>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.topCountries}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async dailyFrequency(cacheKey: string): Promise<UriResponse<KeywordTrackerDailyFrequencyDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerDailyFrequencyDto[]>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.dailyFrequency}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async topWords(cacheKey: string): Promise<UriResponse<KeywordTrackerTopWordsDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerTopWordsDto[]>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.topWords}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async topPlatforms(cacheKey: string): Promise<UriResponse<KeywordTrackerTopPlatformsDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerTopPlatformsDto[]>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.topPlatforms}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async influencers(cacheKey: string): Promise<UriResponse<KeywordTrackerInfluencersDto>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerInfluencersDto>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.influencers}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async getPosts(cacheKey: string): Promise<UriResponse<KeywordTrackerPostDto>> {
    const response: Awaited<AxiosResponse<UriResponse<KeywordTrackerPostDto>>> = await UriHttpClient.getClient().get(`${keywordTrackerApiRoutes.posts}?cache_key=${cacheKey}`);
    return response.data;
  }

  static async getSentimentOverTime(web_cacheKey: string, twitter_cachekey: string): Promise<UriResponse<SentimentOverTimeDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<SentimentOverTimeDto[]>>> = await UriHttpClient.getClient().get(
      `${keywordTrackerApiRoutes.sentimentOverTime}?web_sentiment_cache_key=${web_cacheKey}&twitter_sentiment_cache_key=${twitter_cachekey}`
    );
    return response.data;
  }

  static async getHashtagSuggestions(): Promise<UriResponse<string[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          responseCode: 200,
          responseMessage: 'Hashtag suggestions fetched successfully',
          responseData: ['#React', '#JavaScript', '#TypeScript', '#WebDevelopment'],
        });
      }, 500);
    });
  }
}
