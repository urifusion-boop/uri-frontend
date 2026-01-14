import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_TRANSACTIONS_SVC_PATH = BackendUrlEnum.TRANSACTIONS;

type ISubscriptionPlanApi = 'getById' | 'getByFilters';

const rawSubscriptionPlanRoutes: Record<ISubscriptionPlanApi, string> = {
  getById: '/subscriptionPlans/getBySubscriptionPlanId',
  getByFilters: '/subscriptionPlans/getByFilters',
};

export const subscriptionPlanRoutes = RouteHelper.createRoutes(URI_TRANSACTIONS_SVC_PATH, rawSubscriptionPlanRoutes);
