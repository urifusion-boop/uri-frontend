import { UriHttpClient } from '@/configs/http.config';
import { verificationApiRoutes } from '@/constants/routes/verificationApiRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { RequestOtpDto, VerifyOtpDto } from '../models/dtos/RequestOtpDto';

export class VerificationService {
  static async requestOtp(data: RequestOtpDto): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().post(`${verificationApiRoutes.requestOtp}`, data);
    return response.data;
  }

  static async verifyOtp(data: VerifyOtpDto): Promise<UriResponse<string>> {
    const response: Awaited<AxiosResponse<UriResponse<string>>> = await UriHttpClient.getClient().post(`${verificationApiRoutes.verifyOtp}`, data);
    return response.data;
  }
}
