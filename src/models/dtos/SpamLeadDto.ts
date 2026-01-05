/**
 * SpamLeadDto - Data Transfer Object for Spam/Unqualified Leads
 * PRD Feature 1: Spam Visibility & Lead Reclassification
 */

export interface SpamLeadDto {
  // Core Identifiers
  id: string; // Required by Table component - maps to spam_id
  spam_id: string;
  user_id: string;
  lead_form_snapshot_id: string;

  // Display Fields (for quick rendering without parsing original_lead_data)
  display_title?: string;
  display_company?: string;
  display_link?: string;

  // Spam Classification
  spam_reason: string; // Primary reason (SpamReasonEnum value)
  spam_reason_detail?: string; // Detailed explanation with scores
  filter_stage: string; // Which filter failed (job_board_ai, intent_analysis, etc.)

  // Source Information
  lead_source: string; // "Job Boards", "X", "Reddit", "Facebook", etc.
  search_keyword: string;

  // Original Data (complete lead that was filtered)
  original_lead_data: Record<string, any>;

  // Job Board Scores (populated when lead_source = "Job Boards")
  problem_solution_match?: number;
  hiring_intent_score?: number;
  commercial_relevance?: number;
  company_confidence?: number;

  // Social Post Scores (populated when lead_source = X, Reddit, etc.)
  intent_score?: number;
  relevance_score?: number;
  final_score?: number;
  sentiment?: string;
  intent_reasoning?: string; // AI explanation for why intent failed

  // Job Board AI reasoning
  job_board_reasoning?: string; // AI explanation for job board analysis

  // User Actions (PRD 3.5, 3.6)
  user_reviewed: boolean;
  promoted_to_leads: boolean;
  moved_from_leads: boolean;
  user_notes?: string;

  // Timestamps
  created_at: string;
  updated_at?: string;
}

/**
 * Spam Reason Enum Values (matching backend)
 */
export enum SpamReasonEnum {
  // Job Board Reasons
  LOW_PROBLEM_SOLUTION_MATCH = 'Low problem–solution match',
  LOW_COMMERCIAL_RELEVANCE = 'Low commercial relevance',
  LOW_HIRING_INTENT = 'Low hiring intent signal',
  MISSING_COMPANY = 'Missing company information',
  LOW_COMPANY_CONFIDENCE = 'Company confidence too low',

  // Social Post Reasons
  LOW_INTENT_SCORE = 'Low buying intent',
  LOW_RELEVANCE_SCORE = 'Low relevance to business',
  FAILED_INTENT_ANALYSIS = 'Failed intent qualification',

  // Other
  DUPLICATE = 'Duplicate content',
  TIME_FILTER = 'Outside time range',
  LOCATION_FILTER = 'Outside target location',
}

/**
 * Filter Stage Enum
 */
export enum SpamFilterStageEnum {
  JOB_BOARD_AI = 'job_board_ai',
  INTENT_ANALYSIS = 'intent_analysis',
  TIME_FILTER = 'time_filter',
  LOCATION_FILTER = 'location_filter',
  DUPLICATE = 'duplicate',
}

/**
 * API Response for Spam Leads List
 */
export interface SpamLeadsResponse {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: {
    data: SpamLeadDto[];
    total: number;
    page: number;
    pageSize: number;
  };
}

/**
 * API Response for Spam Stats
 */
export interface SpamStatsResponse {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: {
    total_spam: number;
    by_source: Record<string, number>;
    by_spam_reason: Record<string, number>;
    by_filter_stage: Record<string, number>;
    promoted_count: number;
    reviewed_count: number;
    unreviewed_count: number;
  };
}

/**
 * Request params for getting spam leads
 */
export interface GetSpamLeadsParams {
  user_id: string;
  lead_form_snapshot_id?: string;
  lead_source?: string;
  spam_reason?: string;
  filter_stage?: string;
  search?: string;
  page?: number;
  page_size?: number;
}
