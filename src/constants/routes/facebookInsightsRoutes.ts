import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IFacebookInsightsApi =
  | "getBusinessDiscovery"
  | "getFacebookPageReels"
  | "getVideoInsights"
  | "getPostInsights"
  | "fetchUserFacebookPages"
  | "getFacebookPageInsights"
  | "searchFacebookPages"
  | "getFacebookVideoInsights"
  | "getFacebookPhotoInsights"
  | "getFacebookMentions"
  | "fetchFacebookAiMediaReport"
  | "getFacebookPost";

const rawFacebookInsightsApiRoutes: Record<IFacebookInsightsApi, string> = {
  getBusinessDiscovery: "/facebook-insights/business-discovery",
  getFacebookPageReels: "/facebook-insights/page/reels",
  getVideoInsights: "/facebook-insights/video/insights",
  getPostInsights: "/facebook-insights/post/insights",
  fetchUserFacebookPages: "/facebook-insights/pages",
  getFacebookPageInsights: "/facebook-insights/page/insights",
  searchFacebookPages: "/facebook-insights/pages/search",
  getFacebookVideoInsights: "/facebook-insights/videos/insights",
  getFacebookPhotoInsights: "/facebook-insights/photos/insights",
  getFacebookMentions: "/facebook-insights/page/mentions",
  fetchFacebookAiMediaReport: "/facebook-insights/ai-media-report",
  getFacebookPost: "/facebook-insights/page/posts",
};

export const facebookInsightsRoutes: Record<IFacebookInsightsApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawFacebookInsightsApiRoutes);
