import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_TRANSACTIONS_SVC_PATH = BackendUrlEnum.TRANSACTIONS;

type IWalletApi = 'fund' | 'verify' | 'deduct' | 'get';

const rawWalletRoutes: Record<IWalletApi, string> = {
  fund: '/wallet/fund',
  verify: '/wallet/verify',
  deduct: '/wallet/deduct',
  get: '/wallet',
};

export const walletRoutes: Record<IWalletApi, string> = RouteHelper.createRoutes(URI_TRANSACTIONS_SVC_PATH, rawWalletRoutes);
