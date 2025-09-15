import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_INSIGHT_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IChatBotApi =
  | "sendMessage"
  | "getMessagesByFilters"
  | "botChat"
  | "clearBotChat";

const rawChatBotApiRoutes: Record<IChatBotApi, string> = {
  sendMessage: "/chatbot/messages/send",
  getMessagesByFilters: "/chatbot/messages/getByFilters",
  botChat: "/bot-agent/chat",
  clearBotChat: "/bot-agent/clear-chat",
};

export const chatBotApiRoutes = RouteHelper.createRoutes(
  URI_INSIGHT_SVC_PATH,
  rawChatBotApiRoutes
);
