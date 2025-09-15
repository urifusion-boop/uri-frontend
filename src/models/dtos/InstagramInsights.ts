export class InstagramInsightsDto {
  access_token?: string;
  metrics?: string;
  period!: string;
  since?: string;
  until?: string;
}

export class UpdateInstagramInsights {
  ig_user_id!: string;
  access_token!: string;
  metrics!: string;
  period!: string;
  since?: string;
  until?: string;
}

// export class GetInstagramInsights {
//   metrics!: string;
//   period!: string;
//   since?: string;
//   until?: string;
// }

export class SearchInstagramHashtag {
  hashtag!: string;
  fields?: string;
  since?: string;
  until?: string;
  after?: string;
}

export class BusinessDiscovery {
  username?: string;
  meta_access_token?: string;
}

export class TagsFilter {
  after?: string;
  ig_user_id?: string[];
}

export interface TagsResponse {
  posts: Post[];
  overall_sentiment: OverallSentiment;
  paging?: Paging;
}

export interface MediaResponse {
  data: Post[];
  paging?: Paging;
}

export interface Post {
  engagements_count: number;
  id: string;
  media_type: string;
  username: string;
  comments_count: number;
  like_count: number;
  permalink: string;
  caption: string;
  media_url: string;
  timestamp: string;
  sentiment: Sentiment;
}

export interface Sentiment {
  text: string;
  score: number;
  magnitude: number;
}

export interface OverallSentiment {
  total_feedback: number;
  positive_score: number;
  neutral_score: number;
  negative_score: number;
  sentiment_distribution: SentimentDistribution;
  top_positive: TopPositive;
  top_negative: any;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface TopPositive {
  id: string;
  caption: string;
  media_type: string;
  username: string;
  permalink: string;
  score: number;
  magnitude: number;
}

export interface InstagramBusinessProfile {
  id: string;
  ig_id: number;
  username: string;
  biography: string;
  website: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  media: Media;
  cache_key: string;
}
export interface InstagramKeywordTracker {
  media: BusinessProfileInsight[];
  paging: Paging;
}

export interface Media {
  data: BusinessProfileInsight[];
  paging: Paging;
}

export interface BusinessProfileInsight {
  engagements_count: number;
  comments_count: number;
  like_count: number;
  media_type: string;
  media_url?: string;
  timestamp: string;
  permalink: string;
  caption: string;
  id: string;
  comments?: Comments;
  username?: string;
  children?: { data: MediaItem[] };
}

export interface MediaItem {
  media_url: string;
  media_type: string;
  id: string;
}

export interface Comments {
  data: CommentData[];
}

export interface CommentData {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: Replies;
}

export interface Replies {
  data: RepliesData[];
}

export interface RepliesData {
  timestamp: string;
  text: string;
  id: string;
}

export interface Paging {
  cursors: Cursors;
  next: string;
}

export interface Cursors {
  before: string;
  after: string;
}

export interface SentimentData {
  text: string;
  score: number;
  magnitude: number;
  sentiment: string;
}

export interface SentimentComment extends CommentData {
  sentiment: SentimentData;
}

export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
}

export interface CommentSentimentAnalysis {
  comments_with_sentiment: SentimentComment[];
  sentiment_summary: SentimentSummary;
  top_positive_comment?: SentimentComment;
  top_negative_comment?: SentimentComment;
}

export interface DemographicInsightBreakdownResult {
  dimension_values: string[];
  value: number;
}

export interface DemographicInsightBreakdown {
  dimension_keys: string[];
  results: DemographicInsightBreakdownResult[];
}

export interface DemographicInsightTotalValue {
  breakdowns: DemographicInsightBreakdown[];
}

export interface DemographicInsights {
  name: string;
  period: string;
  title: string;
  description: string;
  total_value: DemographicInsightTotalValue;
  id: string;
}

type InsightValue = {
  value: number;
};

export type Insight = {
  name: string;
  period: string;
  values: InsightValue[];
  title: string;
  description: string;
  id: string;
};

type KeyInsight = {
  label: string;
  value: string | number;
};

type OptimizationStrategy = {
  day: string;
  content: string;
};

type ContentCalendar = {
  [week: string]: string[];
};

type PerformanceSummary = {
  performance: string;
  key_insights: {
    plays?: number;
    watch_time?: string;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
    highest_engagement_day: string;
    lowest_engagement_day: string;
    reach: number;
  };
};

export interface ImageEngagementMetrics {
  comments: number;
  highest_engagement_day: string;
  likes: number;
  lowest_engagement_day: string;
  plays: number;
  reach: number;
  shares: number;
  watch_time: string;
}

type AiReport = {
  summary: string | PerformanceSummary;
  keyInsights?: ImageEngagementMetrics;
  recommendations: {
    strategy: string;
    details: string;
  }[];
  optimizationStrategy?: {
    postSchedule: OptimizationStrategy[];
    exampleContentCalendar?: {
      [month: string]: ContentCalendar;
    };
  };
  extraMetrics?: {
    averageWatchTime?: KeyInsight;
    engagementRate?: KeyInsight;
    followerGrowth?: KeyInsight;
  };
};

export type MediaInsightResponse = {
  insights: Insight[];
  ai_report?: AiReport;
};

export interface Comments {
  data: CommentData[];
}

export interface Replies {
  data: RepliesData[];
}

export interface RepliesData {
  timestamp: string;
  text: string;
  id: string;
}

export interface GetInstagramUserInteractionMetricsDto {
  ig_user_id: string;
  metrics: string;
  metric_type: string;
  breakdown?: string;
  period?: string;
  since?: number;
  until?: number;
}

export interface InstagramUserInteractionMetrics {
  name: string;
  period: string;
  values: InteractionMetricsInsightValue[];
  title: string;
  description: string;
  id: string;
  total_value: TotalValue;
}
export type InstagramUserInteractionResponse = InstagramUserInteractionMetrics[];

export interface InteractionMetricsInsightValue {
  value: number;
  end_time: string;
}

interface BreakdownResult {
  dimension_values: string[];
  value: number;
}

interface Breakdown {
  dimension_keys: string[];
  results?: BreakdownResult[];
}

interface TotalValue {
  value: number;
  breakdowns: Breakdown[];
}
