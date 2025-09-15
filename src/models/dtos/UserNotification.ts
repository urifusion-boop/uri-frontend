import { UserDto } from "./UserDto";

export class UserNotification {
  notificationId?: string;
  userId?: string;
  user?: UserDto;
  message?: string;
  isRead?: boolean;
  icon?: string;
  isDeleted?: boolean;
  createdAt?: string;
  notificationType?: string;
  references?: {
    senderId: string;
  };
}

export class GetUserNotificationsByFilters {
  page?: string;
  pageSize?: number;
  total?: number;
  data?: UserNotification[];
}
