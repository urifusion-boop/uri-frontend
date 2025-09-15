import { UriHttpClient } from '@/configs/http.config';
import { aiThreadRoutes } from '@/constants/routes/aiThreadRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import { CreateAiThreadDto, CreateAiThreadResponseDto, FetchAiThreadDto, GetAiThreadsByFiltersDto } from '@/models/dtos/AiThreadDto';
import { UriResponse } from '@/models/responses/UriResponse';

import { AxiosResponse } from 'axios';

export class AiThreadService {
  static async createThread(data: CreateAiThreadDto): Promise<UriResponse<CreateAiThreadResponseDto>> {
    const url = `${aiThreadRoutes.create}?user_id=${data.user_id}&thread_type=${data.thread_type}`;

    const response: Awaited<AxiosResponse<UriResponse<CreateAiThreadResponseDto>>> = await UriHttpClient.getClient().post(url, data.request_body);
    return response.data;
  }

  static async getThreadById(data: any): Promise<AxiosResponse<any>> {
    const response: Awaited<AxiosResponse<any>> = await UriHttpClient.getClient().post(aiThreadRoutes.getById, data);
    return response;
  }

  static async getThreadByFilters(data: FetchAiThreadDto): Promise<UriResponse<GetAiThreadsByFiltersDto>> {
    const queryString = ObjectHelper.filterMap(data);
    const url = `${aiThreadRoutes.getByFilters}?${queryString}`;
    const response: Awaited<AxiosResponse<UriResponse<GetAiThreadsByFiltersDto>>> = await UriHttpClient.getClient().get(url);

    return response.data;
  }

  static async updateThread(data: any): Promise<AxiosResponse<any>> {
    const response: Awaited<AxiosResponse<any>> = await UriHttpClient.getClient().post(aiThreadRoutes.update, data);
    return response;
  }

  static async deleteThread(thread_id: string): Promise<UriResponse<string>> {
    const url = `${aiThreadRoutes.delete}/${thread_id}`;

    const response: Awaited<AxiosResponse<Promise<UriResponse<string>>>> = await UriHttpClient.getClient().delete(url);
    return response.data;
  }
}
