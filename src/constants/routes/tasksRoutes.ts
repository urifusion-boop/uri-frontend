import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ITasksApi = "getCreativeTasks" | "updateCreativeTask";

const rawTasksRoutes: Record<ITasksApi, string> = {
  getCreativeTasks: "/creative/task/getByFilters",
  updateCreativeTask: "/creative/task/updateJobCompletionTask",
};

export const tasksRoutes: Record<ITasksApi, string> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawTasksRoutes
);
