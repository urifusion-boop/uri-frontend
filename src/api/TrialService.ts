import { UriHttpClient } from '@/configs/http.config';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export interface TrialStatus {
  status: 'not_started' | 'active' | 'expired' | 'converted';
  hasUsedFreeTrial: boolean;
  startDate?: string;
  endDate?: string;
  daysRemaining: number;
  usage: {
    leadsGenerated: number;
    maxLeads: number;
    signalsUsed: number;
    maxSignals: number;
    accountsTracked: number;
    maxAccountTrackers: number;
    hashtagsTracked: number;
    maxHashtagTrackers: number;
    keywordsTracked: number;
    maxKeywordTrackers: number;
    reportsGenerated: number;
    maxReports: number;
  };
}

export interface TrialActivationResponse {
  userId: string;
  trialStatus: string;
  trialStartDate: string;
  trialEndDate: string;
  daysRemaining: number;
  accessToken?: string;
  refreshToken?: string;
}

export class TrialService {
  /**
   * Activate 7-day free trial for user
   */
  static async activateTrial(userId: string): Promise<UriResponse<TrialActivationResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<TrialActivationResponse>>> = await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/trial/activate/${userId}`);
    return response.data;
  }

  /**
   * Get trial status and usage for user
   */
  static async getTrialStatus(userId: string): Promise<UriResponse<TrialStatus>> {
    const response: Awaited<AxiosResponse<UriResponse<TrialStatus>>> = await UriHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/trial/status/${userId}`);
    return response.data;
  }

  /**
   * Mark trial as converted to paid subscription
   */
  static async convertTrial(userId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/trial/convert/${userId}`);
    return response.data;
  }
}
