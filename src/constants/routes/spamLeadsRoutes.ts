import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ISpamLeadsApi = 'getSpamLeads' | 'getSpamLeadById' | 'promoteToLead' | 'moveToSpam' | 'getStats' | 'updateNotes';

const rawSpamLeadsApiRoutes: Record<ISpamLeadsApi, string> = {
  getSpamLeads: '/spam-leads',
  getSpamLeadById: '/spam-leads/:spam_id',
  promoteToLead: '/spam-leads/:spam_id/promote',
  moveToSpam: '/leads/:lead_id/move-to-spam',
  getStats: '/spam-leads/stats',
  updateNotes: '/spam-leads/:spam_id/notes',
};

export const spamLeadsApiRoutes: Record<ISpamLeadsApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawSpamLeadsApiRoutes);
