import { UriHttpClient } from '@/configs/http.config';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { chatBotApiRoutes } from '../constants/routes/chatBotApiRoutes';
import { RouteHelper } from '../helpers/RouteHelper';
import { BotResponseDto, SendMessageDto, UserMessageDto } from '../models/dtos/BotMessageDto';

export class ChatBotService {
  static async sendMessageToChatBot(data: SendMessageDto): Promise<any> {
    return UriHttpClient.getClient().post(chatBotApiRoutes.sendMessage, data);
  }

  static async botAgentChat(userId: string, data: UserMessageDto): Promise<BotResponseDto> {
    const path = `${chatBotApiRoutes.botChat}?user_id=${userId}`;
    const response: Awaited<AxiosResponse<BotResponseDto>> = await UriHttpClient.getClient().post(path, data);
    return response.data;
  }

  static async clearChatBotMessages(userId?: string): Promise<UriResponse<any>> {
    const path = RouteHelper.buildRoute(chatBotApiRoutes.clearBotChat, userId);
    const response = await UriHttpClient.getClient().delete<any>(path);
    return response.data;
  }
}
