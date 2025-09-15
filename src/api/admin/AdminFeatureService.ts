import { UriHttpClient } from '@/configs/http.config';
import { adminFeatureRoutes } from '@/constants/ApiRoute';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { FeatureDto } from '../../models/dtos/FeatureDto';
import { FeatureFilterDto } from '../../models/dtos/FeatureFilterDto';
import { GetFeaturesDto } from '../../models/dtos/GetFeaturesDto';

export class AdminFeatureService {
  static async createFeatureApi(data: FeatureDto): Promise<UriResponse<FeatureDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeatureDto>>> = await UriHttpClient.getClient().post(adminFeatureRoutes.createFeature, data);
    return response.data;
  }

  static async updateFeatureApi(data: FeatureDto): Promise<UriResponse<FeatureDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeatureDto>>> = await UriHttpClient.getClient().post(adminFeatureRoutes.updateFeature, data);
    return response.data;
  }

  static async getFeatureByIdApi(id?: string): Promise<UriResponse<FeatureDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeatureDto>>> = await UriHttpClient.getClient().get(`${adminFeatureRoutes.getById}/${id}`);
    return response.data;
  }

  static async getFeaturesByFilterApi(data: FeatureFilterDto): Promise<UriResponse<GetFeaturesDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetFeaturesDto>>> = await UriHttpClient.getClient().get(`${adminFeatureRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async deleteFeatureApi(id: string): Promise<UriResponse<null>> {
    const response: Awaited<AxiosResponse<UriResponse<null>>> = await UriHttpClient.getClient().delete(`${adminFeatureRoutes.deleteFeature}/${id}`);
    return response.data;
  }
}
