export interface OrganizationDetailsDto {
  vanityName: string;
  localizedName: string;
  website: Website;
  foundedOn: FoundedOn;
  groups: any[];
  description: Description;
  versionTag: string;
  defaultLocale: DefaultLocale;
  organizationType: string;
  alternativeNames: any[];
  specialties: Specialty[];
  staffCountRange: string;
  localizedSpecialties: string[];
  industries: string[];
  name: Name;
  primaryOrganizationType: string;
  locations: Location[];
  id: number;
  localizedDescription: string;
  $URN: string;
  localizedWebsite: string;
  logoV2: LogoV2;
}

export interface Website {
  localized: Localized;
  preferredLocale: PreferredLocale;
}

export interface Localized {
  en_US: string;
}

export interface PreferredLocale {
  country: string;
  language: string;
}

export interface FoundedOn {
  year: number;
}

export interface Description {
  localized: Localized2;
  preferredLocale: PreferredLocale2;
}

export interface Localized2 {
  en_US: string;
}

export interface PreferredLocale2 {
  country: string;
  language: string;
}

export interface DefaultLocale {
  country: string;
  language: string;
}

export interface Specialty {
  locale: Locale;
  tags: string[];
}

export interface Locale {
  country: string;
  language: string;
}

export interface Name {
  localized: Localized3;
  preferredLocale: PreferredLocale3;
}

export interface Localized3 {
  en_US: string;
}

export interface PreferredLocale3 {
  country: string;
  language: string;
}

export interface Location {
  locationType: string;
  description: Description2;
  address: Address;
  localizedDescription: string;
  geoLocation: string;
  streetAddressFieldState: string;
}

export interface Description2 {
  localized: Localized4;
  preferredLocale: PreferredLocale4;
}

export interface Localized4 {
  en_US: string;
}

export interface PreferredLocale4 {
  country: string;
  language: string;
}

export interface Address {
  geographicArea: string;
  country: string;
  city: string;
}

export interface LogoV2 {
  cropped: string;
  original: string;
  cropInfo: CropInfo;
}

export interface CropInfo {
  x: number;
  width: number;
  y: number;
  height: number;
}

export interface GetLinkedinPostsDto {
  organization_id: string;
  start: number;
  count: number;
  sort_by: string;
}

export interface LinkedinPostsDto {
  lifecycleState: string;
  specificContent: SpecificContent;
  visibility: Visibility;
  created: Created;
  author: string;
  versionTag: string;
  id: string;
  firstPublishedAt: number;
  lastModified: LastModified;
  distribution: Distribution;
  contentCertificationRecord: string;
}

export interface SpecificContent {
  "com.linkedin.ugc.ShareContent": ComLinkedinUgcShareContent;
}

export interface ComLinkedinUgcShareContent {
  shareCommentary: ShareCommentary;
  media: Medum[];
  shareFeatures: ShareFeatures;
  shareMediaCategory: string;
}

export interface ShareCommentary {
  inferredLocale: string;
  attributes: Attribute[];
  text: string;
}

export interface Attribute {
  length: number;
  start: number;
  value: Value;
}

export interface Value {
  "com.linkedin.common.HyperlinkAttributedEntity"?: ComLinkedinCommonHyperlinkAttributedEntity;
  "com.linkedin.common.HashtagAttributedEntity"?: ComLinkedinCommonHashtagAttributedEntity;
}

export interface ComLinkedinCommonHyperlinkAttributedEntity {
  url: string;
}

export interface ComLinkedinCommonHashtagAttributedEntity {
  hashtag: string;
}

export interface Medum {
  description?: Description;
  originalUrl?: string;
  media: string;
  thumbnails: Thumbnail[];
  status: string;
  recipes?: any[];
  nativeMediaSource?: string;
}

export interface Description {
  attributes: any[];
  text: string;
}

export interface Thumbnail {
  width: number;
  url: string;
  height: number;
}

export interface ShareFeatures {
  hashtags: string[];
}

export interface Visibility {
  "com.linkedin.ugc.MemberNetworkVisibility": string;
}

export interface Created {
  actor: string;
  time: number;
}

export interface LastModified {
  actor: string;
  time: number;
}

export interface Distribution {
  externalDistributionChannels: any[];
  distributedViaFollowFeed: boolean;
  feedDistribution: string;
}

export interface LinkedinBusinessDiscoveryDto {
  vanityName: string;
  localizedName: string;
  id: number;
  localizedDescription: string;
  localizedWebsite: string;
  logo: string;
  follower_count: FollowerCount;
  posts: Post[];
  linkedin_user_cache_key: string;
}

export interface FollowerCount {
  firstDegreeSize: number;
}

export interface Post {
  lifecycleState: string;
  specificContent: SpecificContent;
  visibility: Visibility;
  created: Created;
  author: string;
  versionTag: string;
  id: string;
  firstPublishedAt: number;
  lastModified: LastModified;
  distribution: Distribution;
  contentCertificationRecord: string;
}

export interface SpecificContent {
  "com.linkedin.ugc.ShareContent": ComLinkedinUgcShareContent;
}

export interface ComLinkedinUgcShareContent {
  shareCommentary: ShareCommentary;
  media: Medum[];
  shareFeatures: ShareFeatures;
  shareMediaCategory: string;
}

export interface ShareCommentary {
  inferredLocale: string;
  attributes: Attribute[];
  text: string;
}

export interface Attribute {
  length: number;
  start: number;
  value: Value;
}

export interface Value {
  "com.linkedin.common.HyperlinkAttributedEntity"?: ComLinkedinCommonHyperlinkAttributedEntity;
  "com.linkedin.common.HashtagAttributedEntity"?: ComLinkedinCommonHashtagAttributedEntity;
}

export interface ComLinkedinCommonHyperlinkAttributedEntity {
  url: string;
}

export interface ComLinkedinCommonHashtagAttributedEntity {
  hashtag: string;
}

export interface Medum {
  description?: Description;
  originalUrl?: string;
  media: string;
  thumbnails: Thumbnail[];
  status: string;
  recipes?: any[];
  nativeMediaSource?: string;
}

export interface Description {
  attributes: any[];
  text: string;
}

export interface Thumbnail {
  width: number;
  url: string;
  height: number;
}

export interface ShareFeatures {
  hashtags: string[];
}

export interface Visibility {
  "com.linkedin.ugc.MemberNetworkVisibility": string;
}

export interface Created {
  actor: string;
  time: number;
}

export interface LastModified {
  actor: string;
  time: number;
}

export interface Distribution {
  externalDistributionChannels: any[];
  distributedViaFollowFeed: boolean;
  feedDistribution: string;
}

export interface LinkedinAiMediaReportDto {
  industry_classification: IndustryClassification;
  improvement_suggestions: ImprovementSuggestion[];
  performance_score_breakdown: PerformanceScoreBreakdown;
  activity_breakdown: ActivityBreakdown;
  content_themes: ContentTheme[];
  key_trends: string[];
  engagement_drivers: string[];
  engagement_opportunities: string[];
  conversation_velocity: ConversationVelocity;
  weekly_campaign_calendar: WeeklyCampaignCalendar[];
  hashtag_mention_frequency: HashtagMentionFrequency[];
  summary_and_achievements: SummaryAndAchievements;
}

export interface IndustryClassification {
  industry_name: string;
  overview: string;
}

export interface ImprovementSuggestion {
  title: string;
  description: string;
  priority_score: string;
}

export interface PerformanceScoreBreakdown {
  performance_scores: PerformanceScore[];
  average_performance_score: string;
}

export interface PerformanceScore {
  title: string;
  description: string;
  score: string;
  rating: string;
}

export interface ActivityBreakdown {
  avg_likes: number;
  avg_comments: number;
  top_performing_media_type: string;
  peak_posting_time: string;
  engagement_trend: string;
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
  post_justification: string;
}

export interface HashtagMentionFrequency {
  hashtag: string;
  count: number;
}

export interface SummaryAndAchievements {
  summary: string;
  achievements: string[];
}

export interface StatisticsTimeResponseDto {
  paging: Paging;
  elements: Element[];
}

export interface StatisticsResponseDto {
  paging: Paging;
  elements: Element[];
}

export interface Paging {
  start: number;
  count: number;
  links: any[];
  total: number;
}

export interface Element {
  totalShareStatistics: TotalShareStatistics;
  organizationalEntity: string;
  share?: string;
  ugcPost?: string;
}

export interface TotalShareStatistics {
  uniqueImpressionsCount?: number;
  shareCount?: number;
  shareMentionsCount?: number;
  engagement?: number;
  clickCount?: number;
  likeCount?: number;
  impressionCount?: number;
  commentMentionsCount?: number;
  commentCount?: number;
}

export interface LinkedInPostCommentDto {
  actor: string;
  created: Created;
  lastModified: LastModified;
  id: string;
  $URN: string;
  message: Message;
  object: string;
}

export interface Created {
  actor: string;
  time: number;
}

export interface LastModified {
  actor: string;
  time: number;
}

export interface Message {
  attributes: any[];
  text: string;
}

export interface LinkedinFollowersStatisticsParameterDto {
  organization_id: string;
  date_range: string;
  time_granularity: string;
}

export interface LinkedinFollowersStatisticsResponserDto {
  paging: Paging;
  elements: Element[];
}

export interface Paging {
  start: number;
  count: number;
  links: any[];
}

export interface Element {
  followerGains: FollowerGains;
  organizationalEntity: string;
  timeRange: TimeRange;
}

export interface FollowerGains {
  organicFollowerGain: number;
  paidFollowerGain: number;
}

export interface TimeRange {
  start: number;
  end: number;
}
