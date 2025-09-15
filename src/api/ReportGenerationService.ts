import { UriHttpClient } from '@/configs/http.config';
import { reportGenerationApiRoutes } from '@/constants/routes/reportGenerationRoutes';
import { AccountTrackingReportDto, GenerateReportDto, HashtagTrackingReportDto } from '@/models/dtos/ReportDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class ReportGenerationService {
  static async generateReport(data: GenerateReportDto): Promise<UriResponse<GenerateReportDto>> {
    const response: Awaited<AxiosResponse<UriResponse<GenerateReportDto>>> = await UriHttpClient.getClient().post(reportGenerationApiRoutes.generate, data);
    return response.data;
  }

  static async generateAccountTrackingReport(data: AccountTrackingReportDto): Promise<UriResponse<AccountTrackingReportDto>> {
    const response: Awaited<AxiosResponse<UriResponse<AccountTrackingReportDto>>> = await UriHttpClient.getClient().post(reportGenerationApiRoutes.accountTrackingGenerate, data);
    return response.data;
  }

  static async generateHashtagTrackingReport(data: HashtagTrackingReportDto): Promise<UriResponse<HashtagTrackingReportDto>> {
    const response: Awaited<AxiosResponse<UriResponse<HashtagTrackingReportDto>>> = await UriHttpClient.getClient().post(reportGenerationApiRoutes.hashtagTrackingGenerate, data);
    return response.data;
  }
}
