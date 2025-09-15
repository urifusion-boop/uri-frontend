export interface AiMediaReportDto {
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

export interface PerformanceScore {
  title: string;
  description: string;
  score: string;
  rating: string;
}
