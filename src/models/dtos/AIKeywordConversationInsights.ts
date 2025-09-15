export interface WeeklyCampaignCalendar {
  topic: string;
  title: string;
  post: string;
  media_type: string;
  day_of_the_week: string;
  post_time: string;
  hashtags: string[];
  mentions?: string[];
  target_audience_countries?: string[];
  post_justificatio: string;
}
