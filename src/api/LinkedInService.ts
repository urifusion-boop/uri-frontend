import { UriHttpClient } from '@/configs/http.config';
import { linkedinApiRoutes } from '@/constants/routes/linkedinRoutes';
import { AxiosResponse } from 'axios';
import { LinkedinFetchResponseDto } from '@/models/dtos/LinkedinDto';

export class LinkedinService {
  static async fetchPosts(keyword: string, maxPosts: number = 10): Promise<LinkedinFetchResponseDto> {
    const response: Awaited<AxiosResponse<LinkedinFetchResponseDto>> = await UriHttpClient.getClient().get(
      `${linkedinApiRoutes.fetchPosts}?keyword=${encodeURIComponent(keyword)}&max_posts=${maxPosts}`
    );
    return response.data;
  }
}
