import { ChatDto } from "./ChatDto";

export class GetChatDto {
  page?: string;
  pageSize?: number;
  data?: ChatDto[];
  total?: number;
}