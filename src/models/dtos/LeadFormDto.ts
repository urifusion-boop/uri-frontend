import { ContactEmailStatusEnum } from '../enum-models/ContactEmailStatusEnum';
import { LocationEnum } from '../enum-models/LocationEnum';
import { PersonSenioritiesEnum } from '../enum-models/PersonSenioritiesEnum';

export interface LeadFormDto {
  lead_form_id: string;
  form_type: string;
  form_title: string;
  user_id: string;
  organization_locations: string[];
  organization_ids: any;
  organization_num_employees_ranges: any;
  person_titles: string[];
  include_similar_titles: boolean;
  person_locations: string[];
  person_seniorities: string[];
  q_organization_domains_list: string[];
  contact_email_status: string[];
  q_keywords: string;
  organization_not_locations: any;
  revenue_range_min: any;
  revenue_range_max: any;
  technology_uids: any;
  q_organization_keyword_tags: any;
  q_organization_name: any;
  business_name: string;
  business_summary: string;
  business_website: string;
  keywords: string[];
  competitors: string[];
  page: number;
  per_page: number;
  settings: Settings;
  disabled: boolean;
  disabled_reason: any;
  ai_response_guide: string;
  next_generation_date: string;
  add_to_history: boolean;
  auto_generate: boolean;
  source_platforms: string[];
  intent_type: string;
  buying_signals: string[];
  excluded_keywords: string[];
  created_date: string;
  last_updated: string;
  total_leads: number;
  total_new_leads: number;
  lead_id: string;
  username: string;
  first_name: any;
  // Google Maps fields
  maps_search_mode?: string;
  maps_search_query?: string;
  maps_location?: string;
  maps_latitude?: number;
  maps_longitude?: number;
  maps_radius_km?: number;
  maps_business_types?: string[];
  maps_min_rating?: number;
  maps_exclude_closed?: boolean;
  maps_max_results?: number;
  last_name: any;
  phone: any;
  company_name: any;
  job_title: any;
  industry: string;
  location?: string;
  lead_email: any;
  lead_source: string;
  lead_status: string;
  interest_level: string;
  assigned_to: string;
  notes: any;
  tags: string[];
  score: any;
  social_profile: any;
  social_profile_link: string;
  picture_url: any;
  company_logo: any;
  blog_url: any;
  angellist_url: any;
  crunchbase_url: any;
  languages: any[];
  founded_year: any;
  primary_domain: any;
  organization_revenue: any;
  organization_revenue_printed: any;
  organization_headcount_six_month_growth: any;
  organization_headcount_twelve_month_growth: any;
  organization_headcount_twenty_four_month_growth: any;
  linkedin_url: any;
  facebook_url: any;
  twitter_url: any;
  github_url: any;
  website_url: any;
  communication_history: any[];
  campaign_id: any;
  mention: string;
  summary_of_mention: string;
  opportunity_type: string;
  lead_reason: string;
  lead_link: string;
  follow_up_message: string;
  follow_up_approach: string;
  starred: boolean;
  lead_type: string;
  emailed: boolean;
  called: boolean;
  lead_files: any[];
  lead_form_snapshot_id: any;
  apollo_id: any;
  is_pre_stored: boolean;
  id: string;
  lead_generation_goal?: string; // AI Next Steps - User's business goal
  monitoring_interval_hours?: number; // How often to check for new leads (0 = one-time, >0 = recurring)
}
export class IndividualLeadFormDto {
  user_id?: string;
  form_title?: string;
  contact_email_status?: ContactEmailStatusEnum[] | string[];
  include_similar_titles?: boolean;
  organization_locations?: LocationEnum[] | string[];
  person_locations?: LocationEnum[] | string[];
  person_seniorities?: PersonSenioritiesEnum[] | string[];
  person_titles?: string[];
  q_keywords?: string;
  q_organization_domains_list?: string[];
  add_to_history?: boolean;
  auto_generate?: boolean;
  per_page?: number;
  lead_generation_goal?: string; // AI Next Steps - User's business goal
  monitoring_interval_hours?: number; // How often to check for new leads (0 = one-time, >0 = recurring)
}

export class OrganizationLeadFormDto {
  user_id?: string;
  form_title?: string;
  technology_uids?: string[];
  organization_locations?: LocationEnum[] | string[];
  organization_not_locations?: LocationEnum[] | string[];
  organization_num_employees_ranges?: string[];
  q_organization_keyword_tags?: string[];
  q_organization_name?: string;
  revenue_range_max?: number;
  revenue_range_min?: number;
  add_to_history?: boolean;
  auto_generate?: boolean;
  per_page?: number;
  lead_generation_goal?: string; // AI Next Steps - User's business goal
  monitoring_interval_hours?: number; // How often to check for new leads (0 = one-time, >0 = recurring)

  // Location Intelligence fields
  enable_location_intelligence?: boolean;
  location_zone_center_lat?: number;
  location_zone_center_lng?: number;
  location_zone_radius_km?: number;
  location_zone_name?: string;
  min_trust_score?: number;
}

export interface LeadFormResponseDto {
  data: LeadFormDto[];
  total: number;
  page: number;
  per_page: number;
}

export interface LeadFormUpdateDto {
  form_title: string;
  organization_locations: string[];
  organization_ids: string[];
  organization_num_employees_ranges: string[];
  person_titles: string[];
  include_similar_titles: boolean;
  person_locations: string[];
  person_seniorities: string[];
  organization_domains: string[];
  contact_email_status: string[];
  person_keywords: string;
  organization_not_locations: string[];
  revenue_range_min: number;
  revenue_range_max: number;
  technology_uids: string[];
  organization_keyword_tags: string[];
  organization_name: string;
  page: number;
  per_page: number;
}

export interface LeadFormGetByFiltersDto {
  lead_form_id?: string;
  user_id?: string;
  form_type?: string;
  form_title?: string;
  lead_type?: string;
  page?: number;
  page_size?: number;
}

export interface AutoPopulateDto {
  user_id: string;
  lead_form_type: string;
  data: string;
}

export interface BusinessSearchFormDto {
  user_id: string;
  form_title: string;
  business_name: string;
  business_summary: string;
  business_website: string;
  ai_response_guide: string;
  keywords: string[];
  competitors: string[];
  lead_generation_goal?: string; // AI Next Steps - User's business goal
}
export interface ScoringThresholdsDto {
  intent_score_min: number;
  relevance_score_min: number;
  final_score_min: number;
}

export interface ConversationalSearchFormDto {
  keywords: string[];
  competitors: string[];
  ai_response_guide: string;
  intent_type: string;
  buying_signals: string[];
  excluded_keywords: string[];
  form_title: string;
  user_id: string;
  add_to_history: boolean;
  auto_generate: boolean;
  form_type: string;
  location?: string[]; // Geographic location filtering
  post_age_filter?: string; // Time range filter: "24h", "7d", "30d", "3m", "6m", "1y", "all"
  // V2 fields for real-time monitoring
  enable_realtime?: boolean;
  monitoring_platforms?: string[];
  platform_configs?: PlatformConfigFormDto[];
  monitoring_interval_hours?: number; // How often to check for new leads (1, 3, 6, 12, 24 hours)
  // CLG Upgrade fields - Intent Analysis
  category_context?: string; // Industry/category context (e.g., "skincare", "fintech")
  implied_keywords?: string[]; // Indirect signals (e.g., "harmattan", "dry skin", "winter")
  scoring_thresholds?: ScoringThresholdsDto; // Custom qualification thresholds
  // Job Boards fields (PRD Section 5)
  solution_context?: string; // What problem does your product/service solve? (for job board analysis)
  job_keywords?: string[]; // AI-generated job role keywords for job board scanning
  // AI Next Steps
  lead_generation_goal?: string; // User's business goal/reason for generating leads
}

export interface PlatformConfigFormDto {
  platform: string;
  enabled: boolean;
  min_followers?: number;
  exclude_retweets?: boolean;
  verified_only?: boolean;
  content_types?: string[];
}

export class GoogleMapsLeadFormDto {
  user_id?: string;
  form_title?: string;
  maps_search_mode?: string; // "auto", "text", "nearby"
  maps_search_query?: string; // Natural language query for Text Search
  maps_location?: string; // Location name for Text Search
  maps_latitude?: number; // Latitude for Nearby Search
  maps_longitude?: number; // Longitude for Nearby Search
  maps_radius_km?: number; // Search radius in kilometers
  maps_business_types?: string[]; // Filter by business types
  maps_min_rating?: number; // Minimum Google rating (0-5)
  maps_exclude_closed?: boolean; // Exclude closed businesses
  maps_max_results?: number; // Maximum results to return
  add_to_history?: boolean;
  lead_generation_goal?: string; // AI Next Steps - User's business goal
  monitoring_interval_hours?: number; // How often to check for new businesses (0 = one-time, >0 = recurring)
}

export interface Settings {
  max_search_iteration_count: number;
  last_scraped_date: any;
  last_scraped_status: any;
}
