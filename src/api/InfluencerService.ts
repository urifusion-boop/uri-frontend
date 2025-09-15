import { UriHttpClient } from '@/configs/http.config';
import { influencerApiRoutes } from '@/constants/routes/influencerApiRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { CreateInfluencerDto, InfluencerDto, InfluencerFilterDto, InfluencerFilterResponseDto } from '../models/dtos/InfluencerDto';

export class InfluencerService {
  static async createInfluencerApi(data: CreateInfluencerDto): Promise<UriResponse<InfluencerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<InfluencerDto>>> = await UriHttpClient.getClient().post(influencerApiRoutes.create, data);
    return response.data;
  }

  static async updateInfluencerApi(data: Partial<InfluencerDto>): Promise<UriResponse<InfluencerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<InfluencerDto>>> = await UriHttpClient.getClient().post(influencerApiRoutes.update, data);
    return response.data;
  }

  static async getInfluencerByIdApi(influencerId?: string): Promise<UriResponse<InfluencerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<InfluencerDto>>> = await UriHttpClient.getClient().get(`${influencerApiRoutes.getById}?influencer_id=${influencerId}`);
    return response.data;
  }

  static async getInfluencersByFilters(data: InfluencerFilterDto): Promise<UriResponse<InfluencerFilterResponseDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<InfluencerFilterResponseDto>>> = await UriHttpClient.getClient().get(`${influencerApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async deleteInfluencerApi(influencerId: string): Promise<UriResponse<InfluencerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<InfluencerDto>>> = await UriHttpClient.getClient().delete(`${influencerApiRoutes.delete}?influencer_id=${influencerId}`);
    return response.data;
  }
}
