import { UriHttpClient } from '@/configs/http.config';
import { tasksMangerApiRoutes } from '@/constants/routes/taskManagerRoutes';
import { GetTasksByFilterDto, TaskMangerDto, TasksByFiltersDto } from '@/models/dtos/TaskManagerDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class TasksManagerService {
  // create task
  static async createTasksMangerApi(data: TaskMangerDto): Promise<UriResponse<TaskMangerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TaskMangerDto>>> = await UriHttpClient.getClient().post(tasksMangerApiRoutes.createTask, data);
    return response.data;
  }

  //   update task
  static async updateTasksMangerApi(data: TaskMangerDto): Promise<UriResponse<TaskMangerDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TaskMangerDto>>> = await UriHttpClient.getClient().put(tasksMangerApiRoutes.updateTask, data);
    return response.data;
  }

  //   get by filters
  static async getTasksByFilterApi(data: GetTasksByFilterDto): Promise<UriResponse<TasksByFiltersDto>> {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response: Awaited<AxiosResponse<UriResponse<TasksByFiltersDto>>> = await UriHttpClient.getClient().get(`${tasksMangerApiRoutes.getTasksByFilter}?${queryString}`);
    return response.data;
  }

  //   delete task by task id
  static async deleteTaskByTaskIdApi(taskId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().delete(`${tasksMangerApiRoutes.deleteTaskByTaskId}/${taskId}`);
    return response.data;
  }

  // delete tasks by user id
  static async deleteTasksByUserIdApi(userId: string): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().delete(`${tasksMangerApiRoutes.deleteTasksByUserId}/${userId}`);
    return response.data;
  }
}
