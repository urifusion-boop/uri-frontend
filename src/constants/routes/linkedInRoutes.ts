import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ILinkedInApi =
  | "getAuthUrl"
  | "getAccessToken"
  | "getUserData"
  | "connect"
  | "disconnect"
  | "getCommMgtAuthUrl"
  | "connectCommMgt";

const rawLinkedInApiRoutes: Record<ILinkedInApi, string> = {
  getAuthUrl: "/linkedIn/getAuthUrl",
  getAccessToken: "/linkedIn/getAccessToken",
  getUserData: "/linkedIn/getUserData",
  connect: "/linkedIn/connect",
  disconnect: "/linkedIn/disconnect",
  getCommMgtAuthUrl: "/linkedInCommMgt/getAuthUrl",
  connectCommMgt: "/linkedInCommMgt/connect",
};

export const linkedInApiRoutes: Record<ILinkedInApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawLinkedInApiRoutes);
