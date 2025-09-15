import { RouteHelper } from "../../helpers/RouteHelper";
import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFeedbackApi =
  | "create"
  | "getByFeedbackId"
  | "getByFilters"
  | "getByUserId";

const rawFeedbackRoutes: Record<IFeedbackApi, string> = {
  create: "/feedback/create",
  getByFeedbackId: "/feedback/getById",
  getByFilters: "/feedback/getFeedbacksByFilters",
  getByUserId: "/feedback/user",
};

export const feedbackRoutes: Record<IFeedbackApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawFeedbackRoutes);
