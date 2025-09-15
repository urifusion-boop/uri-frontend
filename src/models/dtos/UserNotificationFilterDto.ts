import { PaginationDto } from "./PaginationDto";

export class UserNotificationFilterDto extends PaginationDto {
  pageSize?: number;
  userId?: string;
}
