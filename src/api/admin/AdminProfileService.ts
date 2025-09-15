import { UriHttpClient } from '@/configs/http.config';
import { adminProfileApiRoutes } from '@/constants/ApiRoute';
import { CreativeProfileDto } from '@/models/dtos/CreativeProfileDto';
import { CreativeProfileFilterDto } from '@/models/dtos/CreativeProfileFilterDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { AdminDeleteDocDto } from '../../models/dtos/AdminDeleteDocDto';
import { ClientProfileDto } from '../../models/dtos/ClientProfileDto';
import { ClientProfileFilterDto } from '../../models/dtos/ClientProfileFilterDto';
import { GetClientsProfileDto } from '../../models/dtos/GetClientsProfileDto';
import { GetCreativesProfileDto } from '../../models/dtos/GetCreativesProfileDto';
import { ClientProfileService } from '../ClientProfileService';
import { CreativeProfileService } from '../CreativeProfileService';

export class AdminProfileService {
  static async createCreativeProfileApi(data: CreativeProfileDto): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().post(adminProfileApiRoutes.createCreativeProfile, data);
    return response.data;
  }

  static async updateCreativeProfileApi(data: CreativeProfileDto): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().post(adminProfileApiRoutes.updateCreativeProfile, data);
    if (response.data.responseData && response.data.responseCode === 200) {
      response.data.responseData.isCompleted = (await CreativeProfileService.getProfileStatusByUserIdApi(data.userId)).responseData?.profileComplete ?? false;
    }
    return response.data;
  }

  static async getCreativeProfileByUserIdApi(userId?: string, track?: boolean): Promise<UriResponse<CreativeProfileDto>> {
    // Define headers with a string index signature
    const headers: Record<string, string> = {};
    if (track) {
      headers['x-tracking-source'] = 'UI';
    }

    // Perform the Axios request with the constructed headers
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getCreativeProfileByUserId}/${userId}`, { headers });

    return response.data;
  }

  static async getCreativeProfileByIdApi(id?: string): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getCreativeProfileByUserId}/${id}`);
    return response.data;
  }

  static async getCreativeProfileStatusByUserIdApi(userId?: string): Promise<UriResponse<boolean>> {
    const response: Awaited<AxiosResponse<UriResponse<boolean>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getCreativeProfileStatusByUserId}/${userId}`);
    return response.data;
  }

  static async getCreativeProfilesByFilterApi(data: CreativeProfileFilterDto): Promise<UriResponse<GetCreativesProfileDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => (Array.isArray(value) ? value.map((obj: any) => `${encodeURIComponent(key)}=${obj}`).join('&') : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`))
      .join('&');

    const response: Awaited<AxiosResponse<UriResponse<GetCreativesProfileDto>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getCreativesProfileByFilter}?${queryString}`);
    return response.data;
  }

  static async createClientProfileApi(data: ClientProfileDto): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().post(adminProfileApiRoutes.createClientProfile, data);
    return response.data;
  }

  static async updateClientProfileApi(data: ClientProfileDto): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().post(adminProfileApiRoutes.updateClientProfile, data);
    if (response.data.responseData && response.data.responseCode === 200) {
      response.data.responseData.isCompleted = (await ClientProfileService.getProfileStatusByUserIdApi(data.userId)).responseData?.profileComplete ?? false;
    }
    return response.data;
  }

  static async getClientProfileByUserIdApi(userId?: string): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getClientProfileByUserId}/${userId}`);
    return response.data;
  }

  static async getClientProfileByIdApi(id?: string): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getClientProfileByUserId}/${id}`);
    return response.data;
  }

  static async getClientProfileStatusByUserIdApi(userId?: string): Promise<UriResponse<boolean>> {
    const response: Awaited<AxiosResponse<UriResponse<boolean>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getClientProfileStatusByUserId}/${userId}`);
    return response.data;
  }

  static async getClientProfilesByFilterApi(data: ClientProfileFilterDto): Promise<UriResponse<GetClientsProfileDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetClientsProfileDto>>> = await UriHttpClient.getClient().get(`${adminProfileApiRoutes.getClientsProfileByFilter}?${queryString}`);
    return response.data;
  }

  static async deleteCreativeProfileDoc(data: AdminDeleteDocDto): Promise<UriResponse<CreativeProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<CreativeProfileDto>>> = await UriHttpClient.getClient().post(adminProfileApiRoutes.deleteCreativeDoc, data);
    return response.data;
  }

  static async deleteClientProfileDoc(data: AdminDeleteDocDto): Promise<UriResponse<ClientProfileDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ClientProfileDto>>> = await UriHttpClient.getClient().post(adminProfileApiRoutes.deleteClientDoc, data);
    return response.data;
  }
}
