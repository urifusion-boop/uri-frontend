import { PaginationDto } from "./PaginationDto";
import { UserDocDto } from "./base/UserDocDto";

export class TaskMangerDto {
  userId?: string;
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
  attachments?: UserDocDto[];
  priority?: string;
  assignee?: string;
  collaborators?: string[];
  parentTask?: string;
  subTasks?: string[];
  tags?: string[];
  isDeleted?: boolean;
  taskId?: string;
  taskType?: string;
}

export class GetTasksByFilterDto extends PaginationDto {
  userId?: string;
  title?: string;
  taskType?: string;
  status?: string;
  referenceId?: string;
  dueDate?: string;
}

export class TasksByFiltersDto {
  data?: TaskMangerDto[];
  total?: number;
  pageSize?: number;
  page?: number;
}
