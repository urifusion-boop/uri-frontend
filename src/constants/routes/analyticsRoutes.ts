import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IAnalyticsApi =
  | "getTotalCreatives"
  | "getTotalClients"
  | "getCreativeViewsCountByCreativeId"
  | "getClientViewsCountByClientId";

const rawAnalyticsRoutes: Record<IAnalyticsApi, string> = {
  getTotalCreatives: "/analytics/getTotalCreatives",
  getTotalClients: "/analytics/getTotalClients",
  getCreativeViewsCountByCreativeId:
    "/analytics/getCreativeViewsCountByCreativeId",
  getClientViewsCountByClientId: "/analytics/getClientViewsCountByClientId",
};

export const analyticsRoutes: Record<IAnalyticsApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawAnalyticsRoutes);
