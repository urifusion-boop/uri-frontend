import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IChatMessageApi = "createChatMessage" | "getByFilters";

const rawChatMessageApiRoutes: Record<IChatMessageApi, string> = {
  createChatMessage: "/chatmessages/create",
  getByFilters: "/chatmessages/getByFilters",
};

export const chatMessageApiRoutes: Record<IChatMessageApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawChatMessageApiRoutes);
