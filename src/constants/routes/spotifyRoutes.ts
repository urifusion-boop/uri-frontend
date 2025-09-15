import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISpotifyApi = "getAuthUrl" | "getAccessToken" | "getUserData";

const rawSpotifyApiRoutes: Record<ISpotifyApi, string> = {
  getAuthUrl: "/spotify/getAuthUrl",
  getAccessToken: "/spotify/getAccessToken",
  getUserData: "/spotify/getUserData",
};

export const spotifyApiRoutes: Record<ISpotifyApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawSpotifyApiRoutes);
