import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ITrackerApi =
  | "create"
  | "getById"
  | "getByFilters"
  | "update"
  | "track"
  | "delete"
  | "sentiments"
  | "postType"
  | "topCountries"
  | "topLanguages"
  | "dailyFrequency"
  | "topWords"
  | "topPlatforms"
  | "influencers"
  | "posts"
  | "aiConversationsInsights"
  | "sentimentOverTime";

export const rawKeywordTrackerApiRoutes: Record<ITrackerApi, string> = {
  create: "/keyword/create",
  getById: "/keyword/getById",
  getByFilters: "/keyword/getByFilters",
  update: "/keyword/update",
  track: "/keyword/web/track",
  delete: "/keyword/delete",
  sentiments: "/keyword/web/sentiments",
  postType: "/keyword/web/post-type",
  topCountries: "/keyword/web/top-countries",
  topLanguages: "/keyword/top-languages",
  dailyFrequency: "/keyword/web/daily-frequency",
  topWords: "/keyword/web/top-words",
  topPlatforms: "/keyword/web/top-platforms",
  influencers: "/keyword/twitter/influencers",
  posts: "/keyword/twitter/posts",
  aiConversationsInsights: "/keyword/twitter/ai-conversation-insights",
  sentimentOverTime: "/keyword/sentiments/time/insight",
};

export const keywordTrackerApiRoutes: Record<ITrackerApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawKeywordTrackerApiRoutes);
