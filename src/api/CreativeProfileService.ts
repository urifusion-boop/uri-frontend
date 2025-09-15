import { UriHttpClient } from '@/configs/http.config';
import { profileApiRoutes } from '@/constants/routes/profileApiRoutes';
import { CreativeProfileDto } from '@/models/dtos/CreativeProfileDto';
import { CreativeProfileFilterDto } from '@/models/dtos/CreativeProfileFilterDto';
import { SearchDto } from '@/models/dtos/SearchDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { GetCreativesProfileDto } from '../models/dtos/GetCreativesProfileDto';
import { ProfileCompletionDto } from '../models/dtos/ProfileCompletionDto';

export class CreativeProfileService {
  static async createProfileApi(data: CreativeProfileDto): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().post(profileApiRoutes.createCreativeProfile, data);
    return response.data;
  }

  static async updateProfileApi(data: CreativeProfileDto): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().post(profileApiRoutes.updateCreativeProfile, data);

    return response.data;
  }

  static async getProfileByUserIdApi(userId?: string, track?: boolean): Promise<UriResponse<CreativeProfileDto>> {
    // Define headers with a string index signature
    const headers: Record<string, string> = {};
    if (track) {
      headers['x-tracking-source'] = 'UI';
    }

    // Perform the Axios request with the constructed headers
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getCreativeProfileByUserId}/${userId}`, { headers });

    return response.data;
  }

  static async getProfileByIdApi(id?: string): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getCreativeProfileByUserId}/${id}`);
    return response.data;
  }

  static async getProfileStatusByUserIdApi(userId?: string): Promise<UriResponse<ProfileCompletionDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ProfileCompletionDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getCreativeProfileStatusByUserId}/${userId}`);
    return response.data;
  }

  static async getProfilesByFilterApi(data: CreativeProfileFilterDto): Promise<UriResponse<GetCreativesProfileDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => (Array.isArray(value) ? value.map((obj: any) => `${encodeURIComponent(key)}=${obj}`).join('&') : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`))
      .join('&');

    const response: Awaited<AxiosResponse<UriResponse<GetCreativesProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getCreativesProfileByFilter}?${queryString}`);
    return response.data;
  }

  static async getProfilesBySearchApi(data: SearchDto): Promise<UriResponse<GetCreativesProfileDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const response: Awaited<AxiosResponse<UriResponse<GetCreativesProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getCreativesProfileBySearch}?${queryString}`);
    return response.data;
  }
}
