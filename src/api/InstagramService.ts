import { AiMediaReportDto } from '@/models/dtos/AiMediaReportDto';
import { InfluencerFilterResponseDto } from '@/models/dtos/InfluencerDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { UriHttpClient } from '../configs/http.config';
import { instagramInsightRoutes, instagramRoutes } from '../constants/routes/instagramApiRoutes';
import { ObjectHelper } from '../helpers/ObjectHelper';
import { GetInstagramAuthUrlDto, GetInstagramMedia, GetInstagramUserDemographicsDto, InstagramMediaDto, InstagramMediaPostDto } from '../models/dtos/InstagramDto';
import {
  BusinessDiscovery,
  BusinessProfileInsight,
  CommentData,
  CommentSentimentAnalysis,
  DemographicInsights,
  GetInstagramUserInteractionMetricsDto,
  InstagramBusinessProfile,
  InstagramInsightsDto,
  InstagramKeywordTracker,
  InstagramUserInteractionMetrics,
  MediaInsightResponse,
  MediaResponse,
  SearchInstagramHashtag,
  TagsResponse,
  UpdateInstagramInsights,
} from '../models/dtos/InstagramInsights';

export class InstagramService {
  static async getAuthUrl(): Promise<UriResponse<GetInstagramAuthUrlDto>> {
    const response: Awaited<AxiosResponse<UriResponse<GetInstagramAuthUrlDto>>> = await UriHttpClient.getClient().get(instagramRoutes.getAuthUrl);
    return response.data;
  }

  static async getAccessToken(code: string): Promise<UriResponse<any>> {
    const url = `${instagramRoutes.getAccessToken}/${code}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getUserProfile(accessToken: string): Promise<UriResponse<any>> {
    const url = `${instagramRoutes.getUserProfile}/${accessToken}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getUserMedia(data: GetInstagramMedia): Promise<UriResponse<InstagramMediaDto>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramRoutes.getUserMedia}?${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<InstagramMediaDto>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getUserInsights(accessToken: string): Promise<UriResponse<any>> {
    const url = `${instagramRoutes.getUserInsights}/${accessToken}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getInstagramMediaPostInsights(access_token: string, data: InstagramMediaPostDto): Promise<UriResponse<MediaInsightResponse>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.getInstagramMediaPostInsights}?${queryString}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<MediaInsightResponse>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async connect(userId: string, code: string): Promise<UriResponse<any>> {
    const url = `${instagramRoutes.connect}/${userId}?code=${code}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async disconnect(userId: string): Promise<UriResponse<string>> {
    const url = `${instagramRoutes.disconnect}/${userId}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async updateInstagramInsights(data: UpdateInstagramInsights): Promise<UriResponse<string>> {
    const url = `${instagramInsightRoutes.updateInstagramInsights}/${data.ig_user_id}/insights`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().post(url, data);
    return response.data;
  }

  static async deleteInstagramInsights(ig_user_id: string): Promise<UriResponse<string>> {
    const url = `${instagramInsightRoutes.deleteInstagramInsights}/${ig_user_id}/insights`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getInstagramInsights(data: InstagramInsightsDto): Promise<UriResponse<string>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.getInstagramInsights}?${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async searchInstagramHashtag(data: SearchInstagramHashtag): Promise<UriResponse<string>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.searchInstagramHashtag}?${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getInstagramHashtag(influencer_id: string): Promise<UriResponse<string>> {
    const url = `${instagramInsightRoutes.getInstagramHashtag}?influencer_id=${influencer_id}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async instagramBusinessDiscovery(data: BusinessDiscovery): Promise<UriResponse<InstagramBusinessProfile>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.businessDiscovery}?${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<InstagramBusinessProfile>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async fetchBusinessTags(ig_user_id: string, access_token: string, after?: string): Promise<UriResponse<TagsResponse>> {
    let url = `${instagramInsightRoutes.fetchBusinessTags}?ig_user_id=${ig_user_id}`;
    if (after) {
      url += `&after=${after}`;
    }
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<TagsResponse>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async fetchBusinessMedia(ig_user_id: string, access_token: string, next?: string): Promise<UriResponse<MediaResponse>> {
    let url = `${instagramInsightRoutes.fetchBusinessMedia}?ig_user_id=${ig_user_id}`;
    if (next) {
      url += `&next=${encodeURIComponent(next)}`;
    }
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<MediaResponse>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async fetchBusinessStories(ig_user_id: string, access_token: string): Promise<UriResponse<BusinessProfileInsight[]>> {
    let url = `${instagramInsightRoutes.fetchBusinessStories}?ig_user_id=${ig_user_id}`;

    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<BusinessProfileInsight[]>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async fetchBusinessMentions(media_id: string): Promise<UriResponse<string>> {
    const url = `${instagramInsightRoutes.fetchBusinessMentions}?media_id=${media_id}`;
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async instagramTrackKeyword(keyword: string, access_token: string): Promise<UriResponse<InstagramKeywordTracker>> {
    const url = `${instagramInsightRoutes.instagramTrackKeyword}?keyword=${keyword}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<InstagramKeywordTracker>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async saveInstagramFacebookInfluencerAccount(userId: string, access_token: string): Promise<UriResponse<InfluencerFilterResponseDto>> {
    const url = `${instagramInsightRoutes.saveInstagramandFacebookAccount}?user_id=${userId}`;

    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<InfluencerFilterResponseDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getInstagramUserInsights(ig_user_id: string, access_token: string, data?: InstagramInsightsDto): Promise<UriResponse<any>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.getInstagramInsightsByIgUserId}/${ig_user_id}/insights?${queryString}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getInstagramDemographics(access_token: string, data: any): Promise<UriResponse<DemographicInsights[]>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.getInstagramDemographics}?${queryString}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<DemographicInsights[]>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getInstagramMediaInsights(ig_media_id: string, access_token: string, data?: InstagramInsightsDto): Promise<UriResponse<any>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.getInstagramInsightsByIgUserId}/${ig_media_id}/insights?${queryString}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Meta-Access-Token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getInstagramCommentSentimentInsights(comments: CommentData[]): Promise<UriResponse<CommentSentimentAnalysis>> {
    const response: Awaited<AxiosResponse<UriResponse<CommentSentimentAnalysis>>> = await UriHttpClient.getClient().post(instagramInsightRoutes.getInstagramCommentSentimentInsights, { comments });
    return response.data;
  }

  static async getInstagramDemographicMetricInsights(data: GetInstagramUserDemographicsDto, accessToken: string): Promise<UriResponse<DemographicInsights[]>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.getInstagramDemographicMetricInsights}?${queryString}`;
    const headers: Record<string, string> = {};
    if (accessToken) headers['Meta-Access-Token'] = accessToken;

    const response: Awaited<AxiosResponse<UriResponse<DemographicInsights[]>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async fetchInstagramUserInteractionMetrics(data: GetInstagramUserInteractionMetricsDto, accessToken: string): Promise<UriResponse<InstagramUserInteractionMetrics[]>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${instagramInsightRoutes.fetchInstagramUserInteractionMetics}?${queryString}`;
    const headers: Record<string, string> = {};
    if (accessToken) headers['Meta-Access-Token'] = accessToken;

    const response: Awaited<AxiosResponse<UriResponse<InstagramUserInteractionMetrics[]>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async fetchInstagramAiMediaReport(cache_key: string): Promise<UriResponse<AiMediaReportDto>> {
    const url = `${instagramInsightRoutes.fetchInstagramAiMediaReport}?cache_key=${cache_key}`;
    const headers: Record<string, string> = {};
    const response: Awaited<AxiosResponse<UriResponse<AiMediaReportDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }
}
