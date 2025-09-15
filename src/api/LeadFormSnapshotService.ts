import { UriHttpClient } from '@/configs/http.config';
import { leadFormSnapshotApiRoutes } from '@/constants/routes/leadFormSnapshotApiRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import { LeadFormSnapshotDto, LeadFormSnapshotGetByFiltersDto } from '@/models/dtos/LeadFormSnapshotDto';
import { FormSnapshotResponseDto } from '@/models/dtos/LeadsDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class LeadFormSnapshotService {
  static async getByFilters(data: LeadFormSnapshotGetByFiltersDto): Promise<UriResponse<FormSnapshotResponseDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<FormSnapshotResponseDto>>> = await UriHttpClient.getClient().get(`${leadFormSnapshotApiRoutes.getByFilters}?${queryString}`);
    return response.data;
  }

  static async getById(lead_form_snapshot_id: string): Promise<UriResponse<LeadFormSnapshotDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormSnapshotDto>>> = await UriHttpClient.getClient().get(`${leadFormSnapshotApiRoutes.getById}?${lead_form_snapshot_id}`);

    return response.data;
  }

  static async getLatestSnapshot(data: LeadFormSnapshotGetByFiltersDto): Promise<UriResponse<LeadFormSnapshotDto>> {
    const queryString = ObjectHelper.filterMap(data);
    const response: Awaited<AxiosResponse<UriResponse<LeadFormSnapshotDto>>> = await UriHttpClient.getClient().get(`${leadFormSnapshotApiRoutes.getLatestSnapshot}?${queryString}`);
    return response.data;
  }

  static async getByLeadFormId(lead_form_id: string): Promise<UriResponse<LeadFormSnapshotDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormSnapshotDto>>> = await UriHttpClient.getClient().get(`${leadFormSnapshotApiRoutes.getByLeadFormId}?${lead_form_id}`);
    return response.data;
  }

  static async deleteLeadFormSnapshot(lead_form_snapshot_id: string): Promise<UriResponse<LeadFormSnapshotDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadFormSnapshotDto>>> = await UriHttpClient.getClient().delete(`${leadFormSnapshotApiRoutes.delete}?${lead_form_snapshot_id}`);

    return response.data;
  }
}
