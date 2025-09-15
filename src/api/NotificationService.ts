import { UriHttpClient } from '@/configs/http.config';
import { notificationRoutes } from '@/constants/routes/notificationRoutes';
import { CreateNotificationDto } from '@/models/dtos/CreateNotificationDto';
import { GetUserNotificationsByFilters, UserNotification } from '@/models/dtos/UserNotification';
import { UserNotificationDto } from '@/models/dtos/UserNotificationDto';
import { UserNotificationFilterDto } from '@/models/dtos/UserNotificationFilterDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class NotificationService {
  static async createNotificationApi(data: CreateNotificationDto): Promise<UriResponse<UserNotification>> {
    const response: Awaited<AxiosResponse<UriResponse<UserNotification>>> = await UriHttpClient.getClient().post(notificationRoutes.create, data);
    return response.data;
  }

  static async marknotificationAsReadApi(notificationId: string): Promise<UriResponse<object>> {
    const response: Awaited<AxiosResponse<UriResponse<object>>> = await UriHttpClient.getClient().post(`${notificationRoutes.read}/${notificationId}`);
    return response.data;
  }

  static async markAllNotificationsAsReadApi(userId: string): Promise<UriResponse<object>> {
    const response: Awaited<AxiosResponse<UriResponse<object>>> = await UriHttpClient.getClient().post(`${notificationRoutes.readAll}/${userId}`);
    return response.data;
  }

  static async getNotificationsByUserIdApi(userId?: string): Promise<UriResponse<UserNotification[]>> {
    const response: Awaited<AxiosResponse<UriResponse<UserNotification[]>>> = await UriHttpClient.getClient().get(`${notificationRoutes.getByUserId}/${userId}`);
    return response.data;
  }

  static async getNotificationByIdApi(id?: string): Promise<UriResponse<UserNotificationDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserNotificationDto>>> = await UriHttpClient.getClient().get(`${notificationRoutes.getById}/${id}`);
    return response.data;
  }

  static async getNotificationssByFilterApi(data: UserNotificationFilterDto): Promise<UriResponse<GetUserNotificationsByFilters>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetUserNotificationsByFilters>>> = await UriHttpClient.getClient().get(`${notificationRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async subscribeToPush(data: string): Promise<UriResponse<null>> {
    const response: Awaited<AxiosResponse<UriResponse<null>>> = await UriHttpClient.getClient().post(notificationRoutes.subscribeToPush, {
      data,
    });
    return response.data;
  }
}
