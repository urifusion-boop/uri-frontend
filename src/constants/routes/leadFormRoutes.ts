import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ILeadFormApi =
  | 'organizationSearchCreate'
  | 'organizationSearchUpdate'
  | 'personSearchCreate'
  | 'personSearchUpdate'
  | 'businessLeadFormCreate'
  | 'businessLeadFormUpdate'
  | 'conversationalSearchCreate'
  | 'conversationalSearchUpdate'
  | 'conversationalSearchFetchLeads'
  | 'conversationalSearchJobStatus'
  | 'getById'
  | 'getByUserId'
  | 'update'
  | 'getByFilters'
  | 'delete'
  | 'autoPopulate'
  | 'generateJobKeywords';

const rawLeadFormApiRoutes: Record<ILeadFormApi, string> = {
  organizationSearchCreate: '/lead-forms/organization-search/create',
  organizationSearchUpdate: '/lead-forms/organization-search/update',
  personSearchCreate: '/lead-forms/person-search/create',
  personSearchUpdate: '/lead-forms/person-search/update',
  businessLeadFormCreate: '/lead-forms/business-search/create',
  businessLeadFormUpdate: '/lead-forms/business-search/update',
  conversationalSearchCreate: '/lead-forms/conversation-search/create',
  conversationalSearchUpdate: '/lead-forms/conversation-search/update',
  conversationalSearchFetchLeads: '/lead-forms/conversation-search/fetch-leads',
  conversationalSearchJobStatus: '/lead-forms/conversation-search/job-status',
  getById: '/lead-forms/getById',
  getByUserId: '/lead-forms/getByUserId',
  getByFilters: '/lead-forms/getByFilters',
  update: '/lead-forms/update',
  delete: '/lead-forms/delete',
  autoPopulate: '/lead-forms/auto-populate',
  generateJobKeywords: '/lead-forms/generate-job-keywords',
};

export const leadFormApiRoutes: Record<ILeadFormApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawLeadFormApiRoutes);
