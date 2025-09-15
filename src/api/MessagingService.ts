import { UriHttpClient } from '@/configs/http.config';
import { chatApiRoutes } from '@/constants/routes/chatApiRoutes';
import { chatMessageApiRoutes } from '@/constants/routes/chatMessageApiRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { ChatDto } from '../models/dtos/ChatDto';
import { ChatFilterDto } from '../models/dtos/ChatFilterDto';
import { ChatMessageDto } from '../models/dtos/ChatMessageDto';
import { ChatMessageFilterDto } from '../models/dtos/ChatMessageFilterDto';
import { GetChatDto } from '../models/dtos/GetChatDto';
import { GetChatMessageDto } from '../models/dtos/GetChatMessageDto';

export class MessagingService {
  static async createChatApi(data: ChatDto): Promise<UriResponse<ChatDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ChatDto>>> = await UriHttpClient.getClient().post(chatApiRoutes.createChat, data);
    return response.data;
  }

  static async createChatMessageApi(data: ChatMessageDto): Promise<UriResponse<ChatMessageDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ChatMessageDto>>> = await UriHttpClient.getClient().post(chatMessageApiRoutes.createChatMessage, data);
    return response.data;
  }

  static async getChatById(chatId?: string): Promise<UriResponse<ChatDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ChatDto>>> = await UriHttpClient.getClient().get(`${chatApiRoutes.getByChatId}/${chatId}`);
    return response.data;
  }

  static async getChatsByFilterApi(data: ChatFilterDto): Promise<UriResponse<GetChatDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetChatDto>>> = await UriHttpClient.getClient().get(`${chatApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async getTotalUnreadChatCount(userId?: string): Promise<UriResponse<Number>> {
    const response: Awaited<AxiosResponse<UriResponse<Number>>> = await UriHttpClient.getClient().get(`${chatApiRoutes.getTotalUnreadChatCount}/${userId}`);
    return response.data;
  }

  static async getChatMessagesByFilterApi(data: ChatMessageFilterDto): Promise<UriResponse<GetChatMessageDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<GetChatMessageDto>>> = await UriHttpClient.getClient().get(`${chatMessageApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async updateChatApi(data: ChatDto): Promise<UriResponse<ChatDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ChatDto>>> = await UriHttpClient.getClient().post(chatApiRoutes.updateChat, data);
    return response.data;
  }
}
