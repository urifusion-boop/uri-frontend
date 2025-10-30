import { BrowsercloudPlatformEnum } from '../enum-models/BrowsercloudPlatformEnum';

export interface RealtimeLeadSourceDto {
  platform: BrowsercloudPlatformEnum;
  post_url: string;
  post_content: string;
  author_name: string;
  author_handle: string;
  author_url: string;
  posted_at: string;
  engagement_metrics?: EngagementMetricsDto;
  matched_keywords: string[];
  matched_signals: string[];
}

export interface EngagementMetricsDto {
  likes?: number;
  comments?: number;
  shares?: number;
  retweets?: number;
  replies?: number;
  views?: number;
  followers?: number;
}

export interface RealtimeLeadDto {
  lead_id: string;
  user_id: string;
  lead_form_id: string;
  source: RealtimeLeadSourceDto;
  ai_analysis?: AIAnalysisDto;
  follow_up_message?: string;
  follow_up_approach?: string;
  lead_status: string;
  lead_score?: number;
  created_at: string;
  processed_at?: string;
}

export interface AIAnalysisDto {
  summary: string;
  opportunity_type: string;
  lead_reason: string;
  interest_level: string;
  recommended_action: string;
}

export interface RealtimeLeadNotificationDto {
  type: 'new_lead' | 'lead_update' | 'connection_status';
  data: RealtimeLeadDto | ConnectionStatusDto;
  timestamp: string;
}

export interface ConnectionStatusDto {
  status: 'connected' | 'disconnected' | 'error';
  message?: string;
  active_forms?: number;
  monitoring_platforms?: BrowsercloudPlatformEnum[];
}

export interface PlatformConfigDto {
  platform: BrowsercloudPlatformEnum;
  enabled: boolean;
  max_results_per_search?: number;
  content_types?: string[];
  filters?: PlatformFiltersDto;
}

export interface PlatformFiltersDto {
  min_followers?: number;
  exclude_retweets?: boolean;
  verified_only?: boolean;
  language?: string;
  location?: string;
}
