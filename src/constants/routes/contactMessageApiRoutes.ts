import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IContactMessageApi = "createMessage";

const rawContactMessageApiRoutes: Record<IContactMessageApi, string> = {
  createMessage: "/contact/create-message",
};

export const contactMessageApiRoutes: Record<IContactMessageApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawContactMessageApiRoutes);
