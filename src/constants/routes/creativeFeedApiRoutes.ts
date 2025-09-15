import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ICreativeFeedApi =
  | "createFeed"
  | "updateFeed"
  | "getFeedByUserId"
  | "deleteFeed";

const rawCreativeFeedApiRoutes: Record<ICreativeFeedApi, string> = {
  createFeed: "/creative/feed/create",
  updateFeed: "/creative/feed/update",
  getFeedByUserId: "/creative/feed/getByUserId",
  deleteFeed: "/creative/feed/delete",
};

export const creativeFeedApiRoutes: Record<ICreativeFeedApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawCreativeFeedApiRoutes);
