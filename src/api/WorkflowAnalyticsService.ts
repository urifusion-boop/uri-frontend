import { UriHttpClient } from '@/configs/http.config';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export interface WorkflowStats {
  _id: string;
  count: number;
  uniqueUsers: number;
}

export interface UserWorkflowStats {
  totalWorkflowChanges: number;
  currentWorkflows: string[];
  workflowHistory: {
    workflowId: string;
    addedCount: number;
    removedCount: number;
    lastAction: string;
    lastActionDate: string;
  }[];
}

export interface WorkflowTrend {
  _id: string;
  date: string;
  count: number;
}

export class WorkflowAnalyticsService {
  static async getWorkflowStats(startDate?: string, endDate?: string): Promise<UriResponse<WorkflowStats[]>> {
    let url = '/api/v1/workflow-analytics/workflow-stats';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response: Awaited<AxiosResponse<UriResponse<WorkflowStats[]>>> =
      await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getAdoptionTrend(days: number = 30): Promise<UriResponse<WorkflowTrend[]>> {
    const response: Awaited<AxiosResponse<UriResponse<WorkflowTrend[]>>> =
      await UriHttpClient.getClient().get(`/api/v1/workflow-analytics/adoption-trend?days=${days}`);
    return response.data;
  }

  static async getModuleStats(workflowId?: string): Promise<UriResponse<any>> {
    let url = '/api/v1/workflow-analytics/module-stats';
    if (workflowId) url += `?workflowId=${workflowId}`;

    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async getUserWorkflowStats(userId: string): Promise<UriResponse<UserWorkflowStats>> {
    const response: Awaited<AxiosResponse<UriResponse<UserWorkflowStats>>> =
      await UriHttpClient.getClient().get(`/api/v1/workflow-analytics/user/${userId}`);
    return response.data;
  }
}
