import { PostTypeDistribution } from './HashTagDto';

export class GetTrackerByFilter {
  data?: TrackerDto[];
  total?: number;
  pageSize?: number;
}

export class TrackerDto {
  tracker_id?: string;
  user_id?: string;
  name?: string;
  keywords?: string[];
  excluded?: string[];
  tracker_type?: string;
  platforms?: string[];
  locations?: string[];
  filter_duration?: string;
  is_alert_subscribed?: boolean;
}

export class TrackerFilterDto {
  user_id?: string;
  keywords?: string[];
  tracker_type?: string;
  platforms?: string[];
  locations?: string[];

  skip?: number;
  limit?: number;
}

export class KeywordTrackDto {
  includes?: string[];
  excludes?: string[];
  phrases?: string[];
  locations?: string[];
  languages?: string[];
  platforms?: string[];
  start: number = 1;
  num: number = 10;
  lr?: string;
  safe?: string;
  sort?: string;
  filter?: number;
  gl?: string;
  cr?: string;
  googlehost?: string;
  c2coff?: string;
  hq?: string;
  hl?: string;
  site_search?: string;
  site_search_filter?: string;
  exact_terms?: string;
  exclude_terms?: string;
  link_site?: string;
  or_terms?: string;
  date_restrict?: string;
  low_range?: string;
  high_range?: string;
  search_type?: string;
  file_type?: string;
  rights?: string;
  img_size?: string;
  img_type?: string;
  img_color_type?: string;
  img_dominant_color?: string;
}

export class KeywordTrackResponseDto {
  context?: {
    title: string;
  };
  queries?: Queries;
  searchInformation?: SearchInformation;
  url?: Url;
  metadata?: Metadata;
  items?: Item[];
  posts?: Post[];
  influencers?: Influencer[];
  cache_key?: string;
}

export interface SearchInformation {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
}

export interface Url {
  type: string;
  template: string;
}

export interface Metadata {
  total_engagements: TotalEngagements;
  top_influencers: TopInfluencer[];
}

export interface TotalEngagements {
  like_count: number;
  retweet_count: number;
  quote_count: number;
  reply_count: number;
}

export interface TopInfluencer {
  name: string;
  type: string;
}

export interface Item {
  content: string;
  htmlContent: string;
  link: string;
  snippet: string;
  htmlSnippet: string;
  image_url?: string;
  engagements: Engagements;
  datePublished?: string;
}

export interface Engagements {
  like_count?: number;
  retweet_count?: number;
  quote_count?: number;
  reply_count?: number;
}

export interface Post {
  platform: string;
  title: string;
  text: string;
  htmlTitle: string;
  htmlSnippet: string;
  snippet: string;
  htmlFormattedUrl: string;
  formattedUrl: string;
  displayLink: string;
  link: string;
  pagemap: Pagemap;
  timestamp?: string;
  author?: Author;
  public_metrics?: PublicMetrics;
}

export interface Pagemap {
  cse_thumbnail?: CseThumbnail[];
  videoobject?: VideoObject[];
  metatags: Metatag[];
  cse_image?: CseImage[];
  product?: Product[];
  aggregaterating?: Aggregaterating[];
  hproduct?: Hproduct[];
  listitem?: Listitem[];
  TVEpisode?: Tvepisode[];
  creativework?: Creativework[];
  person?: Person[];
  interactioncounter?: Interactioncounter[];
  collection?: Collection[];
  socialmediaposting?: Socialmediaposting[];
  imageobject?: Imageobject[];
}

export interface CseThumbnail {
  src: string;
  width: string;
  height: string;
}

export interface VideoObject {
  duration?: string;
  embedurl?: string;
  contenturl?: string;
  uploaddate?: string;
  name?: string;
  description?: string;
  caption?: string;
  thumbnailurl?: string;
  url?: string;
}

export interface CseImage {
  src: string;
}

export interface Product {
  image: string;
  name: string;
  mpn: string;
  availability: string;
  sku: string;
  brand: string;
}

export interface Aggregaterating {
  ratingvalue: string;
  reviewcount: string;
}

export interface Hproduct {
  fn: string;
  photo: string;
  currency: string;
  currency_iso4217: string;
}

export interface Listitem {
  item: string;
  name: string;
  position: string;
}

export interface Tvepisode {}

export interface Creativework {
  name?: string;
  url?: string;
  text?: string;
}

export interface Person {
  identifier: string;
  givenname: string;
  additionalname: string;
}

export interface Interactioncounter {
  userinteractioncount: string;
  interactiontype: string;
  name?: string;
  url?: string;
}

export interface Socialmediaposting {
  identifier: string;
  commentcount: string;
  articlebody: string;
  position: string;
  datecreated: string;
  datepublished: string;
  url: string;
  mainentityofpage: string;
}

export interface Imageobject {
  contenturl: string;
  width: string;
  caption: string;
  thumbnailurl: string;
}

export interface Url {
  url: string;
  expanded_url: string;
  display_url: string;
  title: string;
  description: string;
  images: any[];
}

export interface Author {
  id?: string;
  username?: string;
  name?: string;
  type?: string;
}

export interface PublicMetrics {
  retweet_count?: string;
  reply_count?: string;
  like_count?: string;
  quote_count?: string;
  impression_count: any;
}

export interface Entities {
  hashtags: any[];
  mentions: any[];
  urls: Url2[];
}

export interface Url2 {
  url: string;
  expanded_url: string;
  display_url: string;
  title: string;
  description: string;
  images: string[];
}

export interface Influencer {
  type: string;
  name: string;
}

export interface Queries {
  previousPage: PreviousPage[];
  request: Request[];
}

export interface PreviousPage {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  sort: string;
  filter: string;
  dateRestrict: string;
}

export interface Request {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  sort: string;
  filter: string;
  dateRestrict: string;
}

export class CreativeWork {
  name?: string;
  url?: string;
}

export class Collection {
  name?: string;
}

export class Video {
  duration?: string;
  embedurl?: string;
  contenturl?: string;
  uploaddate?: string;
  name?: string;
  description?: string;
  caption?: string;
  thumbnailurl?: string;
}

export class InteractionCountObject {
  interacttiontype?: string;
  userinteractioncount?: string;
  name?: string;
  url?: string;
}

export class SocialMedia {
  identifier?: string;
  commmentcount?: string;
  articlebody?: string;
  datapublished?: string;
  datecreated?: string;
  url?: string;
}
export class imagObject {
  contenturl?: string;
  width?: string;
  caption?: string;
  thumbnailurl?: string;
}

export class InteractionData {
  userinteractioncount?: string;
  interactiontype?: string;
  name?: string;
  url?: string;
}

export class PersonList {
  additionalname?: string;
  givenname?: string;
  identifier?: string;
}

export class Thumbnail {
  src?: string;
  width?: string;
  height?: string;
}

export class Metatag {
  [key: string]: string;
}

export class Image {
  src?: string;
}

export class Person {
  fn?: string;
  nickname?: string;
  url?: string;
  url_text?: string;
}

export class SentimentData {
  author?: string;
  comment?: string;
  timestamp?: string;
  image?: string | null;
  website?: string;
  sentiment?: SentimentType;
}

export class SentimentType {
  text?: string;
  score?: number;
  magnitude?: number;
  sentiment?: string;
}

export class OverallSentiment {
  positive?: number;
  negative?: number;
  neutral?: number;
}

export class PlatformDistribution {
  [key: string]: number;
}

export class KeywordTrackerSentimentsDto {
  total_results?: number;
  sentiment?: SentimentData[];
  overall_sentiment?: OverallSentiment;
  top_positive_comment?: KeywordTrackerCommentSentimentDto;
  top_negative_comment?: KeywordTrackerCommentSentimentDto;
  sentiment_over_time?: SentimentOverTimeDto[] | [];
}

export class KeywordTrackerPostTypeDto {
  post_type?: string;
  count?: number;
}

export class KeywordTrackerTopCountriesDto {
  country_code?: string;
  count?: number;
}

export class KeywordTrackerDailyFrequencyDto {
  date?: string;
  count?: number;
}
export class KeywordTrackerTopWordsDto {
  word?: string;
  count?: number;
}

export class KeywordTrackerTopPlatformsDto {
  platform?: string;
  count?: number;
}

export class KeywordTrackerCommentSentimentDto {
  comment?: string;
  sentiment?: SentimentType;
}

export type SingleSentimentData = {
  timestamp: string;
  text: string;
  id: string;
  sentiment: {
    text: string;
    score: number;
    magnitude: number;
    sentiment: string;
  };
};

export class InfluencersMetrics {
  followers_count?: number;
  following_count?: number;
  tweet_count?: number;
  listed_count?: number;
  like_count?: number;
}

export class KeywordTrackingInfluencers {
  id?: string;
  name?: string;
  username?: string;
  date_joined?: string;
  profile_image_url?: string;
  bio?: string;
  location?: string;
  country?: string;
  verified?: boolean;
  gender?: string;
  metrics?: InfluencersMetrics;
  engagement_score?: number;
}

export class KeywordTrackerInfluencersDto {
  influencers?: KeywordTrackingInfluencers[];
  total_females?: number;
  total_influencers?: number;
  total_males?: number;
  total_unverified?: number;
  total_verified?: number;
  top_5_most_engaging?: InfluencerDto[];
  top_5_least_engaging?: InfluencerDto[];
}

export class KeywordTrackerPostDto {
  posts_data?: Tweet[];
  top_mentions?: TopMentionType[];
  top_hashtags?: TopHashtagType[];
  posts_count?: number;
  users_count?: number;
  engagements_count?: number;
  impressions_count?: number;
  reach_count?: number;
  comments_count?: number;
  post_types?: {
    counts: PostTypeCounts;
    percentages: PostTypePercentages;
  };
}

export class Tweet {
  time?: string;
  text?: string;
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

export class TopMentionType {
  username?: string;
  count?: number;
}

export class TopHashtagType {
  tag?: string;
  count?: number;
}

export class PostTypeCounts {
  retweeted?: number;
  replied_to?: number;
  original?: number;
  quoted?: number;
}

export class PostTypePercentages {
  retweeted?: number;
  replied_to?: number;
  original?: number;
  quoted?: number;
}

export class InfluencerMetrics {
  followers_count?: number;
  following_count?: number;
  tweet_count?: number;
  listed_count?: number;
  like_count?: number;
  engagement_score?: number;
}

export class InfluencerDto {
  id?: string;
  name?: string;
  username?: string;
  date_joined?: string;
  profile_image_url?: string;
  bio?: string;
  location?: string;
  country?: string;
  verified?: boolean;
  gender?: string;
  metrics?: InfluencerMetrics;
  engagement_score?: number;
}

type EngagementOpportunity = {
  tone: string;
  score: number;
};

export interface AIConversationResponse {
  ai_insights: AiPostConversationInsights;
}

export interface AiPostConversationInsights {
  key_trends: string[];
  recommendations: string[];
  engagement_drivers: string[];
  engagement_opportunities: string[];
  emotional_tones: EmotionalTone[] | [];
  content_themes: ContentTheme[];
  conversation_velocity: ConversationVelocity;
  weekly_campaign_calendar: WeeklyCampaignCalendar[];
  post_type_distribution?: PostTypeDistribution[];
}

export interface EmotionalTone {
  tone: string;
  score: number;
}

export interface ContentTheme {
  theme: string;
  mentions: number;
}

export interface ConversationVelocity {
  growth_rate: number;
  peak_times: string[];
}

export interface WeeklyCampaignCalendar {
  topic: string;
  title: string;
  post: string;
  media_type: string;
  day_of_the_week: string;
  post_time: string;
  hashtags: string[];
  mentions: string[] | [];
  target_audience_countries: string[] | [];
  post_justification: string;
}

export interface SentimentOverTimeDto {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}
