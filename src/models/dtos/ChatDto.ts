import { ClientProfileDto } from "./ClientProfileDto";
import { CreativeProfileDto } from "./CreativeProfileDto";
import { UserDto } from "./UserDto";

export class ChatDto {
  chatId?: string;
  clientId?: string;
  creativeId?: string;
  referenceId?: string;
  chatType?: string;
  chatStatus?: string;
  latestMessage?: string;
  lastUpdatedDate?: string;

  user?: Partial<UserDto>;
  profile?: Partial<CreativeProfileDto & ClientProfileDto>;
}
