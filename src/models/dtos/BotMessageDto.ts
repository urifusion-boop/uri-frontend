export class SendMessageDto {
  userId!: string;
  message!: string;
}

export class ChatBotMessageDto {
  role!: string;
  content!: string;
}

export class UserMessageDto {
  messages!: ChatBotMessageDto[];
}

// models/dtos/BotResponseDto.ts
export class BotResponseDto {
  id?: string;
  object?: string;
  choices?: Choice[];
}

export interface Choice {
  message: Message;
}

export interface Message {
  role: string; // 'assistant'
  content: string; // the actual bot response message
}
