import { RouteHelper } from "../../helpers/RouteHelper";
import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IAiMessageApi = "create" | "getByThreadId" | "deleteAll";

const rawAiMessageRoutes: Record<IAiMessageApi, string> = {
  create: "/ai-message/create",
  getByThreadId: "/ai-message/getByThread",
  deleteAll: "/ai-message/deleteAll",
};

export const aiMessageRoutes: Record<IAiMessageApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawAiMessageRoutes);
