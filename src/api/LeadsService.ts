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
    const response: Awaited<AxiosResponse<UriResponse<LeadAnalyticsDto>>> = await UriHttpClient.getClient().get(
      `${leadsApiRoutes.analytics}?user_id=${userId}&date_filter=${date_filter}&lead_type=${lead_type}`
    );

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
}
