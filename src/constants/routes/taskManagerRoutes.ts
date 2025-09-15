import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_TASK_MANAGER_SVC_PATH = BackendUrlEnum.TASK_MANAGER;

type ITasksManagerApi =
  | "getAllTasksByUserId"
  | "getTaskById"
  | "createTask"
  | "updateTask"
  | "getTasksByFilter"
  | "getTasksBySearch"
  | "deleteTaskByTaskId"
  | "deleteTasksByUserId";

const rawTasksManagerApiRoutes: Record<ITasksManagerApi, string> = {
  getAllTasksByUserId: "/tasks/getByUserId",
  getTaskById: "/tasks/getTaskById",
  createTask: "/tasks/create",
  updateTask: "/tasks/update",
  getTasksByFilter: "/tasks/getByFilters",
  getTasksBySearch: "/tasks/getBySearch",
  deleteTaskByTaskId: "/tasks/delete",
  deleteTasksByUserId: "/tasks/delete/user",
};

export const tasksMangerApiRoutes: Record<ITasksManagerApi, string> =
  RouteHelper.createRoutes(URI_TASK_MANAGER_SVC_PATH, rawTasksManagerApiRoutes);
