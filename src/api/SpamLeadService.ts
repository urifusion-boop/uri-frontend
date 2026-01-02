/**
 * SpamLeadService - API service for Spam/Unqualified Leads
 * PRD Feature 1: Spam Visibility & Lead Reclassification
 *
 * NEW FILE - Does not modify any existing services
 */

import { UriHttpClient } from '@/configs/http.config';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import { GetSpamLeadsParams, SpamLeadDto, SpamLeadsResponse, SpamStatsResponse } from '@/models/dtos/SpamLeadDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

/**
 * API Routes for Spam Leads (matches backend endpoints)
 */
const SPAM_API_ROUTES = {
  getSpamLeads: '/lead-insights/spam-leads',
  promoteToLead: (spamId: string) => `/lead-insights/spam-leads/${spamId}/promote`,
  moveToSpam: (leadId: string) => `/lead-insights/leads/${leadId}/move-to-spam`,
  getStats: '/lead-insights/spam-leads/stats',
  updateNotes: (spamId: string) => `/lead-insights/spam-leads/${spamId}/notes`,
} as const;

export class SpamLeadService {
  /**
   * Get spam/unqualified leads for a user
   * PRD Section 3.4: Users can view analyzed-but-unqualified posts
   */
  static async getSpamLeads(params: GetSpamLeadsParams): Promise<SpamLeadsResponse> {
    const queryString = ObjectHelper.filterMap(params);
    const response: AxiosResponse<SpamLeadsResponse> = await UriHttpClient.getClient().get(`${SPAM_API_ROUTES.getSpamLeads}?${queryString}`);

    // Map spam_id to id for Table component compatibility
    if (response.data.responseData?.spam_leads) {
      response.data.responseData.spam_leads = response.data.responseData.spam_leads.map((spam) => ({
        ...spam,
        id: spam.spam_id,
      }));
    }

    return response.data;
  }

  /**
   * Promote spam lead to qualified leads
   * PRD Section 3.5: "Add to Leads" action
   */
  static async promoteSpamToLead(spamId: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().post(SPAM_API_ROUTES.promoteToLead(spamId));

    return response.data;
  }

  /**
   * Move qualified lead to spam (reverse action)
   * PRD Section 3.6: Flag lead as spam
   */
  static async moveLeadToSpam(leadId: string, spamReason: string, spamReasonDetail?: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().post(SPAM_API_ROUTES.moveToSpam(leadId), {
      spam_reason: spamReason,
      spam_reason_detail: spamReasonDetail,
    });

    return response.data;
  }

  /**
   * Get spam statistics
   * PRD Section 3.7: Show context when no qualified leads found
   */
  static async getSpamStats(userId: string, leadFormSnapshotId?: string): Promise<SpamStatsResponse> {
    const params = leadFormSnapshotId ? `user_id=${userId}&lead_form_snapshot_id=${leadFormSnapshotId}` : `user_id=${userId}`;

    const response: AxiosResponse<SpamStatsResponse> = await UriHttpClient.getClient().get(`${SPAM_API_ROUTES.getStats}?${params}`);

    return response.data;
  }

  /**
   * Update user notes on a spam lead
   */
  static async updateSpamNotes(spamId: string, notes: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().patch(SPAM_API_ROUTES.updateNotes(spamId), { user_notes: notes });

    return response.data;
  }

  /**
   * Get spam lead by ID (for details modal)
   */
  static async getSpamLeadById(spamId: string): Promise<UriResponse<SpamLeadDto>> {
    const response: AxiosResponse<UriResponse<SpamLeadDto>> = await UriHttpClient.getClient().get(`${SPAM_API_ROUTES.getSpamLeads}/${spamId}`);

    return response.data;
  }
}
