import { Metadata } from "./AiThreadDto";

export interface GetMessageByThreadIdResponseDto {
  object: string;
  data: AiMessageDto[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

export interface AiMessageDto {
  id: string;
  object: string;
  created_at: number;
  assistant_id: any;
  thread_id: string;
  thread_type: string;
  run_id: any;
  role: "user" | "assistant";
  content: Content[];
  attachments: any[];
  metadata: Metadata;
}

export interface Text {
  value: string;
  annotations: any[];
}

export interface FetchMessagesByThreadIdDto {
  thread_id: string;
  limit: number;
  order: string;
}

export interface Content {
  type: string;
  text: Text;
}

export interface Text {
  value: string;
  annotations: any[];
}
