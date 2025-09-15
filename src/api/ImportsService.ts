import { UriHttpClient } from '@/configs/http.config';
import { importsRoutes } from '@/constants/routes/importsRoutes';
import { LeadImportConfirmDto, LeadImportDto, LeadImportResponseDto } from '@/models/dtos/LeadImportDto';
import { ImportTypeEnum } from '@/models/enum-models/ImportTypeEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class ImportsService {
  static async uploadLeadsFile(importDto: LeadImportDto): Promise<UriResponse<LeadImportResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadImportResponseDto>>> = await UriHttpClient.getClient().post(`${importsRoutes.uploadLeads}/${importDto.userId}`, importDto.formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  static async getImportStatus(userId: string, importType: ImportTypeEnum): Promise<UriResponse<{ progress: number; status: string }>> {
    const response: Awaited<AxiosResponse<UriResponse<{ progress: number; status: string }>>> = await UriHttpClient.getClient().get(`${importsRoutes.status}/${userId}?importType=${importType}`);
    return response.data;
  }

  static async confirmImport(confirmDto: LeadImportConfirmDto): Promise<UriResponse<LeadImportResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LeadImportResponseDto>>> = await UriHttpClient.getClient().post(`${importsRoutes.confirm}`, confirmDto);
    return response.data;
  }
}
