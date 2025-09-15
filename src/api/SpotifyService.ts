import { UriHttpClient } from '@/configs/http.config';
import { spotifyApiRoutes } from '@/constants/routes/spotifyRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class SpotifyService {
  static async getAuthUrl(): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(spotifyApiRoutes.getAuthUrl);
    return response.data;
  }

  static async getAccessToken(code: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${spotifyApiRoutes.getAccessToken}/${code}`);
    return response.data;
  }

  static async getUserData(accessToken: string): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().get(`${spotifyApiRoutes.getUserData}/${accessToken}`);
    return response.data;
  }
}
