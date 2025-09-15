import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ILinkedInInsightsApi =
  | "saveLinkedInAccount"
  | "retrieveOrganizationById"
  | "getAllLinkedinPosts"
  | "businessDiscovery"
  | "aiMediaReport"
  | "shareStatisticsLifeTime"
  | "shareStatisticsSpecificShare"
  | "shareStatisticsSpecificUgcPost"
  | "postsComments"
  | "getLinkedinFollowersStatics";

const rawLinkedInInsightsApiRoutes: Record<ILinkedInInsightsApi, string> = {
  saveLinkedInAccount: "/linkedin-insights/save-linkedin-account",
  retrieveOrganizationById:
    "/linkedin-insights/linkedin/community/organization",
  getAllLinkedinPosts: "/linkedin-insights/posts",
  businessDiscovery: "/linkedin-insights/linkedin/business-discovery",
  aiMediaReport: "/linkedin-insights/ai-media-report",
  shareStatisticsLifeTime:
    "/linkedin-insights/linkedin/community/share/statistics/life-time",
  shareStatisticsSpecificShare:
    "/linkedin-insights/linkedin/community/share/statistics/specific-share",
  shareStatisticsSpecificUgcPost:
    "/linkedin-insights/linkedin/community/share/statistics/specific-ugcpost",
  postsComments: "/linkedin-insights/posts/comments",
  getLinkedinFollowersStatics:
    "/linkedin-insights/linkedin/community/follower/statistics/time-bound",
};

export const linkedinInsightsApiRoutes: Record<ILinkedInInsightsApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawLinkedInInsightsApiRoutes);
