import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFacebookApi =
  | "getAuthUrl"
  | "getAccessToken"
  | "getUserData"
  | "connect"
  | "disconnect";

const rawFacebookApiRoutes: Record<IFacebookApi, string> = {
  getAuthUrl: "/facebook/getAuthUrl",
  getAccessToken: "/facebook/getAccessToken",
  getUserData: "/facebook/getUserData",
  connect: "/facebook/connect",
  disconnect: "/facebook/disconnect",
};

export const facebookApiRoutes: Record<IFacebookApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawFacebookApiRoutes);
