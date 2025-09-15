export class CreateAiThreadDto {
  user_id!: string;
  thread_type!: string;
  request_body!: {
    messages?: ThreadMessage[];
  };
}

export interface ThreadMessage {
  role: "user" | "assistant";
  content: ThreadMessageContent[];
  attachments?: any;
}

export interface ThreadMessageContent {
  type: string;
  text: string;
}

export interface CreateAiThreadResponseDto {
  id?: string;
  object?: string;
  created_at?: number;
  metadata?: Metadata;
  tool_resources?: ToolResources;
  thread_id?: string;
}

export interface GetAiThreadsByFiltersDto {
  data: AiThreadsDto[];
  total: number;
  page: number;
  pageSize: number;
  metaData: any;
}

export interface AiThreadsDto {
  id: string;
  thread_id: string;
  created_at: string;
  metadata: any;
  tool_resources: any;
  messages: ThreadMessage[];
  thread_type: string;
}

export interface Metadata {}

export interface ToolResources {}

export class FetchAiThreadDto {
  user_id!: string;
  thread_type?: string;
  limit?: number;
  skip?: number;
}
