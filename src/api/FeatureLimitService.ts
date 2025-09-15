import { UriHttpClient } from '@/configs/http.config';
import { featureLimitApiRoutes } from '@/constants/routes/featureLimitRoutes';
import { FeatureLimitDto } from '@/models/dtos/FeatureLimitDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class FeatureLimitService {
  static async getUserFeatureLimit(userId: string): Promise<UriResponse<FeatureLimitDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeatureLimitDto>>> = await UriHttpClient.getClient().get(`${featureLimitApiRoutes.getUserFeatureLimit}/${userId}`);
    return response.data;
  }
}
