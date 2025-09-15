import { UriHttpClient } from '@/configs/http.config';
import { notificationSettingsRoutes } from '@/constants/routes/notificationSettingsRoute';
import { NotificationSettingDto } from '@/models/dtos/NotificationSettingDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class NotificationSettingsService {
  static async getNotificationsByUserIdApi(userId?: string): Promise<UriResponse<NotificationSettingDto>> {
    const response: Awaited<AxiosResponse<UriResponse<NotificationSettingDto>>> = await UriHttpClient.getClient().get(`${notificationSettingsRoutes.getByUserId}/${userId}`);
    return response.data;
  }

  static async updateNotificationSettingsApi(data: NotificationSettingDto): Promise<UriResponse<NotificationSettingDto>> {
    const response: Awaited<AxiosResponse<UriResponse<NotificationSettingDto>>> = await UriHttpClient.getClient().post(notificationSettingsRoutes.update, data);
    return response.data;
  }
}
