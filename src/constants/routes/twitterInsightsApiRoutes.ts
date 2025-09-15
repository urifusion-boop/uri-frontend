import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ITwitterInsightsApi = "search" | "metrics" | "engagements";

const rawInstagramRoutes: Record<ITwitterInsightsApi, string> = {
  search: "/twitter/twitter/search",
  metrics: "/twitter/twitter/metrics",
  engagements: "/twitter/twitter/engagements",
};

export const twitterInsightsRoutes: Record<ITwitterInsightsApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawInstagramRoutes);
