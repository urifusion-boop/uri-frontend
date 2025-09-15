import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserApi =
  | "getUserById"
  | "getLoggedInUser"
  | "updateUser"
  | "deleteUser"
  | "updateUserAppToken";

const rawUserApiRoutes: Record<IUserApi, string> = {
  getUserById: "/users",
  getLoggedInUser: "/users/getLoggedInUser",
  updateUser: "/users/update-user",
  deleteUser: "/users/delete-user",
  updateUserAppToken: "/users/update-app-token",
};

export const userApiRoutes: Record<IUserApi, string> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawUserApiRoutes
);
