import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ISpamLeadsApi = 'getSpamLeads' | 'getSpamLeadById' | 'promoteToLead' | 'moveToSpam' | 'getStats' | 'updateNotes' | 'deleteSpamLead' | 'bulkDeleteSpamLeads';

const rawSpamLeadsApiRoutes: Record<ISpamLeadsApi, string> = {
  getSpamLeads: '/lead/spam-leads',
  getSpamLeadById: '/lead/spam-leads/:spam_id',
  promoteToLead: '/lead/spam-leads/:spam_id/promote',
  moveToSpam: '/lead/leads/:lead_id/move-to-spam',
  getStats: '/lead/spam-leads/stats',
  updateNotes: '/lead/spam-leads/:spam_id/notes',
  deleteSpamLead: '/lead/spam-leads/:spam_id',
  bulkDeleteSpamLeads: '/lead/spam-leads/bulk-delete',
};

export const spamLeadsApiRoutes: Record<ISpamLeadsApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawSpamLeadsApiRoutes);
