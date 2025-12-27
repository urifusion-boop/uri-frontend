/**
 * Analytics Tracking for Job Signal Intelligence
 * PRD Section 12: Success Metrics
 *
 * Tracks:
 * - % of job signals clicked
 * - % of users requesting decision-maker connections
 * - User-reported relevance score
 * - Reduction in time from signal → outreach
 */

export enum JobSignalAnalyticsEvent {
  JOB_SIGNAL_VIEWED = 'job_signal_viewed',
  JOB_SIGNAL_CLICKED = 'job_signal_clicked',
  DECISION_MAKER_REQUESTED = 'decision_maker_requested',
  DECISION_MAKER_FOUND = 'decision_maker_found',
  DECISION_MAKER_CONTACTED = 'decision_maker_contacted',
  SIGNAL_RELEVANCE_RATED = 'signal_relevance_rated',
}

interface JobSignalEventData {
  lead_id: string;
  company_name?: string;
  commercial_relevance?: number;
  problem_solution_match?: number;
  job_source?: string;
  timestamp?: number;
}

interface DecisionMakerEventData extends JobSignalEventData {
  decision_makers_found?: number;
  search_duration_ms?: number;
}

interface RelevanceFeedbackData extends JobSignalEventData {
  rating: 1 | 2 | 3 | 4 | 5;
  feedback_text?: string;
}

/**
 * Track job signal analytics event
 * Integrates with existing analytics service (e.g., Google Analytics, Mixpanel, Segment)
 */
export class JobSignalAnalytics {
  /**
   * Track when a job signal is viewed in the table
   * PRD Metric: % of job signals clicked (denominator)
   */
  static trackJobSignalViewed(data: JobSignalEventData) {
    try {
      // TODO: Integrate with your analytics service
      // Example: analytics.track(JobSignalAnalyticsEvent.JOB_SIGNAL_VIEWED, data);

      console.log('[Analytics] Job Signal Viewed:', {
        event: JobSignalAnalyticsEvent.JOB_SIGNAL_VIEWED,
        ...data,
        timestamp: Date.now(),
      });

      // For future integration:
      // if (window.analytics) {
      //   window.analytics.track(JobSignalAnalyticsEvent.JOB_SIGNAL_VIEWED, data);
      // }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track when a job signal is clicked (detail view opened)
   * PRD Metric: % of job signals clicked (numerator)
   */
  static trackJobSignalClicked(data: JobSignalEventData) {
    try {
      console.log('[Analytics] Job Signal Clicked:', {
        event: JobSignalAnalyticsEvent.JOB_SIGNAL_CLICKED,
        ...data,
        timestamp: Date.now(),
      });

      // Track time since signal was created (for time-to-action metric)
      const signalAge = data.timestamp ? Date.now() - data.timestamp : undefined;
      if (signalAge) {
        console.log(`[Analytics] Signal clicked after ${(signalAge / 1000 / 60).toFixed(1)} minutes`);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track when user requests decision-maker lookup
   * PRD Metric: % of users requesting decision-maker connections
   */
  static trackDecisionMakerRequested(data: JobSignalEventData) {
    try {
      console.log('[Analytics] Decision Maker Requested:', {
        event: JobSignalAnalyticsEvent.DECISION_MAKER_REQUESTED,
        ...data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track when decision-makers are successfully found
   */
  static trackDecisionMakerFound(data: DecisionMakerEventData) {
    try {
      console.log('[Analytics] Decision Maker Found:', {
        event: JobSignalAnalyticsEvent.DECISION_MAKER_FOUND,
        ...data,
        timestamp: Date.now(),
      });

      if (data.search_duration_ms) {
        console.log(`[Analytics] Decision maker search took ${data.search_duration_ms}ms`);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track when user contacts a decision-maker
   * PRD Metric: Reduction in time from signal → outreach
   */
  static trackDecisionMakerContacted(data: JobSignalEventData & { contact_method: 'email' | 'phone' | 'linkedin' }) {
    try {
      console.log('[Analytics] Decision Maker Contacted:', {
        event: JobSignalAnalyticsEvent.DECISION_MAKER_CONTACTED,
        ...data,
        timestamp: Date.now(),
      });

      // Calculate time from signal creation to outreach
      const timeToOutreach = data.timestamp ? Date.now() - data.timestamp : undefined;
      if (timeToOutreach) {
        console.log(`[Analytics] Time from signal to outreach: ${(timeToOutreach / 1000 / 60).toFixed(1)} minutes`);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track user relevance feedback
   * PRD Metric: User-reported relevance score
   */
  static trackSignalRelevanceRated(data: RelevanceFeedbackData) {
    try {
      console.log('[Analytics] Signal Relevance Rated:', {
        event: JobSignalAnalyticsEvent.SIGNAL_RELEVANCE_RATED,
        ...data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }
}

/**
 * Helper to calculate metrics from tracked events
 * For dashboard/reporting purposes
 */
export class JobSignalMetrics {
  /**
   * Calculate % of job signals clicked
   * PRD Metric: Engagement rate
   */
  static calculateClickRate(viewedCount: number, clickedCount: number): number {
    if (viewedCount === 0) return 0;
    return (clickedCount / viewedCount) * 100;
  }

  /**
   * Calculate % of users requesting decision-makers
   * PRD Metric: Decision-maker request rate
   */
  static calculateDecisionMakerRequestRate(totalSignals: number, requestedCount: number): number {
    if (totalSignals === 0) return 0;
    return (requestedCount / totalSignals) * 100;
  }

  /**
   * Calculate average relevance score
   * PRD Metric: User-reported relevance
   */
  static calculateAverageRelevance(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
  }

  /**
   * Calculate average time from signal to outreach
   * PRD Metric: Reduction in sales cycle time
   */
  static calculateAverageTimeToOutreach(durations: number[]): { minutes: number; hours: number } {
    if (durations.length === 0) return { minutes: 0, hours: 0 };
    const avgMs = durations.reduce((acc, dur) => acc + dur, 0) / durations.length;
    return {
      minutes: avgMs / 1000 / 60,
      hours: avgMs / 1000 / 60 / 60,
    };
  }
}
