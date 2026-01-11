import { FileTypeEnum } from '../enum-models/FileTypeEnum';

export interface GetByFiltersLeadsDto {
  data: LeadDto[];
  total: number;
  pageSize: number;
  metaData: any;
  page: number;
}

export interface LeadDto {
  id?: string;
  lead_id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  lead_email?: any;
  phone?: any;
  company_name?: string;
  job_title?: string;
  keywords?: any;
  industry?: string;
  location?: string;
  lead_source?: string;
  lead_status?: string;
  interest_level?: string;
  assigned_to?: string;
  notes?: string;
  tags?: string[];
  score?: number;
  social_profile?: string;
  social_profile_link?: string;
  communication_history?: any;
  campaign_id?: any;
  mention?: string;
  summary_of_mention?: string;
  opportunity_type?: string;
  lead_reason?: string;
  follow_up_message?: string;
  follow_up_approach?: string;
  created_date?: string;
  last_updated?: string;
  lead_link?: string;
  starred?: boolean;
  linkedin_url?: string;
  facebook_url?: any;
  twitter_url?: any;
  github_url?: any;
  website_url: string;
  lead_type: string;
  picture_url?: string;
  company_logo?: string;
  organization_revenue?: string;
  organization_revenue_printed?: string;
  organization_revenue_range?: string;
  founded_year?: string;
  company_size?: string;
  company_size_printed?: string;
  company_size_range_printed?: string;
  company_size_range?: string;
  sentiment?: string;
  confidence?: number;
  commercial_relevance?: number;
  problem_solution_match?: number;
  company_confidence?: number;
  implied_problems?: string[];
  job_posting_url?: string;
  job_title_field?: string;
  hiring_company?: string;
  hiring_intent_score?: number;
  job_source?: string;
  lead_form_snapshot_id?: string;
  form_title?: string;
  ai_next_steps?: {
    steps: Array<{
      step_id: string;
      action: string;
      reasoning: string;
      priority: 'high' | 'medium' | 'low';
      confidence: number;
      platform?: string;
      completed: boolean;
      completed_at?: string;
    }>;
    generated_at: string;
    based_on_goal: string;
    summary: string;
  };
}

export interface GetByFiltersLeadsDtoParameters {
  skip?: number;
  limit?: number;
  lead_source?: string;
  interest_level?: string;
  assigned_to: string;
  lead_status?: string;
  starred?: boolean;
  date_filter?: string;
  lead_type?: string;
  lead_form_snapshot_id?: string;
}

export interface ExportLeadDto {
  skip?: number;
  limit?: number;
  lead_source?: string;
  interest_level?: string;
  assigned_to: string;
  lead_status?: string;
  starred?: boolean;
  date_filter?: string;
  lead_type?: string;
  lead_snapshot_id?: string;
  file_type?: FileTypeEnum;
}

// curl -X 'POST' \
//   'https://api.uricreative.com:8445/lead/export-lead?file_type=CSV&assigned_to=6754678&lead_status=New&interest_level=Medium&lead_type=PERSON&lead_snapshot_id=u86789&skip=0&limit=10' \
//   -H 'accept: application/json' \
//   -d ''

export interface LeadExportReportParametersDto {
  file_type: string;
  assigned_to: string;
  lead_status?: string;
  interest_level?: string;
  lead_source?: string;
  skip?: number;
  limit?: number;
}

export interface SearchLeadsDto {
  skip?: number;
  limit?: number;
  query: string;
}

export interface UpdateStatusLeadsDto {
  lead_id: string;
  status: string;
}

export interface LeadBusinessInfoDto {
  lead_business_info_id?: string;
  user_id?: string;
  business_name?: string;
  business_summary?: string;
  business_website?: string;
  created_date?: string;
  last_updated?: string;
  keywords?: string[];
  ai_response_guide?: string;
  competitors?: string[];
  next_generation_date?: string;
  id?: string;
}

export interface GetByFiltersLeadBusinessDto {
  user_id: string;
  business_name?: string;
  skip?: number;
  limit?: number;
}

export interface GetByFiltersLeadBusinessResponseDto {
  data: LeadBusinessInfoDto[];
  total: number;
  pageSize: number;
  metaData: any;
  page: number;
}

export interface LeadAnalyticsDto {
  new_leads: number;
  contacted: number;
  qualified: number;
  unqualified: number;
  converted: number;
  lead_sources_breakdown: LeadSourcesBreakdown;
  leads_by_industry: LeadsByIndustry;
  interest_by_platform: InterestByPlatform;
}

export interface LeadSourcesBreakdown {
  [source: string]: number; // Allows flexibility for additional lead sources
}

export interface LeadsByIndustry {
  [industry: string]: number; // Handles any number of industries dynamically
}

export interface InterestByPlatform {
  [key: string]: {
    [platform: string]: number;
  };
}

export interface EnrichLeadsDto {
  lead_ids: string[];
  reveal_email: boolean;
  reveal_phone: boolean;
  webhook_url: string;
}

export interface FormSnapshotResponseDto {
  data: FormSnapshotDto[];
  total: number;
  page: number;
  pageSize: number;
  metaData: any;
}

export interface FormSnapshotDto {
  lead_form_id: string;
  form_type: string;
  form_title: string;
  user_id: string;
  disabled: boolean;
  disabled_reason: any;
  ai_response_guide: any;
  next_generation_date: string;
  add_to_history: boolean;
  auto_generate: boolean;
  organization_locations: any[];
  organization_ids: any;
  organization_num_employees_ranges: string[];
  person_titles: string[];
  include_similar_titles: boolean;
  person_locations: string[];
  person_seniorities: string[];
  q_organization_domains_list: any[];
  contact_email_status: string[];
  q_keywords: string;
  organization_not_locations: any;
  revenue_range_min: any;
  revenue_range_max: any;
  technology_uids: any;
  q_organization_keyword_tags: any;
  q_organization_name: any;
  business_name: any;
  business_summary: any;
  business_website: any;
  keywords: string[];
  competitors: any;
  source_platforms: string[];
  page: number;
  per_page: number;
  created_date: string;
  last_updated: string;
  lead_form_snapshot_id: string;
  metadata: MetadataDto;
}

export interface MetadataDto {
  total_leads: number;
  new_leads: number;
}
