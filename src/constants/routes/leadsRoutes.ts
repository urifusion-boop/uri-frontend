import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ILeadsApi =
  | 'create'
  | 'multipleCreate'
  | 'getById'
  | 'getByFilters'
  | 'update'
  | 'updateStatus'
  | 'delete'
  | 'search'
  | 'generateLead'
  | 'createLeadBusiness'
  | 'getLeadBusinessByFilters'
  | 'updateLeadBusiness'
  | 'deleteLeadBusiness'
  | 'analytics'
  | 'deleteMany'
  | 'regenerateLeadFollowUpMessage'
  | 'exportReport'
  | 'star'
  | 'unstar'
  | 'enrich'
  | 'getUserBusinessDetails'
  | 'generateJobKeywords'
  | 'validateSearchContext'
  | 'findDecisionMakers'
  | 'markNextStepComplete'
  | 'nextStepsSummary';

const rawLeadsApiRoutes: Record<ILeadsApi, string> = {
  create: '/lead/create',
  multipleCreate: '/lead/multipleCreate',
  getById: '/lead/getById',
  getByFilters: '/lead/getByFilters',
  update: '/lead/update',
  updateStatus: '/lead/updateStatus',
  delete: '/lead/delete',
  search: '/lead/search',
  generateLead: '/lead/generate-lead',
  createLeadBusiness: '/lead/business-info/create',
  getLeadBusinessByFilters: '/lead/business-info/getByFilters',
  updateLeadBusiness: '/lead/business-info/update',
  deleteLeadBusiness: '/lead/business-info/delete',
  analytics: '/lead/analytics',
  deleteMany: '/lead/delete-many',
  regenerateLeadFollowUpMessage: '/lead/regenerate-lead-follow-up-message',
  exportReport: '/lead/export-lead',
  star: '/lead/star',
  unstar: '/lead/unstar',
  enrich: '/lead/enrich',
  getUserBusinessDetails: '/lead/user-business-details',
  generateJobKeywords: '/lead/generate-job-keywords',
  validateSearchContext: '/lead/validate-search-context',
  findDecisionMakers: '/lead/job-boards/:lead_id/find-decision-makers',
  markNextStepComplete: '/leads/:lead_id/next-steps/:step_id/complete',
  nextStepsSummary: '/leads/insights/next-steps-summary',
};

export const leadsApiRoutes: Record<ILeadsApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawLeadsApiRoutes);
