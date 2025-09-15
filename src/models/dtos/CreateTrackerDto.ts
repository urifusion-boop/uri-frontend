export class CreateTrackerDto {
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

export type GetAiCampaignInsight = {
  keyword: string;
  cache_key: string | undefined;
};
