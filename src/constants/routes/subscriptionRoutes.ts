import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_TRANSACTIONS_SVC_PATH = BackendUrlEnum.TRANSACTIONS;

type ISubscriptionApi = 'charge' | 'trial' | 'free' | 'getByPaystackId' | 'providerFilters' | 'getByEmail' | 'disable' | 'enable' | 'applyDiscount';

const rawSubscriptionRoutes: Record<ISubscriptionApi, string> = {
  charge: '/subscription/charge',
  trial: '/subscription/trial/subscribe',
  free: '/subscription/free/subscribe',
  getByPaystackId: '/subscription/getByPaystackId',
  providerFilters: '/subscription/providerFilters',
  getByEmail: '/subscription/getByEmail',
  disable: '/subscription/disable',
  enable: '/subscription/enable',
  applyDiscount: '/subscription/applyDiscount',
};

export const subscriptionRoutes: Record<ISubscriptionApi, string> = RouteHelper.createRoutes(URI_TRANSACTIONS_SVC_PATH, rawSubscriptionRoutes);
