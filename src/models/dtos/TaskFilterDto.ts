import { PaginationDto } from "./PaginationDto";

export class TaskFilterDto extends PaginationDto {
  userId?: string;
  title?: string;
  taskType?: string;
  status?: string;
  referenceId?: string;
  dueDate?: string;
}
