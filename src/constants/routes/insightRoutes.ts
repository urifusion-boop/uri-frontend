import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IInsightApi = 
    | "getInstagramInsights"
    | "instagramHashtagSearch"
    | "instagramBusinessDiscovery"
    | "instagramTags"
    | "instagramMentions"
    | "searchDynamicKeywords";

export const rawInsightApiRoutes: Record<IInsightApi, string> = {
    getInstagramInsights: "/instagram/insights",
    instagramHashtagSearch: "/instagram/hashtag-search",
    instagramBusinessDiscovery: "/instagram/business-discovery",
    instagramTags: "/instagram/tags",
    instagramMentions: "/instagram/mentions",
    searchDynamicKeywords: "/google/search_dynamic_keywords"
};

export const insightApiRoutes: Record<IInsightApi, string> =
    RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawInsightApiRoutes);
