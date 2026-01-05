import { UriHttpClient } from '@/configs/http.config';
import { leadsApiRoutes } from '@/constants/routes/leadsRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import {
  EnrichLeadsDto,
  ExportLeadDto,
  GetByFiltersLeadBusinessDto,
  GetByFiltersLeadBusinessResponseDto,
  GetByFiltersLeadsDto,
  GetByFiltersLeadsDtoParameters,
  LeadAnalyticsDto,
  LeadBusinessInfoDto,
  LeadDto,
  SearchLeadsDto,
  UpdateStatusLeadsDto,
} from '@/models/dtos/LeadsDto';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class LeadsService {
  static async create(data: LeadDto): Promise<UriResponse<LeadDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadDto>>> = await UriHttpClient.getClient().post(leadsApiRoutes.create, data);
    return response.data;
  }

  static async multipleCreate(leads: LeadDto[], leadFormId?: string): Promise<UriResponse<any>> {
    const url = leadFormId ? `${leadsApiRoutes.multipleCreate}?lead_form_id=${leadFormId}` : leadsApiRoutes.multipleCreate;
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(url, leads);
    return response.data;
  }

  static async getByFilters(data: GetByFiltersLeadsDtoParameters): Promise<UriResponse<GetByFiltersLeadsDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<GetByFiltersLeadsDto>>> = await UriHttpClient.getClient().get(`${leadsApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async enrich(data: EnrichLeadsDto): Promise<UriResponse<EnrichLeadsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<EnrichLeadsDto>>> = await UriHttpClient.getClient().post(`${leadsApiRoutes.enrich}`, data);
    return response.data;
  }

  static async search(data: SearchLeadsDto): Promise<UriResponse<GetByFiltersLeadsDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<GetByFiltersLeadsDto>>> = await UriHttpClient.getClient().get(`${leadsApiRoutes.search}?${queryString}`);
    return response.data;
  }

  static async updateStatus(data: UpdateStatusLeadsDto): Promise<UriResponse<LeadDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<LeadDto>>> = await UriHttpClient.getClient().post(`${leadsApiRoutes.updateStatus}?${queryString}`, data);

    return response.data;
  }

  static async createLeadBusiness(data: LeadBusinessInfoDto): Promise<UriResponse<LeadBusinessInfoDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadBusinessInfoDto>>> = await UriHttpClient.getClient().post(leadsApiRoutes.createLeadBusiness, data);

    return response.data;
  }

  static async updateLeadBusiness(data: LeadBusinessInfoDto): Promise<UriResponse<LeadBusinessInfoDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadBusinessInfoDto>>> = await UriHttpClient.getClient().post(
      `${leadsApiRoutes.updateLeadBusiness}?lead_business_info_id=${data.lead_business_info_id}`,
      data
    );

    return response.data;
  }

  static async getLeadsBusinessByFilters(data: GetByFiltersLeadBusinessDto): Promise<UriResponse<GetByFiltersLeadBusinessResponseDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<GetByFiltersLeadBusinessResponseDto>>> = await UriHttpClient.getClient().get(`${leadsApiRoutes.getLeadBusinessByFilters}?${queryString}`);

    return response.data;
  }

  static async getLeadAnalytics(userId: string, date_filter: string, lead_type?: LeadTypeEnum): Promise<UriResponse<LeadAnalyticsDto>> {
    let url = `${leadsApiRoutes.analytics}?user_id=${userId}&date_filter=${date_filter}`;
    if (lead_type) {
      url += `&lead_type=${lead_type}`;
    }
    const response: Awaited<AxiosResponse<UriResponse<LeadAnalyticsDto>>> = await UriHttpClient.getClient().get(url);

    return response.data;
  }

  static async deleteManyLeads(lead_ids: string[]): Promise<UriResponse<string>> {
    const queryString = lead_ids.map((id) => `lead_ids=${id}`).join('&');

    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().delete(`${leadsApiRoutes.deleteMany}?${queryString}`);

    return response.data;
  }

  static async regenerateLeadFollowUpMessage(lead_id: string, user_prompt: string): Promise<UriResponse<LeadDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadDto>>> = await UriHttpClient.getClient().post(
      `${leadsApiRoutes.regenerateLeadFollowUpMessage}?lead_id=${lead_id}&user_prompt=${user_prompt}`
    );

    return response.data;
  }

  static async exportLeadReport(data: ExportLeadDto): Promise<UriResponse<{ text: string }>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<{ text: string }>>> = await UriHttpClient.getClient().post(`${leadsApiRoutes.exportReport}?${queryString}`);

    return response.data;
  }

  static async unStarLead(lead_id: string): Promise<UriResponse<LeadDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadDto>>> = await UriHttpClient.getClient().post(`${leadsApiRoutes.unstar}?lead_id=${lead_id}`);

    return response.data;
  }

  static async starLead(lead_id: string): Promise<UriResponse<LeadDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadDto>>> = await UriHttpClient.getClient().post(`${leadsApiRoutes.star}?lead_id=${lead_id}`);

    return response.data;
  }

  static async getUserBusinessDetails(userId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(`${leadsApiRoutes.getUserBusinessDetails}/${userId}`);
    return response.data;
  }

  /**
   * Mark a next step as complete or incomplete
   */
  static async markNextStepComplete(leadId: string, stepId: string, completed: boolean = true): Promise<UriResponse<any>> {
    const url = leadsApiRoutes.markNextStepComplete.replace(':lead_id', leadId).replace(':step_id', stepId);

    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().patch(`${url}?completed=${completed}`);
    return response.data;
  }

  /**
   * Get aggregated next steps summary for user
   */
  static async getNextStepsSummary(userId: string): Promise<
    UriResponse<{
      total_pending_actions: number;
      by_priority: { high: number; medium: number; low: number };
      leads_requiring_action: number;
      completed_actions_today: number;
      top_actions: Array<{ action: string; count: number }>;
    }>
  > {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().get(`${leadsApiRoutes.nextStepsSummary}?user_id=${userId}`);
    return response.data;
  }
}
