import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IReportGenApi = 'generate' | 'accountTrackingGenerate' | 'hashtagTrackingGenerate';

export const rawReportGenerationApiRoutes: Record<IReportGenApi, string> = {
  generate: '/report-generation/generate-report',
  accountTrackingGenerate: '/report/account-tracking/generate',
  hashtagTrackingGenerate: '/report/hashtag-tracking/generate',
};

export const reportGenerationApiRoutes: Record<IReportGenApi, string> = RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawReportGenerationApiRoutes);
