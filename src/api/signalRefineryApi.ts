/**
 * Signal Refinery API Client
 *
 * Handles API calls to the Signal Refinery (X-Ray) backend
 */

import { UriHttpClient } from '@/configs/http.config';
import { signalRefineryRoutes } from '@/constants/routes/signalRefineryRoutes';
import { DorkQueryPreview, MetricsSummary, XRayLead, XRayPlatform, XRaySearchJob, XRaySearchRequest } from '../models/dtos/SignalRefineryDto';

export const signalRefineryApi = {
  /**
   * Start a new X-Ray search
   */
  startSearch: async (request: XRaySearchRequest): Promise<any> => {
    const response = await UriHttpClient.getClient().post(signalRefineryRoutes.search, request);
    // Backend returns UriResponse with responseData = { job_id, status, keyword, platforms }
    return response.data.responseData;
  },

  /**
   * Get job status (for polling)
   */
  getJobStatus: async (jobId: string): Promise<XRaySearchJob> => {
    const response = await UriHttpClient.getClient().get(`${signalRefineryRoutes.getJob}/${jobId}`);
    return response.data.responseData;
  },

  /**
   * List all jobs for user
   */
  listJobs: async (skip: number = 0, limit: number = 20): Promise<{ jobs: XRaySearchJob[]; total: number }> => {
    const response = await UriHttpClient.getClient().get(`${signalRefineryRoutes.listJobs}?skip=${skip}&limit=${limit}`);
    return {
      jobs: response.data.responseData,
      total: response.data.total_count || 0,
    };
  },

  /**
   * Get refined leads (buyers only)
   */
  getLeads: async (skip: number = 0, limit: number = 50): Promise<{ leads: XRayLead[]; total: number }> => {
    const response = await UriHttpClient.getClient().get(`${signalRefineryRoutes.getLeads}?skip=${skip}&limit=${limit}`);
    return {
      leads: response.data.responseData,
      total: response.data.total_count || 0,
    };
  },

  /**
   * Get aggregate metrics across all jobs
   */
  getMetricsSummary: async (): Promise<MetricsSummary> => {
    const response = await UriHttpClient.getClient().get(signalRefineryRoutes.getMetrics);
    return response.data.responseData;
  },

  /**
   * Preview dork queries (without executing search)
   */
  previewDorkQueries: async (keyword: string, platforms: XRayPlatform[], location: string = 'Nigeria'): Promise<DorkQueryPreview[]> => {
    // Backend expects query parameters, not JSON body
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    params.append('location', location);
    platforms.forEach((platform) => params.append('platforms', platform));

    const response = await UriHttpClient.getClient().post(`${signalRefineryRoutes.previewQuery}?${params.toString()}`);
    return response.data.responseData;
  },

  /**
   * Delete a job
   */
  deleteJob: async (jobId: string): Promise<void> => {
    await UriHttpClient.getClient().delete(`${signalRefineryRoutes.deleteJob}/${jobId}`);
  },
};
