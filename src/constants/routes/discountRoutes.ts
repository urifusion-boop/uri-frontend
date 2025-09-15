import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_TRANSACTIONS_SVC_PATH = BackendUrlEnum.TRANSACTIONS;

type IDiscountApi = 'getDiscountByCode';

const rawAuthRoutes: Record<IDiscountApi, string> = {
  getDiscountByCode: '/discountCodes/getByCode',
};

export const discountRoutes: Record<IDiscountApi, string> = RouteHelper.createRoutes(URI_TRANSACTIONS_SVC_PATH, rawAuthRoutes);
