import { ObjectHelper } from '@/helpers/ObjectHelper';
import { SubscriptionPlanFilterDto, SubscriptionResponseData } from '@/models/dtos/SubscriptionDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { UriHttpClient } from '../configs/http.config';
import { subscriptionPlanRoutes } from '../constants/routes/subscriptionPlanRoutes';

export class SubscriptionPlanService {
  static async getSubscriptionPlans(data: SubscriptionPlanFilterDto): Promise<UriResponse<SubscriptionResponseData>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<SubscriptionResponseData>>> = await UriHttpClient.getClient().get(`${subscriptionPlanRoutes.getByFilters}?${queryString}`);

    return response.data;
  }
}
