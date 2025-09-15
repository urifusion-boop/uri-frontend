import { UriHttpClient } from '@/configs/http.config';
import { socialMediaPostApiRoutes } from '@/constants/routes/socialMediaPostRoutes';
import { GetSocialMediaPostsByFilterDto, SocialMediaPostDto, SocialMediaPostResponse } from '@/models/dtos/SocialMediaPostDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class SocialMediaPostService {
  static async createPostApi(data: SocialMediaPostDto): Promise<UriResponse<SocialMediaPostDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SocialMediaPostDto>>> = await UriHttpClient.getClient().post(socialMediaPostApiRoutes.createPost, data);
    return response.data;
  }
  static async createMultiplePostApi(data: SocialMediaPostDto[]): Promise<UriResponse<SocialMediaPostDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<SocialMediaPostDto[]>>> = await UriHttpClient.getClient().post(socialMediaPostApiRoutes.multipleCreatePost, data);
    return response.data;
  }

  static async updatePostApi(data: SocialMediaPostDto): Promise<UriResponse<SocialMediaPostDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SocialMediaPostDto>>> = await UriHttpClient.getClient().post(socialMediaPostApiRoutes.updatePost, data);
    return response.data;
  }

  static async getPostsByFilterApi(data: GetSocialMediaPostsByFilterDto): Promise<UriResponse<SocialMediaPostResponse>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<SocialMediaPostResponse>>> = await UriHttpClient.getClient().get(`${socialMediaPostApiRoutes.getPostsByFilter}?${queryString}`);
    return response.data;
  }

  static async deletePostByPostIdApi(postId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().delete(`${socialMediaPostApiRoutes.deletePostById}?post_id=${postId}`);
    return response.data;
  }

  static async updatePostStatusApi(data: SocialMediaPostDto): Promise<UriResponse<SocialMediaPostDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SocialMediaPostDto>>> = await UriHttpClient.getClient().put(socialMediaPostApiRoutes.updatePostStatus, data);
    return response.data;
  }
}
