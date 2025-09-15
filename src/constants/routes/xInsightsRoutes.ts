import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type XInsightsApi =
  | "searchAllTweets"
  | "track"
  | "topCountries"
  | "sentiments"
  | "businessDiscovery"
  | "saveTwitterAccount";

const rawXInsightsApiRoutes: Record<XInsightsApi, string> = {
  searchAllTweets: "/x-insights/tweets/search",
  track: "/keyword/twitter/track",
  topCountries: "/keyword/twitter/top-countries",
  sentiments: "/keyword/twitter/sentiments",
  businessDiscovery: "/x-insights/business-discovery",
  saveTwitterAccount: "/x-insights/save-twitter-account",
};

export const xInsightsApiRoutes: Record<XInsightsApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawXInsightsApiRoutes);
