/**
 * Lazarus Protocol - TypeScript Type Definitions
 * PRD: The Lazarus Protocol - CRM Resurrection Engine
 */

// ============ ENUMS ============
export enum LazarusMonitorType {
  FOCUS_CONTACT = 'FOCUS_CONTACT',
  COMPANY = 'COMPANY',
}

export enum LazarusMonitoringStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
}

export enum LazarusAlertType {
  // Focus Contact alerts - Career Change (Highest Priority)
  JOB_EXIT = 'JOB_EXIT',
  CHAMPION_MOVE = 'CHAMPION_MOVE',
  PROMOTED = 'PROMOTED',
  CHANGED_JOBS = 'CHANGED_JOBS',
  NEW_DECISION_MAKER = 'NEW_DECISION_MAKER',

  // Focus Contact alerts - Pain/Interest
  PAIN_SIGNAL = 'PAIN_SIGNAL',
  BUYING_INTENT = 'BUYING_INTENT',
  COMPETITOR_COMPLAINT = 'COMPETITOR_COMPLAINT',
  SWITCH_SIGNAL = 'SWITCH_SIGNAL',

  // Company alerts - Business Growth
  HIRING_SPREE = 'HIRING_SPREE',
  CASH_INJECTION = 'CASH_INJECTION',
  EXPANSION = 'EXPANSION',

  // Company alerts - Other
  STRATEGIC_PIVOT = 'STRATEGIC_PIVOT',
  COMPANY_DEAD = 'COMPANY_DEAD',

  // Engagement Signals
  LIKES_COMPETITOR = 'LIKES_COMPETITOR',
  INTERACTS_WITH_CONTENT = 'INTERACTS_WITH_CONTENT',
}

export enum LazarusAlertStatus {
  NEW = 'NEW',
  VIEWED = 'VIEWED',
  ACTED = 'ACTED', // User took action (contacted)
  CONTACTED = 'CONTACTED', // Alias for ACTED (legacy)
  DISMISSED = 'DISMISSED',
}

export enum LazarusPlanType {
  BASIC = 'BASIC', // 50 slots
  PRO = 'PRO', // 500 slots
}

// ============ INTERFACES ============

export interface ScannedPost {
  post_url: string;
  post_text: string;
  post_platform: string;
  post_author?: string;
  post_created_at?: string;
  post_likes?: number;
  post_comments?: number;
  post_index: number;
}

export interface FocusContact {
  focus_id: string;
  user_id: string;
  name: string;
  social_handle?: string;
  linkedin_url?: string;
  twitter_url?: string;
  current_company?: string;
  last_bio_text?: string;
  last_bio_hash?: string;
  industry_keywords: string[];
  monitoring_status: LazarusMonitoringStatus;
  source_lead_id?: string;
  last_scan_date?: string;
  next_scan_date: string;
  scan_frequency_days: number;
  scan_count: number;
  alert_count: number;
  created_date: string;
  last_updated: string;

  // Phase 1: Enrichment fields
  email?: string;
  phone?: string;
  profile_photo?: string;
  headline?: string;
  location?: string;
  connections_count?: number;
  about?: string;
  work_experience?: any[];
  education?: any[];
  skills?: string[];
  languages?: string[];
  certifications?: any[];
  enriched_at?: string;
  enrichment_status?: 'pending' | 'completed' | 'failed';

  // Twitter-specific fields
  twitter_handle?: string;
  twitter_id?: string;
  twitter_data?: {
    followers?: number;
    following?: number;
    verified?: boolean;
    posts_count?: number;
    joined_date?: string;
    banner_image?: string;
    website?: string;
    enrichment_snapshot?: {
      last_post_id?: string;
      posts?: any[];
      enriched_at?: string;
    };
    last_scanned?: string;
    last_activity_detected?: string;
    new_posts_since_last_scan?: number;
  };
}

export interface FocusContactCreate {
  name: string;
  social_handle?: string;
  last_bio_text?: string;
  industry_keywords: string[];
  scan_frequency_days?: number;
}

export interface CompanyMonitor {
  monitor_id: string;
  user_id: string;
  company_name: string;
  website_url: string;
  linkedin_url?: string;
  location?: string;
  country_code?: string;
  last_homepage_hash?: string;
  last_job_count: number;
  consecutive_404_count: number;
  monitoring_status: LazarusMonitoringStatus;
  source_lead_id?: string;
  last_scan_date?: string;
  next_scan_date: string;
  scan_frequency_days: number;
  scan_count: number;
  alert_count: number;
  created_date: string;
  last_updated: string;
  // Enrichment fields
  enrichment_status?: 'pending' | 'completed' | 'failed' | null;
  enriched_at?: string;
  about?: string;
  slogan?: string;
  description?: string;
  specialties?: string[];
  organization_type?: string;
  company_size?: string;
  industries?: string[];
  founded?: number;
  headquarters?: string;
  followers?: number;
  employees?: number;
  logo?: string;
  company_image?: string;
}

export interface CompanyMonitorCreate {
  company_name: string;
  website_url: string;
  location?: string;
  country_code?: string;
  industry_keywords?: string[];
  last_homepage_content?: string;
  last_job_count?: number;
  scan_frequency_days?: number;
}

export interface LazarusAlertEvidence {
  // Job changes
  old_bio?: string;
  new_bio?: string;
  old_company?: string;
  new_company?: string;
  // Social signals (platform-agnostic) - THE POST THAT TRIGGERED THE ALERT
  post_url?: string;
  post_text?: string;
  post_platform?: string;
  post_author?: string;
  post_created_at?: string;
  post_likes?: number;
  post_comments?: number;
  // All scanned posts
  scanned_posts?: ScannedPost[];
  triggering_post_index?: number;
  // Legacy fields
  tweet_url?: string;
  tweet_text?: string;
  // Company signals
  news_url?: string;
  news_title?: string;
  old_job_count?: number;
  new_job_count?: number;
  // Homepage changes
  detected_keywords?: string[];
  // AI Analysis
  signal_type?: string;
  confidence?: number;
  evidence_text?: string;
  signal_source?: string;
}

export interface LazarusAlert {
  alert_id: string;
  user_id: string;
  source_type: LazarusMonitorType;
  source_id: string;
  source_name: string;
  alert_type: LazarusAlertType;
  alert_message: string;
  evidence: LazarusAlertEvidence;
  suggested_pitch?: string;
  status: LazarusAlertStatus;
  viewed_at?: string;
  acted_at?: string;
  dismissed_at?: string;
  user_feedback?: string;
  source_lead_id?: string;
  assigned_to?: string;
  assigned_at?: string;
  assigned_by?: string;
  priority_score?: number; // 0-100 AI priority score
  priority_level?: 'HOT' | 'WARM' | 'COLD';
  created_at: string;
}

export interface LazarusSlots {
  user_id: string;
  plan_type: LazarusPlanType;
  max_slots: number;
  used_slots: number;
  focus_contacts_count: number;
  company_monitors_count: number;
  created_date: string;
  last_updated: string;
}

export interface LazarusMetrics {
  used_slots: number;
  max_slots: number;
  utilization_percent: number;
  active_focus_contacts: number;
  active_company_monitors: number;
  total_alerts: number;
  new_alerts: number;
  new_alerts_count: number;
  resurrected_leads: number;
  resurrection_rate: number;
  should_upgrade: boolean;
  upgrade_from: string;
  upgrade_to: string;
  plan_type: string;
}

export interface CSVUploadRow {
  type: LazarusMonitorType;
  name: string;
  social_handle?: string;
  current_bio?: string;
  website_url?: string;
  location?: string;
  country_code?: string;
  industry_keywords?: string[];
  scan_frequency_days?: number;
}

// ============ API RESPONSES ============

export interface AddFocusContactResponse {
  success: boolean;
  message: string;
  focus_id?: string;
  slots_used?: number;
  slots_available?: number;
  contact?: FocusContact;
}

export interface AddCompanyMonitorResponse {
  success: boolean;
  message: string;
  monitor_id?: string;
  slots_used?: number;
  slots_available?: number;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  added_count: number;
  failed_count: number;
  errors: Array<{
    name: string;
    error: string;
  }>;
}

export interface MarkDeadResponse {
  success: boolean;
  message: string;
  monitoring_added?: boolean;
  monitoring_message?: string;
}

export interface ResurrectLeadResponse {
  success: boolean;
  message: string;
  resurrection_count?: number;
}

export interface SocialMediaPost {
  text?: string;
  author?: string;
  platform?: string;
  created_at?: string;
  likes?: number;
  comments?: number;
  retweets?: number;
  shares?: number;
}

export interface AlertDetectionData {
  alert_type?: string;
  alert_message?: string;
  suggested_pitch?: string;
  confidence?: number;
  signal_type?: string;
}

export interface ScanResponse {
  success: boolean;
  total_scanned?: number;
  total_alerts?: number;
  scanned?: number;
  alerts_created?: number;
  message?: string;
  platform?: string;
  focus_contacts?: {
    scanned: number;
    alerts_created: number;
    sample_posts?: SocialMediaPost[];
  };
  company_monitors?: {
    scanned: number;
    alerts_created: number;
    sample_posts?: SocialMediaPost[];
  };
  sample_posts?: SocialMediaPost[];
  alert_data?: AlertDetectionData;
}

// ============ HELPER TYPES ============

export interface AlertCardData {
  alert: LazarusAlert;
  onContact: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export interface MonitorCardData {
  contact?: FocusContact;
  monitor?: CompanyMonitor;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRemove: (id: string) => void;
}

export interface LazarusDashboardFilters {
  alertStatus?: LazarusAlertStatus;
  monitorStatus?: LazarusMonitoringStatus;
  alertType?: LazarusAlertType;
  monitorType?: LazarusMonitorType;
}
