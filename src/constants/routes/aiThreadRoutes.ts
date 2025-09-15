import { RouteHelper } from "../../helpers/RouteHelper";
import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IAiThreadApi = "create" | "getById" | "getByFilters" | "update" | "delete";

const rawAiThreadRoutes: Record<IAiThreadApi, string> = {
  create: "/ai-thread/create",
  getById: "/ai-thread/getById",
  getByFilters: "/ai-thread/getByFilters",
  update: "/ai-thread/update",
  delete: "/ai-thread/delete",
};

export const aiThreadRoutes: Record<IAiThreadApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawAiThreadRoutes);
