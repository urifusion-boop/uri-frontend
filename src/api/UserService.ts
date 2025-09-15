import { UriHttpClient } from '@/configs/http.config';
import { userApiRoutes } from '@/constants/routes/userApiRoutes';
import { UpdateUserDto } from '@/models/dtos/UpdateUserDto';
import { UserDto } from '@/models/dtos/UserDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { DeleteUserDto } from '../models/dtos/DeleteUserDto';

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
}
