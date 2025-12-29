import { UriHttpClient } from '@/configs/http.config';
import { leadFormApiRoutes } from '@/constants/routes/leadFormRoutes';
import { leadsApiRoutes } from '@/constants/routes/leadsRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import {
  AutoPopulateDto,
  BusinessSearchFormDto,
  ConversationalSearchFormDto,
  IndividualLeadFormDto,
  LeadFormDto,
  LeadFormGetByFiltersDto,
  LeadFormResponseDto,
  LeadFormUpdateDto,
  OrganizationLeadFormDto,
} from '@/models/dtos/LeadFormDto';
import { LeadBusinessInfoDto } from '@/models/dtos/LeadsDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class LeadsService {
  static async getByFilters(data: LeadFormGetByFiltersDto): Promise<UriResponse<LeadFormDto[]>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<LeadFormDto[]>>> = await UriHttpClient.getClient().get(`${leadFormApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async getByUserId(user_id: string): Promise<UriResponse<LeadFormDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormDto[]>>> = await UriHttpClient.getClient().get(`${leadFormApiRoutes.getByUserId}?user_id=${user_id}`);

    return response.data;
  }

  static async createOrganizationSearchLeadForm(data: OrganizationLeadFormDto): Promise<UriResponse<LeadBusinessInfoDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadBusinessInfoDto>>> = await UriHttpClient.getClient().post(leadFormApiRoutes.organizationSearchCreate, data);

    return response.data;
  }

  static async updateOrganizationSearchLeadForm(lead_form_id: string, data: OrganizationLeadFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().put(`${leadFormApiRoutes.organizationSearchUpdate}?lead_form_id=${lead_form_id}`, data);

    return response.data;
  }

  static async updateLeadForm(lead_form_id: string, data: LeadFormUpdateDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().put(`${leadFormApiRoutes.update}?lead_form_id=${lead_form_id}`, data);

    return response.data;
  }

  static async createPersonSearchLeadForm(data: IndividualLeadFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().post(leadFormApiRoutes.personSearchCreate, data);

    return response.data;
  }

  static async updatePersonSearchLeadForm(lead_form_id: string, data: IndividualLeadFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().put(`${leadFormApiRoutes.personSearchUpdate}?lead_form_id=${lead_form_id}`, data);

    return response.data;
  }

  static async createBusinessSearchLeadForm(data: BusinessSearchFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().post(leadFormApiRoutes.businessLeadFormCreate, data);

    return response.data;
  }

  static async updateBusinessSearchLeadForm(lead_form_id: string, data: BusinessSearchFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().put(`${leadFormApiRoutes.businessLeadFormUpdate}?lead_form_id=${lead_form_id}`, data);

    return response.data;
  }

  static async createConversationalSearchLeadForm(data: ConversationalSearchFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().post(leadFormApiRoutes.conversationalSearchCreate, data);

    return response.data;
  }

  static async updateConversationalSearchLeadForm(lead_form_id: string, data: ConversationalSearchFormDto): Promise<UriResponse<LeadFormResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormResponseDto>>> = await UriHttpClient.getClient().put(
      `${leadFormApiRoutes.conversationalSearchUpdate}?lead_form_id=${lead_form_id}`,
      data
    );

    return response.data;
  }

  static async getById(lead_form_id: string): Promise<UriResponse<LeadFormDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormDto>>> = await UriHttpClient.getClient().get(`${leadFormApiRoutes.getById}?${lead_form_id}`);

    return response.data;
  }

  static async deleteLeadForm(lead_form_id: string): Promise<UriResponse<LeadFormDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormDto>>> = await UriHttpClient.getClient().delete(`${leadFormApiRoutes.delete}?${lead_form_id}`);

    return response.data;
  }

  static async autoPopulate(data: AutoPopulateDto): Promise<UriResponse<LeadFormDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormDto>>> = await UriHttpClient.getClient().post(leadFormApiRoutes.autoPopulate, data);

    return response.data;
  }

  static async fetchConversationalLeads(
    lead_form_id: string,
    user_id: string
  ): Promise<
    UriResponse<{
      lead_form_id: string;
      job_id: string;
      status: string;
      poll_url: string;
    }>
  > {
    // Now returns immediately with job_id for polling (HTTP 202)
    const response: Awaited<
      AxiosResponse<
        UriResponse<{
          lead_form_id: string;
          job_id: string;
          status: string;
          poll_url: string;
        }>
      >
    > = await UriHttpClient.getClient().post(
      `${leadFormApiRoutes.conversationalSearchFetchLeads}?lead_form_id=${lead_form_id}&user_id=${user_id}`,
      {},
      {
        timeout: 10000, // 10 seconds - just to start the job
      }
    );

    return response.data;
  }

  static async getJobStatus(job_id: string): Promise<
    UriResponse<{
      job_id: string;
      lead_form_id: string;
      status: string; // 'processing', 'completed', 'failed'
      progress: number; // 0-100
      message: string;
      stats?: {
        total_fetched: number;
        total_qualified: number;
        new_leads_saved: number;
        duplicates_skipped: number;
      };
      error?: string;
      created_at: string;
      updated_at: string;
    }>
  > {
    const response: Awaited<
      AxiosResponse<
        UriResponse<{
          job_id: string;
          lead_form_id: string;
          status: string;
          progress: number;
          message: string;
          stats?: {
            total_fetched: number;
            total_qualified: number;
            new_leads_saved: number;
            duplicates_skipped: number;
          };
          error?: string;
          created_at: string;
          updated_at: string;
        }>
      >
    > = await UriHttpClient.getClient().get(`${leadFormApiRoutes.conversationalSearchJobStatus}/${job_id}`, {
      timeout: 20000, // 20 seconds (increased for slower database queries)
    });

    return response.data;
  }

  static async hasLeadsByType(userId: string, leadType: string): Promise<boolean> {
    try {
      const response = await this.getByFilters({
        user_id: userId,
        lead_type: leadType,
        page: 1,
        page_size: 1,
      });
      return !!(response.responseData && response.responseData.length > 0);
    } catch {
      return false;
    }
  }

  /**
   * Generate job keywords from business context (PRD Section 5)
   * AI uses onboarding information to pre-fill keyword logic
   */
  static async generateJobKeywords(userId: string, context?: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(leadsApiRoutes.generateJobKeywords, null, {
      params: {
        user_id: userId,
        context: context || undefined,
      },
    });
    return response.data;
  }

  /**
   * Find decision-makers for a job board signal (PRD Section 8)
   * Maps job role to decision-maker titles and searches Apollo
   */
  static async findDecisionMakers(leadId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(`/api/v1/leads/job-boards/${leadId}/find-decision-makers`);
    return response.data;
  }

  /**
   * Get user's business details from uri-backend
   * Used for auto-generating job keywords from onboarding data
   */
  static async getUserBusinessDetails(userId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(`${leadsApiRoutes.getUserBusinessDetails}/${userId}`);
    return response.data;
  }

  /**
   * Add decision-maker to Individual Leads (PRD Section 8.4-8.5)
   * Creates an Individual Lead from a job signal decision-maker
   */
  static async addDecisionMakerToIndividualLeads(data: {
    name: string;
    email: string;
    phone?: string;
    linkedin_url?: string;
    job_title: string;
    company: string;
    user_id: string;
    parent_job_signal_id: string;
    notes?: string;
  }): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post('/api/v1/leads/create', {
      first_name: data.name.split(' ')[0] || data.name,
      last_name: data.name.split(' ').slice(1).join(' ') || '',
      lead_email: data.email,
      phone: data.phone,
      linkedin_url: data.linkedin_url,
      job_title: data.job_title,
      company_name: data.company,
      lead_type: 'PERSON',
      lead_source: 'JOB_SIGNAL_CONVERSION',
      assigned_to: data.user_id,
      lead_status: 'NEW',
      opportunity_type: 'Other',
      tags: [],
      lead_reason: data.notes || `Decision-maker for job signal at ${data.company}`,
      starred: false,
      // Link back to parent job signal
      parent_job_signal_id: data.parent_job_signal_id,
    });
    return response.data;
  }

  /**
   * Validate search context to detect business-keyword mismatch
   * Helps prevent irrelevant lead generation
   */
  static async validateSearchContext(data: {
    solution_context: string;
    category_context?: string;
    social_keywords?: string[];
    job_keywords?: string[];
    has_social_platforms: boolean;
    has_job_boards: boolean;
  }): Promise<
    UriResponse<{
      is_valid: boolean;
      match_score: number;
      social_platform_match: number;
      job_board_match: number;
      recommendation: 'proceed' | 'use_only_social' | 'use_only_job_boards' | 'update_search';
      reasoning: string;
      suggested_social_keywords: string[];
    }>
  > {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(leadsApiRoutes.validateSearchContext, data);
    return response.data;
  }
}
