import { SingleSentimentData } from './TrackerDto';

export interface HashtagTrackResponse {
  media: HashtagTrackPost[];
  count: number;
  post_type_distribution: PostTypeDistribution[];
  hashtag_mention_frequency: HashtagMentionFrequency[];
}

export interface HashtagTrackPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  comments_count: number;
  like_count?: number;
  caption: string;
  children?: Children;
  sentiment?: string;
}

export interface Children {
  data: Daum[];
}

export interface Daum {
  media_url: string;
  media_type: string;
  id: string;
}

export interface AiPostReportResponse {
  related_hashtags?: string[];
  trending_hashtags?: string[];
  hashtag_mention_frequency: HashtagMentionFrequency[];
  total_mentions?: number;
}

export interface SentimentResponse {
  post_sentiments?: SentimentDto[];
  sentiment_summary?: SentimentSummary;
  top_positive_comment?: SingleSentimentData;
  top_negative_comment?: SingleSentimentData;
}

export interface SentimentDto {
  text?: string;
  score?: number;
  magnitude?: number;
  sentiment?: string;
}

export interface SentimentSummary {
  positive?: number;
  negative?: number;
  neutral?: number;
}

export interface HashtagMentionFrequency {
  hashtag: string;
  count: number;
}

export interface PostTypeDistribution {
  media_type: string;
  count: number;
}
