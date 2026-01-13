import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ISignalRefineryApi = 'search' | 'getJob' | 'listJobs' | 'getLeads' | 'getMetrics' | 'previewQuery' | 'deleteJob';

const rawSignalRefineryRoutes: Record<ISignalRefineryApi, string> = {
  search: '/signal-refinery/search',
  getJob: '/signal-refinery/jobs',
  listJobs: '/signal-refinery/jobs',
  getLeads: '/signal-refinery/leads',
  getMetrics: '/signal-refinery/metrics',
  previewQuery: '/signal-refinery/preview-query',
  deleteJob: '/signal-refinery/jobs',
};

export const signalRefineryRoutes: Record<ISignalRefineryApi, string> = RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawSignalRefineryRoutes);
