export class CreateNotificationDto {
  userId?: string;
  title?: string;
  message?: string;
  notificationType?: string;
  references?: any;
  icon?: string;
}
