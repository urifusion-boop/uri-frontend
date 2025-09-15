import { UriHttpClient } from '@/configs/http.config';
import { adminSubscriptionPlanRoutes } from '@/constants/ApiRoute';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { SubscriptionPlanDto } from '../../models/dtos/SubscriptionPlanDto';

export class AdminSubscriptionPlanService {
  static async createSubscriptionPlanApi(data: SubscriptionPlanDto): Promise<UriResponse<SubscriptionPlanDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SubscriptionPlanDto>>> = await UriHttpClient.getClient().post(adminSubscriptionPlanRoutes.createSubscriptionPlan, data);
    return response.data;
  }

  static async updateSubscriptionPlanApi(data: SubscriptionPlanDto): Promise<UriResponse<SubscriptionPlanDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SubscriptionPlanDto>>> = await UriHttpClient.getClient().post(adminSubscriptionPlanRoutes.updateSubscriptionPlan, data);
    return response.data;
  }

  static async deleteSubscriptionPlanApi(id: string): Promise<UriResponse<null>> {
    const response: Awaited<AxiosResponse<UriResponse<null>>> = await UriHttpClient.getClient().delete(`${adminSubscriptionPlanRoutes.deleteSubscriptionPlan}/${id}`);
    return response.data;
  }
}
