import { UriHttpClient } from '@/configs/http.config';
import { userApiRoutes } from '@/constants/routes/userApiRoutes';
import { UpdateUserDto } from '@/models/dtos/UpdateUserDto';
import { UserDto } from '@/models/dtos/UserDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { DeleteUserDto } from '../models/dtos/DeleteUserDto';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';

export class UserService {
  static async updateUserApi(user?: UserDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(userApiRoutes.updateUser, user);
    return response.data;
  }

  static async getByUserIdApi(userId?: string): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().get(`${userApiRoutes.getUserById}/${userId}`);
    return response.data;
  }

  static async getLoggedInUserApi(): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().get(`${userApiRoutes.getLoggedInUser}`);
    return response.data;
  }

  static async deleteUserApi(data?: DeleteUserDto): Promise<UriResponse<null>> {
    const response: Awaited<AxiosResponse<UriResponse<null>>> = await UriHttpClient.getClient().post(userApiRoutes.deleteUser, data);
    return response.data;
  }

  static async updateUserAppTokenApi(user?: UpdateUserDto): Promise<UriResponse<UserDto>> {
    const data = { userId: user?.userId, appToken: user?.appToken };
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(userApiRoutes.updateUserAppToken, data);
    return response.data;
  }

  // Workflow Management Methods
  static async getUserWorkflows(userId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/users/${userId}/workflows`);
    return response.data;
  }

  static async addWorkflow(userId: string, workflowId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/users/${userId}/workflows`, {
      workflowId,
    });
    return response.data;
  }

  static async removeWorkflow(userId: string, workflowId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().delete(`${BackendUrlEnum.BACKEND}/users/${userId}/workflows/${workflowId}`);
    return response.data;
  }

  static async setPrimaryWorkflow(userId: string, workflowId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().put(`/api/v1/users/${userId}/workflows/primary`, {
      workflowId,
    });
    return response.data;
  }

  // Module Management Methods
  static async addModule(userId: string, moduleId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(`/api/v1/users/${userId}/modules`, {
      moduleId,
    });
    return response.data;
  }

  static async removeModule(userId: string, moduleId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().delete(`/api/v1/users/${userId}/modules/${moduleId}`);
    return response.data;
  }
}
