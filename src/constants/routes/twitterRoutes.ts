import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;
const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ITwitterApi =
  | "getAuthUrl"
  | "getAccessToken"
  | "getUserData"
  | "connect"
  | "disconnect"
  | "fetchTweets";

const rawTwitterApiRoutes: Record<Exclude<ITwitterApi, "fetchTweets">, string> = {
  getAuthUrl: "/twitter/getAuthUrl",
  getAccessToken: "/twitter/getAccessToken",
  getUserData: "/twitter/getUserData",
  connect: "/twitter/connect",
  disconnect: "/twitter/disconnect",
};

const backendRoutes = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawTwitterApiRoutes);

export const twitterApiRoutes = {
  ...backendRoutes,
  fetchTweets: `${URI_INSIGHTS_SVC_PATH}/openai-apify-twitter/fetch-tweets`,
} as Record<ITwitterApi, string>;
