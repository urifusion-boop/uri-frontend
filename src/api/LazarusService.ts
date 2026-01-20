import { UriHttpClient } from '@/configs/http.config';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import {
  AddCompanyMonitorResponse,
  AddFocusContactResponse,
  BulkUploadResponse,
  CompanyMonitor,
  CompanyMonitorCreate,
  CSVUploadRow,
  FocusContact,
  FocusContactCreate,
  LazarusAlert,
  LazarusAlertStatus,
  LazarusMetrics,
  LazarusMonitoringStatus,
  LazarusSlots,
  MarkDeadResponse,
  ResurrectLeadResponse,
  ScanResponse,
} from '@/types/lazarus.types';
import { AxiosResponse } from 'axios';

const BASE_PATH = `${BackendUrlEnum.INSIGHTS}/api/lazarus`;

export class LazarusService {
  // ============ FOCUS CONTACTS ============
  static async addFocusContact(userId: string, contact: FocusContactCreate, sourceLeadId?: string): Promise<UriResponse<AddFocusContactResponse>> {
    const url = sourceLeadId ? `${BASE_PATH}/focus-contacts/add?user_id=${userId}&source_lead_id=${sourceLeadId}` : `${BASE_PATH}/focus-contacts/add?user_id=${userId}`;

    const response: AxiosResponse<UriResponse<AddFocusContactResponse>> = await UriHttpClient.getClient().post(url, contact);
    return response.data;
  }

  static async getFocusContacts(userId: string, status?: LazarusMonitoringStatus, skip: number = 0, limit: number = 50): Promise<UriResponse<FocusContact[]>> {
    let url = `${BASE_PATH}/focus-contacts?user_id=${userId}&skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response: AxiosResponse<UriResponse<FocusContact[]>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async removeFocusContact(userId: string, focusId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().delete(`${BASE_PATH}/focus-contacts/${focusId}?user_id=${userId}`);
    return response.data;
  }

  static async pauseFocusContact(userId: string, focusId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().put(`${BASE_PATH}/focus-contacts/${focusId}/pause?user_id=${userId}`);
    return response.data;
  }

  static async resumeFocusContact(userId: string, focusId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().put(`${BASE_PATH}/focus-contacts/${focusId}/resume?user_id=${userId}`);
    return response.data;
  }

  static async updateFocusContactScanFrequency(userId: string, focusId: string, scanFrequencyDays: number): Promise<UriResponse<{ scan_frequency_days: number }>> {
    const url = `${BASE_PATH}/focus-contacts/${focusId}/scanfrequency?user_id=${userId}&scan_frequency_days=${scanFrequencyDays}`;
    console.log('🔍 [LAZARUS] updateFocusContactScanFrequency URL:', url);
    console.log('🔍 [LAZARUS] BASE_PATH:', BASE_PATH);
    console.log('🔍 [LAZARUS] Full URL will be:', window.location.origin + url);
    const response: AxiosResponse<UriResponse<{ scan_frequency_days: number }>> = await UriHttpClient.getClient().put(url);
    return response.data;
  }

  // ============ COMPANY MONITORS ============
  static async addCompanyMonitor(userId: string, monitor: CompanyMonitorCreate, sourceLeadId?: string): Promise<UriResponse<AddCompanyMonitorResponse>> {
    const url = sourceLeadId ? `${BASE_PATH}/company-monitors/add?user_id=${userId}&source_lead_id=${sourceLeadId}` : `${BASE_PATH}/company-monitors/add?user_id=${userId}`;

    const response: AxiosResponse<UriResponse<AddCompanyMonitorResponse>> = await UriHttpClient.getClient().post(url, monitor);
    return response.data;
  }

  static async getCompanyMonitors(userId: string, status?: LazarusMonitoringStatus, skip: number = 0, limit: number = 50): Promise<UriResponse<CompanyMonitor[]>> {
    let url = `${BASE_PATH}/company-monitors?user_id=${userId}&skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response: AxiosResponse<UriResponse<CompanyMonitor[]>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async removeCompanyMonitor(userId: string, monitorId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().delete(`${BASE_PATH}/company-monitors/${monitorId}?user_id=${userId}`);
    return response.data;
  }

  static async updateCompanyMonitorScanFrequency(userId: string, monitorId: string, scanFrequencyDays: number): Promise<UriResponse<{ scan_frequency_days: number }>> {
    const response: AxiosResponse<UriResponse<{ scan_frequency_days: number }>> = await UriHttpClient.getClient().put(
      `${BASE_PATH}/company-monitors/${monitorId}/scanfrequency?user_id=${userId}&scan_frequency_days=${scanFrequencyDays}`
    );
    return response.data;
  }

  // ============ BULK CSV UPLOAD ============
  static async bulkUploadCSV(userId: string, csvRows: CSVUploadRow[]): Promise<UriResponse<BulkUploadResponse>> {
    const response: AxiosResponse<UriResponse<BulkUploadResponse>> = await UriHttpClient.getClient().post(`${BASE_PATH}/bulk-upload?user_id=${userId}`, csvRows);
    return response.data;
  }

  // ============ AI KEYWORD EXTRACTION ============
  static async extractKeywords(
    userId: string,
    data: {
      name?: string;
      bio?: string;
      company?: string;
      title?: string;
      recent_post?: string;
      signal_types?: string[];
    }
  ): Promise<UriResponse<{ keywords: string[]; confidence: number; reasoning?: string }>> {
    const response: AxiosResponse<UriResponse<{ keywords: string[]; confidence: number; reasoning?: string }>> = await UriHttpClient.getClient().post(
      `${BASE_PATH}/extract-keywords?user_id=${userId}`,
      data
    );
    return response.data;
  }

  // ============ ALERTS ============
  static async getAlerts(userId: string, status?: LazarusAlertStatus, skip: number = 0, limit: number = 50): Promise<UriResponse<LazarusAlert[]>> {
    let url = `${BASE_PATH}/alerts?user_id=${userId}&skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response: AxiosResponse<UriResponse<LazarusAlert[]>> = await UriHttpClient.getClient().get(url);
    return response.data;
  }

  static async markAlertContacted(userId: string, alertId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().put(`${BASE_PATH}/alerts/${alertId}/contacted?user_id=${userId}`);
    return response.data;
  }

  static async dismissAlert(userId: string, alertId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().put(`${BASE_PATH}/alerts/${alertId}/dismiss?user_id=${userId}`);
    return response.data;
  }

  // ============ SLOTS & METRICS ============
  static async getUserSlots(userId: string): Promise<UriResponse<LazarusSlots>> {
    const response: AxiosResponse<UriResponse<LazarusSlots>> = await UriHttpClient.getClient().get(`${BASE_PATH}/slots?user_id=${userId}`);
    return response.data;
  }

  static async getUserMetrics(userId: string): Promise<UriResponse<LazarusMetrics>> {
    const response: AxiosResponse<UriResponse<LazarusMetrics>> = await UriHttpClient.getClient().get(`${BASE_PATH}/metrics?user_id=${userId}`);
    return response.data;
  }

  static async upgradeToPro(userId: string): Promise<UriResponse<{ max_slots: number; plan_type: string }>> {
    const response: AxiosResponse<UriResponse<{ max_slots: number; plan_type: string }>> = await UriHttpClient.getClient().post(`${BASE_PATH}/upgrade-to-pro?user_id=${userId}`);
    return response.data;
  }

  // ============ LEAD INTEGRATION ============
  static async markLeadAsDead(userId: string, leadId: string, reason: string, autoMonitor: boolean = false): Promise<UriResponse<MarkDeadResponse>> {
    const response: AxiosResponse<UriResponse<MarkDeadResponse>> = await UriHttpClient.getClient().put(
      `${BASE_PATH}/leads/${leadId}/mark-dead?user_id=${userId}&reason=${encodeURIComponent(reason)}&auto_monitor=${autoMonitor}`
    );
    return response.data;
  }

  static async resurrectLead(userId: string, leadId: string, alertType: string): Promise<UriResponse<ResurrectLeadResponse>> {
    const response: AxiosResponse<UriResponse<ResurrectLeadResponse>> = await UriHttpClient.getClient().put(`${BASE_PATH}/leads/${leadId}/resurrect?user_id=${userId}&alert_type=${alertType}`);
    return response.data;
  }

  // ============ BACKGROUND SCANNING ============
  static async runWeeklyScan(): Promise<UriResponse<ScanResponse>> {
    const response: AxiosResponse<UriResponse<ScanResponse>> = await UriHttpClient.getClient().post(`${BASE_PATH}/scan/run-weekly`);
    return response.data;
  }

  static async scanFocusContacts(batchSize: number = 100): Promise<UriResponse<ScanResponse>> {
    const response: AxiosResponse<UriResponse<ScanResponse>> = await UriHttpClient.getClient().post(`${BASE_PATH}/scan/focus-contacts?batch_size=${batchSize}`);
    return response.data;
  }

  static async scanCompanyMonitors(batchSize: number = 100): Promise<UriResponse<ScanResponse>> {
    const response: AxiosResponse<UriResponse<ScanResponse>> = await UriHttpClient.getClient().post(`${BASE_PATH}/scan/company-monitors?batch_size=${batchSize}`);
    return response.data;
  }

  // ============ AUTO-DETECTION ============
  static async getAutoDetectionRules(userId: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().get(`${BASE_PATH}/auto-detection/rules?user_id=${userId}`);
    return response.data;
  }

  static async updateAutoDetectionRules(userId: string, rules: any): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().put(`${BASE_PATH}/auto-detection/rules?user_id=${userId}`, rules);
    return response.data;
  }

  static async triggerAutoDetectionScan(userId: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().post(`${BASE_PATH}/auto-detection/scan?user_id=${userId}`);
    return response.data;
  }

  static async getAutoDetectionHistory(userId: string, skip: number = 0, limit: number = 20): Promise<UriResponse<any[]>> {
    const response: AxiosResponse<UriResponse<any[]>> = await UriHttpClient.getClient().get(`${BASE_PATH}/auto-detection/history?user_id=${userId}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  // ============ ANALYTICS ============
  static async getAnalyticsData(userId: string, days: number = 30): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().get(`${BASE_PATH}/analytics?user_id=${userId}&days=${days}`);
    return response.data;
  }

  // ============ CRM INTEGRATION ============
  static async initiateCRMConnection(userId: string, crmType: 'hubspot' | 'salesforce'): Promise<UriResponse<{ authorization_url: string }>> {
    const response: AxiosResponse<UriResponse<{ authorization_url: string }>> = await UriHttpClient.getClient().post(`${BASE_PATH}/crm/connect/initiate?user_id=${userId}&crm_type=${crmType}`);
    return response.data;
  }

  // Priority 3: Private App connection
  static async connectPrivateApp(userId: string, crmType: 'hubspot' | 'salesforce', accessToken: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().post(
      `${BASE_PATH}/crm/connect/private-app?user_id=${userId}&crm_type=${crmType}&access_token=${encodeURIComponent(accessToken)}`
    );
    return response.data;
  }

  static async getCRMStatus(userId: string): Promise<UriResponse<any>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().get(`${BASE_PATH}/crm/status?user_id=${userId}`);
    return response.data;
  }

  static async disconnectCRM(userId: string): Promise<UriResponse<{ success: boolean; message: string }>> {
    const response: AxiosResponse<UriResponse<{ success: boolean; message: string }>> = await UriHttpClient.getClient().delete(`${BASE_PATH}/crm/disconnect?user_id=${userId}`);
    return response.data;
  }

  // Priority 3: Background sync support
  static async syncCRM(userId: string, background: boolean = false): Promise<UriResponse<{ contacts_added: number; companies_added: number; status?: string }>> {
    const response: AxiosResponse<UriResponse<any>> = await UriHttpClient.getClient().post(`${BASE_PATH}/crm/sync?user_id=${userId}&background=${background}`);
    return response.data;
  }

  // Priority 2: Sync logs viewer
  static async getCRMSyncLogs(userId: string, limit: number = 10): Promise<UriResponse<any[]>> {
    const response: AxiosResponse<UriResponse<any[]>> = await UriHttpClient.getClient().get(`${BASE_PATH}/crm/sync-logs?user_id=${userId}&limit=${limit}`);
    return response.data;
  }
}
