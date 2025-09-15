import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IMentionInsightsApi =
  | "getById"
  | "getByFilters"
  | "update"
  | "markAsRead"
  | "markAsStarred"
  | "delete"
  | "analytics";

const rawMentionInsightsApiRoutes: Record<IMentionInsightsApi, string> = {
  getById: "/mention-insights/getById",
  getByFilters: "/mention-insights/getByFilters",
  update: "/mention-insights/update",
  markAsRead: "/mention-insights/markAsRead",
  markAsStarred: "/mention-insights/markAsStarred",
  delete: "/mention-insights/delete",
  analytics: "/mention-insights/analytics",
};

export const mentionInsightsApiRoutes: Record<IMentionInsightsApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawMentionInsightsApiRoutes);
