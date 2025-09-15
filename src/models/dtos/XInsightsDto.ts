export class SearchAllTweetDto {
  start_time?: string;
  end_time?: string;
  expansions?: string;
  tweet_fields?: string;
  user_fields?: string;
  media_fields?: string;
  place_fields?: string;
  poll_fields?: string;
  max_results?: number;
  pagination_token?: string;
  query!: string;
  since_id?: string;
  until_id?: string;
  includes?: string[];
  exclude?: string[];
  locations?: string[];
  hashtags?: string[];
  min_retweets?: number;
  min_replies?: number;
  min_likes?: number;
  languages?: string[];
  from_user?: string;
  to_user?: string;
  is_reply?: string;
  is_retweet?: string;
  sort?: string;
  "x-access-token"?: string;
}

export interface TwitterTrackResponseDto {
  data: Tweet[];
  includes: Includes;
  meta: Meta;
  cache_key?: string;
  twitter_cache_key?: string;
}

export interface Tweet {
  text?: string;
  public_metrics?: PublicMetrics;
  entities?: Entities;
  edit_history_tweet_ids?: string[];
  referenced_tweets?: ReferencedTweet[];
  id?: string;
  conversation_id?: string;
  edit_controls?: EditControls;
  lang?: string;
  reply_settings?: string;
  created_at?: string;
  author_id?: string;
  context_annotations?: ContextAnnotation[];
  in_reply_to_user_id?: string;
  attachments?: Attachments;
  time?: string;
  retweets?: number;
  replies?: number;
  likes?: number;
  quotes?: number;
  impressions?: number;
  hashtags?: string[];
  mentions?: string[];
  media_urls?: string[];
  username?: string;
  profile_image_url?: string;
  followers_count?: number;
}

export interface PublicMetrics {
  retweet_count?: number;
  reply_count?: number;
  like_count?: number;
  quote_count?: number;
  bookmark_count?: number;
  impression_count?: number;
}

export interface Entities {
  mentions?: Mention[];
  annotations?: Annotation[];
}

export interface Annotation {
  start: number;
  end: number;
  probability: number;
  type: string;
  normalized_text: string;
}

export interface ReferencedTweet {
  type?: string;
  id?: string;
}

export interface EditControls {
  edits_remaining?: number;
  is_edit_eligible?: boolean;
  editable_until?: string;
}

export interface ContextAnnotation {
  domain?: Entity;
  entity?: Entity;
}

export interface User {
  created_at: string;
  location?: string;
  public_metrics: UserMetrics;
  description: string;
  name: string;
  username: string;
  profile_image_url: string;
  id: string;
  verified: boolean;
  entities?: Entities2;
  pinned_tweet_id?: string;
  url?: string;
}

export interface Entities2 {
  url?: Url;
  description?: Description;
}

export interface Url {
  urls: Url2[];
}

export interface Url2 {
  start: number;
  end: number;
  url: string;
  expanded_url: string;
  display_url: string;
}

export interface Description {
  urls?: Url2[];
  hashtags: Hashtag[];
}

export interface Hashtag {
  start: number;
  end: number;
  tag: string;
}

export interface Meta {
  newest_id: string;
  oldest_id: string;
  result_count: number;
  next_token: string;
}

export interface TwitterTrackTopLocationDto {
  top_locations: TopMetrics[];
  top_countries: TopMetrics[];
}

export interface TopMetrics {
  location?: string;
  tweet_count: number;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  impression_count: number;
  location_frequency: number;
  country?: string;
}

export interface TwitterSentimentsDto {
  total_results: number;
  sentiment: Sentiment[];
  overall_sentiment: OverallSentiment;
  top_positive_comment: TopPositiveComment;
  top_negative_comment: TopNegativeComment;
}

export interface Sentiment {
  retweets: number;
  replies: number;
  likes: number;
  quotes: number;
  impressions: number;
  hashtags: string[];
  mentions: string[];
  media_urls: any[];
  followers_count: number;
  sentiment: Sentiment3;
  author: string;
  comment: string;
  timestamp: string;
  image: string;
  website: string;
}

export interface OverallSentiment {
  positive: number;
  negative: number;
  neutral: number;
}

export interface TopPositiveComment {
  comment: string;
  sentiment: Sentiment3;
}

export interface Sentiment3 {
  text: string;
  score: number;
  magnitude: number;
  sentiment: string;
}

export interface TopNegativeComment {
  comment: string;
  sentiment: Sentiment3;
}

// business discovery

export interface XBusinessDiscovery {
  most_recent_tweet_id: string;
  verified: boolean;
  created_at: string;
  verified_type: string;
  description: string;
  protected: boolean;
  entities: {
    url: Url;
  };
  url: string;
  public_metrics: UserMetrics;
  id: string;
  profile_image_url: string;
  location: string;
  name: string;
  username: string;
  tweets: Tweets;
  twitter_user_cache_key: string;
}

export interface UserMetrics {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  like_count: number;
  media_count: number;
}

export interface Tweets {
  data: Tweet[];
  includes: Includes;
  meta: Meta;
}

export interface Entities2 {
  mentions?: Mention[];
  hashtags?: Hashtag[];
  urls?: Url2[];
  annotations?: Annotation[];
}

export interface Mention {
  start: number;
  end: number;
  username: string;
  id?: string;
}

export interface Annotation {
  start: number;
  end: number;
  probability: number;
  type: string;
  normalized_text: string;
}

export interface Attachments {
  media_keys?: string[];
  media_source_tweet_id?: string[];
}

export interface Entity {
  id?: string;
  name?: string;
  description?: string;
}

export interface Includes {
  users?: User[];
}

export interface Entities3 {
  description?: Description;
  url?: Url;
}

export interface Description {
  mentions: Mention[];
  hashtags: Hashtag[];
}
