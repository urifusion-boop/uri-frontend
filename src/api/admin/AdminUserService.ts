import { UriHttpClient } from '@/configs/http.config';
import { adminUserRoutes } from '@/constants/ApiRoute';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { CreateUserDto } from '../../models/dtos/CreateUserDto';
import { UserDto } from '../../models/dtos/UserDto';

export class AdminUserService {
  static async createUserApi(data: CreateUserDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(adminUserRoutes.createUser, data);
    return response.data;
  }

  static async createBulkUsersApi(data: FormData): Promise<UriResponse<UserDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto[]>>> = await UriHttpClient.getClient().post(adminUserRoutes.createBulkUsers, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async updateUserApi(data: UserDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(adminUserRoutes.updateUser, data);
    return response.data;
  }

  static async getUserByIdApi(id?: string): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().get(`${adminUserRoutes.getById}/${id}`);
    return response.data;
  }
}
