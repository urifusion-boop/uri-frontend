import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFeedApi =
  | "getFeedById"
  | "getFeedByFilters"
  | "likeFeed"
  | "unlikeFeed"
  | "viewSpotlightFeed";

const rawFeedApiRoutes: Record<IFeedApi, string> = {
  getFeedById: "/feed/getById",
  getFeedByFilters: "/feed/getByFilters",
  likeFeed: "/feed/likeFeed",
  unlikeFeed: "/feed/unlikeFeed",
  viewSpotlightFeed: "/feed/viewSpotlight",
};

export const feedApiRoutes: Record<IFeedApi, string> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawFeedApiRoutes
);
