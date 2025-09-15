import { UriHttpClient } from '@/configs/http.config';
import { profileApiRoutes } from '@/constants/routes/profileApiRoutes';
import { ClientProfileDto } from '@/models/dtos/ClientProfileDto';
import { ClientProfileFilterDto } from '@/models/dtos/ClientProfileFilterDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { GetClientsProfileDto } from '../models/dtos/GetClientsProfileDto';
import { ProfileCompletionDto } from '../models/dtos/ProfileCompletionDto';
import { SearchDto } from '../models/dtos/SearchDto';

export class ClientProfileService {
  static async createProfileApi(data: ClientProfileDto): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().post(profileApiRoutes.createClientProfile, data);
    return response.data;
  }

  static async updateProfileApi(data: ClientProfileDto): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().post(profileApiRoutes.updateClientProfile, data);
    if (response.data.responseData && response.data.responseCode === 200) {
      response.data.responseData.isCompleted = (await ClientProfileService.getProfileStatusByUserIdApi(data.userId)).responseData?.profileComplete ?? false;
    }
    return response.data;
  }

  static async getProfileByUserIdApi(userId?: string): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getClientProfileByUserId}/${userId}`);
    return response.data;
  }

  static async getProfileByIdApi(id?: string): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getClientProfileByUserId}/${id}`);
    return response.data;
  }

  static async getProfileStatusByUserIdApi(userId?: string): Promise<UriResponse<ProfileCompletionDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ProfileCompletionDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getClientProfileStatusByUserId}/${userId}`);
    return response.data;
  }

  static async getProfilesByFilterApi(data: ClientProfileFilterDto): Promise<UriResponse<GetClientsProfileDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetClientsProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getClientsProfileByFilter}?${queryString}`);
    return response.data;
  }

  static async getProfilesBySearchApi(data: SearchDto): Promise<UriResponse<GetClientsProfileDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const response: Awaited<AxiosResponse<UriResponse<GetClientsProfileDto>>> = await UriHttpClient.getClient().get(`${profileApiRoutes.getClientsProfileBySearch}?${queryString}`);
    return response.data;
  }
}
