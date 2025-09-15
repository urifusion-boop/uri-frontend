import { PaginationDto } from './PaginationDto';

export class ChatFilterDto extends PaginationDto {
  chatId?: string;
  creativeId?: string;
  clientId?: string;
  chatType?: string;
  referenceId?: string;
  userType?: string;
}