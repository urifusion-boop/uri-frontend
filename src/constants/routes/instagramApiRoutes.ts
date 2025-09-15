import { RouteHelper } from "../../helpers/RouteHelper";
import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;
const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IInstagramApi =
  | "getAuthUrl"
  | "getAccessToken"
  | "getUserProfile"
  | "getUserMedia"
  | "getUserInsights"
  | "connect"
  | "disconnect"
  | "getInstagramInsights"
  | "updateInstagramInsights"
  | "deleteInstagramInsights"
  | "getInstagramInsightsByIgUserId"
  | "searchInstagramHashtag"
  | "businessDiscovery"
  | "fetchBusinessTags"
  | "fetchBusinessMentions"
  | "instagramTrackKeyword";

type IInstagramInsightApi =
  | "getInstagramInsights"
  | "updateInstagramInsights"
  | "deleteInstagramInsights"
  | "getInstagramInsightsByIgUserId"
  | "searchInstagramHashtag"
  | "businessDiscovery"
  | "fetchBusinessTags"
  | "fetchBusinessMedia"
  | "fetchBusinessStories"
  | "fetchBusinessMentions"
  | "instagramTrackKeyword"
  | "saveInstagramandFacebookAccount"
  | "getInstagramHashtag"
  | "getInstagramCommentSentimentInsights"
  | "getInstagramDemographicMetricInsights"
  | "getInstagramDemographics"
  | "getInstagramMediaPostInsights"
  | "fetchInstagramUserInteractionMetics"
  | "fetchInstagramAiMediaReport";

const rawInstagramRoutes: Record<IInstagramApi, string> = {
  getAuthUrl: "/instagram/getAuthUrl",
  connect: "/instagram/connect",
  getAccessToken: "/instagram/getAccessToken",
  getUserProfile: "/instagram/getUserProfile",
  getUserMedia: "/instagram/getInstagramMedia",
  getUserInsights: "/instagram/getUserInsights",
  disconnect: "/instagram/disconnect",
  getInstagramInsightsByIgUserId: "/instagram",
  updateInstagramInsights: "/instagram",
  deleteInstagramInsights: "/instagram",
  getInstagramInsights: "/instagram/insights",
  searchInstagramHashtag: "/instagram/hashtag-search",
  businessDiscovery: "/instagram/business-discovery",
  fetchBusinessTags: "/instagram/tags",
  fetchBusinessMentions: "/instagram/mentions",
  instagramTrackKeyword: "/instagram/keyword-tracking",
};

const rawInstagramInsightRoutes: Record<IInstagramInsightApi, string> = {
  getInstagramInsightsByIgUserId: "/instagram",
  updateInstagramInsights: "/instagram",
  deleteInstagramInsights: "/instagram",
  getInstagramInsights: "/instagram/insights",
  searchInstagramHashtag: "/instagram/hashtag-search",
  businessDiscovery: "/instagram/business-discovery",
  fetchBusinessTags: "/instagram/tags",
  fetchBusinessMedia: "/instagram/media",
  fetchBusinessStories: "/instagram/stories",
  fetchBusinessMentions: "/instagram/mentions",
  instagramTrackKeyword: "/instagram/keyword-tracking",
  saveInstagramandFacebookAccount: "/instagram/save-instagram-account",
  getInstagramHashtag: "/instagram/tags",
  getInstagramCommentSentimentInsights: "/instagram/media/comment-sentiment",
  getInstagramDemographicMetricInsights:
    "/instagram/user/insights/demographic-metrics",
  getInstagramDemographics: "/instagram/user/insights/demographic-metrics",
  getInstagramMediaPostInsights: "/instagram/media/no-breakdown/post_insights",
  fetchInstagramUserInteractionMetics:
    "/instagram/user/insights/interaction-metrics",
  fetchInstagramAiMediaReport: "/instagram/ai-media-report",
};

export const instagramRoutes: Record<IInstagramApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawInstagramRoutes);

export const instagramInsightRoutes: Record<IInstagramInsightApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawInstagramInsightRoutes);
