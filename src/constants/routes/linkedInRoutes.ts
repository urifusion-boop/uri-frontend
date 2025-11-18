import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ILinkedInApi = "fetchPosts";

const rawLinkedInApiRoutes: Record<ILinkedInApi, string> = {
  fetchPosts: "/openai-apify-linkedin/fetch-posts",
};

export const linkedinApiRoutes = RouteHelper.createRoutes(
  URI_INSIGHTS_SVC_PATH,
  rawLinkedInApiRoutes
) as Record<ILinkedInApi, string>;
