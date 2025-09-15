import { UriHttpClient } from '@/configs/http.config';
import { subscriptionRoutes } from '@/constants/routes/subscriptionRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import {
  ActiveSubscriptionResponseDto,
  DisableSubscriptionResponseDto,
  GetSubscriptionProviderParametersDto,
  SubscriptionDto,
  SubscriptionResponseDto,
  SubscriptionsResponseDto,
  TrialSubscriptionDto,
  UpdateSubscriptionParametersDto,
} from '@/models/dtos/SubscriptionDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class SubscriptionService {
  static async chargeSubscription(data: SubscriptionDto, paystackId?: number): Promise<UriResponse<SubscriptionResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SubscriptionResponseDto>>> = await UriHttpClient.getClient().post(`${subscriptionRoutes.charge}/${paystackId}`, data);

    return response.data;
  }

  static async trialSubscription(data: TrialSubscriptionDto): Promise<UriResponse<SubscriptionResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SubscriptionResponseDto>>> = await UriHttpClient.getClient().post(subscriptionRoutes.trial, data);

    return response.data;
  }

  static async getActiveSubscriptionByPaystackId(paystackId: number): Promise<UriResponse<ActiveSubscriptionResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ActiveSubscriptionResponseDto>>> = await UriHttpClient.getClient().get(`${subscriptionRoutes.getByPaystackId}/${paystackId}`);

    return response.data;
  }

  static async getActiveSubscriptionByEmail(email: string): Promise<UriResponse<ActiveSubscriptionResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ActiveSubscriptionResponseDto>>> = await UriHttpClient.getClient().get(`${subscriptionRoutes.getByEmail}/${email}`);

    return response.data;
  }

  static async getSubscriptionsByProviders(data: GetSubscriptionProviderParametersDto): Promise<UriResponse<SubscriptionsResponseDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<SubscriptionsResponseDto>>> = await UriHttpClient.getClient().get(`${subscriptionRoutes.providerFilters}?${queryString}`);

    return response.data;
  }

  static async disableSubscription(data: UpdateSubscriptionParametersDto): Promise<UriResponse<DisableSubscriptionResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<DisableSubscriptionResponseDto>>> = await UriHttpClient.getClient().post(subscriptionRoutes.disable, data);

    return response.data;
  }

  static async applyDiscount(data: { discountCode: string }): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(subscriptionRoutes.applyDiscount, data);

    return response.data;
  }
}
