import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_TRANSACTIONS_SVC_PATH = BackendUrlEnum.TRANSACTIONS;

type ITransactionsApi = "verify" | "getByFilters";

const rawTransactionsRoutes: Record<ITransactionsApi, string> = {
  verify: "/transaction/verify",
  getByFilters: "/transaction/getByFilters",
};

export const transactionsRoutes: Record<ITransactionsApi, string> =
  RouteHelper.createRoutes(URI_TRANSACTIONS_SVC_PATH, rawTransactionsRoutes);
