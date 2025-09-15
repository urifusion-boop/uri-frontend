export class GetMentionsByFiltersDto {
  user_id?: string;
  deleted?: boolean;
  unread?: boolean;
  read?: boolean;
  starred?: boolean;
  skip?: number;
  limit?: number;
}

export class MentionInsightsDto {
  data?: MentionDto[];
  total?: number;
  pageSize?: number;
  metaData?: {
    total_unread: number;
    total_with_deleted: number;
  };
}

export class MentionDto {
  mention_id?: string;
  user_id?: string;
  keyword?: string;
  title?: string;
  comment?: string;
  author?: string;
  image?: string;
  timestamp?: string;
  website?: string;
  is_read?: boolean;
  deleted?: boolean;
  starred?: boolean;
  created_at?: string;
  updated_at?: string;
  id?: string;
}

export interface AlertAnalyticsResponse {
  high_priority_alerts: HighPriorityAlert[];
  total_alerts: number;
  positive_alerts: number;
  negative_alerts: number;
  neutral_alerts: number;
  platform_breakdown: PlatformBreakdown;
  ai_recommendation: AiRecommendation;
  analytics_over_time: Record<
    string,
    { negative?: number; neutral?: number; positive?: number }
  >;
}

export interface HighPriorityAlert {
  _id: string;
  mention_id: string;
  user_id: string;
  keyword: string;
  title: string;
  comment: string;
  author: string;
  image: string;
  timestamp: string;
  website: string;
  platform: string;
  sentiment_priority: string;
  is_read: boolean;
  deleted: boolean;
  starred: boolean;
  created_at: string;
  updated_at: string;
  sentiment: string;
}

interface SentimentData {
  negative?: number;
  positive?: number;
  neutral?: number;
}

export interface PlatformBreakdown {
  [platform: string]: SentimentData;
}
export interface AiRecommendation {
  title: string;
  text: string;
}
