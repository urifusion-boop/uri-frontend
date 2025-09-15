import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ILeaderBoardApi = "getByUserId" | "getByFilters";

const rawLeaderBoardApiRoutes: Record<ILeaderBoardApi, string> = {
  getByUserId: "/leaderboard/getByUserId",
  getByFilters: "/leaderboard/getByFilters",
};

export const leaderBoardApiRoutes: Record<ILeaderBoardApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawLeaderBoardApiRoutes);
