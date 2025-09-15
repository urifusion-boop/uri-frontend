import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.TASK_MANAGER;

type INotificationSettingsApi =
  | "getByUserId"
  | "update"
  | "getByFilters"
  | "delete";

const rawNotificationSettingsRoutes: Record<INotificationSettingsApi, string> =
  {
    getByUserId: "/notification-settings/getByUserId",
    update: "/notification-settings/update",
    getByFilters: "/notification-settings/getByFilters",
    delete: "/notification-settings/delete",
  };

export const notificationSettingsRoutes: Record<
  INotificationSettingsApi,
  string
> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawNotificationSettingsRoutes
);
