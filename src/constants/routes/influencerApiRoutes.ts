import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IInfluencerApi =
  | "create"
  | "getById"
  | "getByFilters"
  | "update"
  | "delete";

export const rawInfluencerApiRoutes: Record<IInfluencerApi, string> = {
  create: "/influencer/create",
  getById: "/influencer/getById",
  getByFilters: "/influencer/getByFilters",
  update: "/influencer/update",
  delete: "/influencer/delete",
};

export const influencerApiRoutes: Record<IInfluencerApi, string> =
  RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawInfluencerApiRoutes);
