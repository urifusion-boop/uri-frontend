import { UriHttpClient } from '@/configs/http.config';
import { aiMessageRoutes } from '@/constants/routes/aiMessageRoutes';
import { AiMessageDto, FetchMessagesByThreadIdDto, GetMessageByThreadIdResponseDto } from '@/models/dtos/AiMessageDto';
import { ThreadMessage } from '@/models/dtos/AiThreadDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class AiMessageService {
  static async createMessage(thread_id: string, data: ThreadMessage): Promise<UriResponse<AiMessageDto>> {
    const url = `${aiMessageRoutes.create}/${thread_id}`;

    const response: Awaited<AxiosResponse<UriResponse<AiMessageDto>>> = await UriHttpClient.getClient().post(url, data);
    return response.data;
  }

  static async getMessageByThreadId(data: FetchMessagesByThreadIdDto): Promise<GetMessageByThreadIdResponseDto> {
    const url = `${aiMessageRoutes.getByThreadId}/${data.thread_id}?limit=${data.limit}&order=${data.order}`;

    const response: Awaited<AxiosResponse<GetMessageByThreadIdResponseDto>> = await UriHttpClient.getClient().get(url);

    return response.data;
  }

  static async deleteAllMessages(thread_id: string): Promise<UriResponse<string>> {
    const url = `${aiMessageRoutes.deleteAll}/${thread_id}`;

    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().delete(url);
    return response.data;
  }
}
