import { AiMediaReportDto } from '@/models/dtos/AiMediaReportDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { UriHttpClient } from '../configs/http.config';
import { facebookInsightsRoutes } from '../constants/routes/facebookInsightsRoutes';
import { ObjectHelper } from '../helpers/ObjectHelper';
import {
  FacebookBusinessDiscoveryResponse,
  FacebookInsightsResponseDto,
  FacebookPageInsightsResponse,
  FacebookPageReelsResponse,
  GetFaceBookBusinessDiscovery,
  GetFacebookMentionDto,
  GetFacebookMentionsResponse,
  GetFacebookPageInsights,
  GetFacebookPhotoInsights,
  PostData,
  SearchFacebookPage,
} from '../models/dtos/FacebookInsightsDto';

export class FacebookInsightsService {
  static async fetchUserFacebookPages(): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(facebookInsightsRoutes.fetchUserFacebookPages);
    return response.data;
  }

  static async getFacebookPageInsights(data: GetFacebookPageInsights, accessToken: string): Promise<UriResponse<FacebookPageInsightsResponse>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${facebookInsightsRoutes.getFacebookPageInsights}?${queryString}`;

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }

    const response: Awaited<AxiosResponse<UriResponse<FacebookPageInsightsResponse>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async searchFacebookPages(data: SearchFacebookPage): Promise<UriResponse<string>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${facebookInsightsRoutes.searchFacebookPages}/${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getFacebookPhotoInsights(data: GetFacebookPhotoInsights): Promise<UriResponse<string>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${facebookInsightsRoutes.getFacebookPhotoInsights}/${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getBusinessDiscovery(data: GetFaceBookBusinessDiscovery, accessToken: string): Promise<UriResponse<FacebookBusinessDiscoveryResponse>> {
    const queryString = ObjectHelper.filterMap(data);

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }

    const url = `${facebookInsightsRoutes.getBusinessDiscovery}?${queryString}`;

    const response: Awaited<AxiosResponse<UriResponse<FacebookBusinessDiscoveryResponse>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getFacebookReels(data: GetFaceBookBusinessDiscovery, accessToken: string): Promise<UriResponse<FacebookPageReelsResponse>> {
    const queryString = ObjectHelper.filterMap(data);

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }

    const url = `${facebookInsightsRoutes.getFacebookPageReels}?${queryString}`;

    const response: Awaited<AxiosResponse<UriResponse<FacebookPageReelsResponse>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getFacebookVideoInsights(accessToken: string, video_id: string, period: string = 'lifetime'): Promise<UriResponse<FacebookInsightsResponseDto>> {
    let metrics =
      'blue_reels_play_count,fb_reels_replay_count,fb_reels_total_plays,post_impressions_unique,post_video_avg_time_watched,post_video_followers,post_video_likes_by_reaction_type,post_video_retention_graph,post_video_social_actions,post_video_view_time';

    const queryString = ObjectHelper.filterMap({ video_id, period, metrics });

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }

    const url = `${facebookInsightsRoutes.getVideoInsights}?${queryString}`;

    const response: Awaited<AxiosResponse<UriResponse<FacebookInsightsResponseDto>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getFacebookPostInsights(accessToken: string, post_id: string, metrics: string, period: string = 'lifetime'): Promise<UriResponse<FacebookInsightsResponseDto>> {
    const queryString = ObjectHelper.filterMap({ post_id, period, metrics });

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }

    const url = `${facebookInsightsRoutes.getPostInsights}?${queryString}`;

    const response: Awaited<AxiosResponse<UriResponse<FacebookInsightsResponseDto>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getFacebookMentions(data: GetFacebookMentionDto, accessToken: string): Promise<UriResponse<GetFacebookMentionsResponse>> {
    const queryString = ObjectHelper.filterMap(data);

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }

    const url = `${facebookInsightsRoutes.getFacebookMentions}?${queryString}`;

    const response: Awaited<AxiosResponse<UriResponse<GetFacebookMentionsResponse>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async fetchFacebookAiMediaReport(cache_key: string): Promise<UriResponse<AiMediaReportDto>> {
    const url = `${facebookInsightsRoutes.fetchFacebookAiMediaReport}?cache_key=${cache_key}`;
    const headers: Record<string, string> = {};
    const response: Awaited<AxiosResponse<UriResponse<AiMediaReportDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getFacebookPost(accessToken: string, previous?: string, next?: string): Promise<UriResponse<PostData>> {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['meta-access-token'] = accessToken;
    }
    const url = `${facebookInsightsRoutes.getFacebookPost}?previous=${previous}&next=${next}`;
    const response: Awaited<AxiosResponse<UriResponse<PostData>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }
}
