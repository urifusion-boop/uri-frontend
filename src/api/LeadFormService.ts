import { UriHttpClient } from '@/configs/http.config';
import { leadFormApiRoutes } from '@/constants/routes/leadFormRoutes';
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
}
