import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.TASK_MANAGER;

type INotificationApi = 'create' | 'read' | 'readAll' | 'getByUserId' | 'getById' | 'getByFilters' | 'subscribeToPush';

const rawNotificationRoutes: Record<INotificationApi, string> = {
  create: '/usernotification/create',
  read: '/usernotification/read',
  readAll: '/usernotification/readAll',
  getByUserId: '/usernotification/getByUserId',
  getById: '/usernotification/getById',
  getByFilters: '/usernotification/getByFilters',
  subscribeToPush: '/usernotification/subscribeToPush',
};

export const notificationRoutes: Record<INotificationApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawNotificationRoutes);
