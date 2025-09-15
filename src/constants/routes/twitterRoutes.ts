import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ITwitterApi =
  | "getAuthUrl"
  | "getAccessToken"
  | "getUserData"
  | "connect"
  | "disconnect";

const rawTwitterApiRoutes: Record<ITwitterApi, string> = {
  getAuthUrl: "/twitter/getAuthUrl",
  getAccessToken: "/twitter/getAccessToken",
  getUserData: "/twitter/getUserData",
  connect: "/twitter/connect",
  disconnect: "/twitter/disconnect",
};

export const twitterApiRoutes: Record<ITwitterApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawTwitterApiRoutes);
