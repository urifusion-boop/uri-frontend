/**
 * Job Signal Intelligence Helpers
 * PRD Sections 7.4, 14-16
 *
 * Utilities for displaying job board signals with proper labeling and confidence warnings
 */

/**
 * Get signal strength label based on commercial relevance score
 * PRD Section 7.4: Visibility Rules
 *
 * @param commercialRelevance - Score from 0-1
 * @returns Label and color for the signal
 */
export function getSignalLabel(commercialRelevance: number): {
  label: string;
  color: 'success' | 'warning' | 'info';
  emoji: string;
} {
  if (commercialRelevance >= 0.7) {
    return {
      label: 'Strong Sales Signal',
      color: 'success',
      emoji: '🔥',
    };
  } else if (commercialRelevance >= 0.5) {
    return {
      label: 'Medium Sales Signal',
      color: 'warning',
      emoji: '⚡',
    };
  } else {
    return {
      label: 'Low (Exploratory Opportunity)',
      color: 'info',
      emoji: '🔍',
    };
  }
}

/**
 * Check if company has low confidence
 * PRD Sections 14-16: Company Visibility & Confidence Tagging
 *
 * @param companyConfidence - Score from 0-1
 * @returns Whether company is low confidence
 */
export function isLowConfidence(companyConfidence?: number): boolean {
  return (companyConfidence ?? 0) < 0.5;
}

/**
 * Check if decision-maker lookup is eligible
 * PRD Section 16: Decision-Maker Eligibility Rules
 *
 * Enabled only if ALL conditions met:
 * 1. Company name is present
 * 2. Company confidence ≥ 0.5
 * 3. Problem-solution match ≥ 0.3
 *
 * @param lead - The lead object
 * @returns Whether decision-maker lookup is available
 */
export function canFindDecisionMakers(lead: any): {
  eligible: boolean;
  reason?: string;
} {
  const hiringCompany = lead.hiring_company || lead.first_name;
  const companyConfidence = lead.company_confidence ?? 0;
  const problemSolutionMatch = lead.problem_solution_match ?? 0;

  if (!hiringCompany) {
    return {
      eligible: false,
      reason: 'Company name is missing',
    };
  }

  if (companyConfidence < 0.5) {
    return {
      eligible: false,
      reason: 'Company identity could not be verified',
    };
  }

  if (problemSolutionMatch < 0.3) {
    return {
      eligible: false,
      reason: 'Problem-solution match too low',
    };
  }

  return { eligible: true };
}

/**
 * Get low confidence warning message
 * PRD Section 15.2: Low Confidence Signal Rules
 */
export function getLowConfidenceWarning(): {
  message: string;
  tooltip: string;
} {
  return {
    message: '⚠ Low Confidence — Company identity not verified',
    tooltip: 'We could not confidently identify this company. Decision-maker discovery is unavailable.',
  };
}
