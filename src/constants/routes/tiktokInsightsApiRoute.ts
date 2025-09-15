import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ITiktokInsightsApi = "searchTiktokHashtag" | "tiktokBusinessDiscovery";

const rawTiktokInsightsApiRoutes: Record<ITiktokInsightsApi, string> = {
  searchTiktokHashtag: "/tiktok-insights/hashtag-search",
  tiktokBusinessDiscovery: "/tiktok-insights/business-discovery",
};

export const tiktokInsightsApiRoutes: Record<ITiktokInsightsApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawTiktokInsightsApiRoutes);
