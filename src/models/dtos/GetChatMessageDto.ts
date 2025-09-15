import { ChatMessageDto } from "./ChatMessageDto";

export class GetChatMessageDto {
  page?: string;
  pageSize?: number;
  data?: ChatMessageDto[];
  total?: number;
}