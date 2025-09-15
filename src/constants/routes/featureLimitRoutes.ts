import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.TASK_MANAGER;

type IFeatureLimitApi = 'getUserFeatureLimit';

export const rawFeatureLimitApiRoutes: Record<IFeatureLimitApi, string> = {
  getUserFeatureLimit: '/feature-limit/getByUserId',
};

export const featureLimitApiRoutes: Record<IFeatureLimitApi, string> = RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawFeatureLimitApiRoutes);
