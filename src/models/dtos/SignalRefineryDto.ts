/**
 * Signal Refinery DTOs - Google X-Ray Testing System
 *
 * Mirrors backend signal_refinery_schema.py
 */

export enum XRayPlatform {
  TWITTER = 'Twitter',
  NAIRALAND = 'Nairaland',
  LINKEDIN = 'LinkedIn',
  REDDIT = 'Reddit',
}

export enum FilterReason {
  BLOCKLIST = 'blocklist',
  BOT_PATTERN = 'bot_pattern',
  NOT_NIGERIAN = 'not_nigerian',
  SELLER = 'seller',
  NO_INTENT = 'no_intent',
  DUPLICATE = 'duplicate',
}

export enum BuyerSellerClassification {
  BUYER = 'buyer',
  SELLER = 'seller',
  UNKNOWN = 'unknown',
}

// ========================================
// REQUEST MODELS
// ========================================

export interface XRaySearchRequest {
  user_id: string;
  keyword: string;
  platforms: XRayPlatform[];
  location?: string;
  max_results_per_platform?: number;
  enable_buyer_seller_classification?: boolean;
  enable_nigerian_filter?: boolean;
  compare_with_traditional?: boolean;
}

// ========================================
// RESULT MODELS
// ========================================

export interface XRaySearchResult {
  result_id: string;
  platform: XRayPlatform;
  title: string;
  snippet: string;
  url: string;
  source_date?: string;
  google_rank?: number;
  dork_query: string;
  raw_data?: any;
}

export interface FilteredResult {
  result: XRaySearchResult;
  filter_reason: FilterReason;
  filter_detail: string;
}

export interface BuyerSellerAnalysis {
  classification: BuyerSellerClassification;
  confidence: number; // 0-1
  reasoning: string;
  pain_point?: string;
  product_needed?: string;
}

export interface XRayLead {
  id: string; // For React key (same as lead_id)
  lead_id: string;
  user_id: string;
  platform: XRayPlatform;
  title: string;
  snippet: string;
  url: string;
  full_text?: string;
  search_keyword: string;
  location: string;
  dork_query: string;
  buyer_seller: BuyerSellerAnalysis;
  created_at: string;
  google_rank?: number;
  passed_blocklist: boolean;
  passed_bot_detection: boolean;
  passed_nigerian_check: boolean;
}

// ========================================
// METRICS & COMPARISON
// ========================================

export interface RefineryMetrics {
  total_fetched: number;
  blocklist_filtered: number;
  bot_filtered: number;
  nigerian_filtered: number;
  seller_filtered: number;
  seller_filtered_count?: number; // Alias for seller_filtered
  duplicate_filtered: number;
  final_buyer_count: number;
  buyer_leads_count?: number; // Alias for final_buyer_count
  buyer_seller_ratio: number; // 0-1
  spam_ratio: number; // 0-1
  google_search_cost: number; // USD
  llm_classification_cost: number; // USD
  total_cost: number; // USD
  cost_per_lead: number; // USD
  total_time_seconds: number;
  leads_per_second: number;
  // Comparison (optional)
  traditional_scraper_cost?: number;
  traditional_spam_ratio?: number;
  cost_savings_percent?: number;
  quality_improvement_percent?: number;
}

export interface XRaySearchJob {
  job_id: string;
  user_id: string;
  request: XRaySearchRequest;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  progress_percent?: number; // Alias for progress
  current_step: string;
  progress_message?: string; // Alias for current_step
  results: XRaySearchResult[];
  filtered: FilteredResult[];
  leads: XRayLead[];
  metrics?: RefineryMetrics;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

// ========================================
// RESPONSE MODELS
// ========================================

export interface XRaySearchResponse {
  success: boolean;
  job_id: string;
  message: string;
}

export interface XRayJobStatusResponse {
  success: boolean;
  job: XRaySearchJob;
}

export interface DorkQueryPreview {
  platform: XRayPlatform;
  query: string;
  estimated_results?: number;
}

// ========================================
// METRICS SUMMARY (Aggregate across all jobs)
// ========================================

export interface MetricsSummary {
  total_jobs: number;
  total_leads: number;
  total_cost: number;
  avg_buyer_ratio: number;
  avg_spam_ratio: number;
  avg_cost_per_lead: number;
}
