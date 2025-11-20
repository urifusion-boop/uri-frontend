import { UriHttpClient } from '@/configs/http.config';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export interface UserModule {
  moduleId: string;
  enabled: boolean;
  addedAt: string;
  removedAt?: string;
  lastAccessedAt?: string;
  accessCount: number;
  setupCompleted: boolean;
}

export interface AddModuleDto {
  moduleId: string;
}

export interface UpdateModulesDto {
  modules: string[];
}

export class UserModuleService {
  static async getEnabledModules(userId: string): Promise<UriResponse<UserModule[]>> {
    const response: Awaited<AxiosResponse<UriResponse<UserModule[]>>> =
      await UriHttpClient.getClient().get(`/api/v1/users/${userId}/modules`);
    return response.data;
  }

  static async addModule(userId: string, data: AddModuleDto): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().post(`/api/v1/users/${userId}/modules`, data);
    return response.data;
  }

  static async removeModule(userId: string, moduleId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().delete(`/api/v1/users/${userId}/modules/${moduleId}`);
    return response.data;
  }

  static async updateModules(userId: string, data: UpdateModulesDto): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().put(`/api/v1/users/${userId}/modules`, data);
    return response.data;
  }

  static async trackModuleAccess(userId: string, moduleId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().put(`/api/v1/users/${userId}/modules/access/${moduleId}`);
    return response.data;
  }
}
