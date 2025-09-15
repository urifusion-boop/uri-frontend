import { UriHttpClient } from '@/configs/http.config';
import { linkedinInsightsApiRoutes } from '@/constants/routes/linkedinInsightsApiRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import {
  GetLinkedinPostsDto,
  LinkedinAiMediaReportDto,
  LinkedinBusinessDiscoveryDto,
  LinkedinFollowersStatisticsParameterDto,
  LinkedinFollowersStatisticsResponserDto,
  LinkedInPostCommentDto,
  LinkedinPostsDto,
  OrganizationDetailsDto,
  StatisticsTimeResponseDto,
} from '@/models/dtos/LinkedinInsightsDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class LinkedInInsightsService {
  static async saveLinkedInAccount(user_id: string, token_scope: string, access_token: string): Promise<UriResponse<string>> {
    const url = `${linkedinInsightsApiRoutes.saveLinkedInAccount}?user_id=${user_id}&token_scope=${token_scope}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async retrieveOrganizationById(organization_id: string, access_token: string): Promise<UriResponse<OrganizationDetailsDto>> {
    const url = `${linkedinInsightsApiRoutes.retrieveOrganizationById}/${organization_id}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<OrganizationDetailsDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getAllLinkedinPosts(data: GetLinkedinPostsDto, access_token: string): Promise<UriResponse<LinkedinPostsDto[]>> {
    const queryString = ObjectHelper.filterMap(data);

    const url = `${linkedinInsightsApiRoutes.getAllLinkedinPosts}?${queryString}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<LinkedinPostsDto[]>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getBusinessDiscovery(organization_id: string, access_token: string): Promise<UriResponse<LinkedinBusinessDiscoveryDto>> {
    const url = `${linkedinInsightsApiRoutes.businessDiscovery}?organization_id=${organization_id}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<LinkedinBusinessDiscoveryDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async getAiMediaReport(cache_key: string): Promise<UriResponse<LinkedinAiMediaReportDto>> {
    const url = `${linkedinInsightsApiRoutes.aiMediaReport}?cache_key=${cache_key}`;
    const response: Awaited<AxiosResponse<UriResponse<LinkedinAiMediaReportDto>>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async shareStatisticsLifeTime(organization_id: string, access_token: string): Promise<UriResponse<StatisticsTimeResponseDto>> {
    const url = `${linkedinInsightsApiRoutes.shareStatisticsLifeTime}?organization_id=${organization_id}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<StatisticsTimeResponseDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async shareStatisticsSpecificShare(organization_id: string, access_token: string, share_ids: string): Promise<UriResponse<StatisticsTimeResponseDto>> {
    const url = `${linkedinInsightsApiRoutes.shareStatisticsSpecificShare}?organization_id=${organization_id}&share_ids=${share_ids}`;
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }
    const response: Awaited<AxiosResponse<UriResponse<StatisticsTimeResponseDto>>> = await UriHttpClient.getClient().get(url, { headers });
    return response.data;
  }

  static async shareStatisticsSpecificUgcPost(organization_id: string, access_token: string, ugc_post_ids: string): Promise<UriResponse<StatisticsTimeResponseDto>> {
    const url = `${linkedinInsightsApiRoutes.shareStatisticsSpecificUgcPost}?organization_id=${organization_id}&ugc_post_ids=${ugc_post_ids}`;

    const headers: Record<string, string> = {};

    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<StatisticsTimeResponseDto>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getLinkedInPostComments(organization_id: string, access_token: string): Promise<UriResponse<LinkedInPostCommentDto[]>> {
    const url = `${linkedinInsightsApiRoutes.postsComments}?share_id=${organization_id}`;

    const headers: Record<string, string> = {};

    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<LinkedInPostCommentDto[]>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }

  static async getTimeBoundFollowersStatistics(data: LinkedinFollowersStatisticsParameterDto, access_token: string): Promise<UriResponse<LinkedinFollowersStatisticsResponserDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const url = `${linkedinInsightsApiRoutes.getLinkedinFollowersStatics}?${queryString}`;

    const headers: Record<string, string> = {};

    if (access_token) {
      headers['linkedin-access-token'] = access_token;
    }

    const response: Awaited<AxiosResponse<UriResponse<LinkedinFollowersStatisticsResponserDto>>> = await UriHttpClient.getClient().get(url, { headers });

    return response.data;
  }
}
