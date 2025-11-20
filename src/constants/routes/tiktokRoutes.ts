import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;
const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ITiktokApi =
  | "getAuthUrl"
  | "getAccessToken"
  | "getUserData"
  | "connect"
  | "disconnect";

const rawTiktokApiRoutes: Record<ITiktokApi, string> = {
  getAuthUrl: "/tiktok/getAuthUrl",
  getAccessToken: "/tiktok/getAccessToken",
  getUserData: "/tiktok/getUserData",
  connect: "/tiktok/connect",
  disconnect: "/tiktok/disconnect",
};

export const tiktokApiRoutes: Record<ITiktokApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawTiktokApiRoutes);

type ITiktokInsightsApi =
  | "saveTiktokAccount"
  | "getTiktokMedia"
  | "getTiktokHashtagSearch"
  | "getTiktokBusinessDiscovery"
  | "getTiktokPosts";

const rawTiktokInsightsApiRoutes: Record<ITiktokInsightsApi, string> = {
  saveTiktokAccount: "/tiktok-insights/save-tiktok-account",
  getTiktokMedia: "/tiktok-insights/media",
  getTiktokHashtagSearch: "/tiktok-insights/hashtag-search",
  getTiktokBusinessDiscovery: "/tiktok-insights/business-discovery",
  getTiktokPosts: "/openai-apify-tiktok/fetch-posts",
};

export const tiktokInsightsApiRoutes: Record<ITiktokInsightsApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawTiktokInsightsApiRoutes);
