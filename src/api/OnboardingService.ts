import { UriHttpClient } from '@/configs/http.config';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';

export interface OnboardingStatus {
  onboardingCompleted: boolean;
  onboardingStep: number;
  selectedModules: string[];
  skipOnboarding: boolean;
  lastAccessedModule?: string;
  lastAccessedModuleAt?: string;
  primaryWorkflow?: string;
  primaryModule?: string;
  enabledWorkflows?: string[];
  enabledModules?: string[];
}

export interface SaveWorkflowDto {
  workflow: string;
}

export interface CompleteOnboardingDto {
  primaryWorkflow: string;
  primaryModule: string;
  enabledModules: string[];
}

export interface CompleteOnboardingResponse {
  onboardingCompleted: boolean;
  primaryWorkflow: string;
  primaryModule: string;
  enabledWorkflows: string[];
  enabledModules: string[];
  redirectTo: string;
  tourKey: string;
}

export interface UpdateStepDto {
  step: number;
}

export class OnboardingService {
  static async getOnboardingStatus(userId: string): Promise<UriResponse<OnboardingStatus>> {
    const response: Awaited<AxiosResponse<UriResponse<OnboardingStatus>>> =
      await UriHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/onboarding/${userId}/status`);
    return response.data;
  }

  static async completeOnboarding(userId: string, data: CompleteOnboardingDto): Promise<UriResponse<CompleteOnboardingResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<CompleteOnboardingResponse>>> =
      await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/onboarding/${userId}/complete`, data);
    return response.data;
  }

  static async skipOnboarding(userId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/onboarding/${userId}/skip`, {});
    return response.data;
  }

  static async updateOnboardingStep(userId: string, data: UpdateStepDto): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().put(`${BackendUrlEnum.BACKEND}/onboarding/${userId}/step`, data);
    return response.data;
  }

  static async saveWorkflow(userId: string, data: SaveWorkflowDto): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/onboarding/${userId}/workflow`, data);
    return response.data;
  }

  static async saveBusinessDetails(
    userId: string,
    data: {
      yourName: string;
      email: string;
      phoneNumber: string;
      businessName: string;
      industry: string;
      otherIndustry?: string;
      businessLocation: string;
      whatYouSell: string;
      customerType: string;
      leadTypes: string[];
      biggestGoals: string[];
      biggestChallenge?: string;
      currentTools?: string;
    }
  ): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().post(`${BackendUrlEnum.BACKEND}/onboarding/${userId}/business-details`, data);
    return response.data;
  }
}
