import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IChatApi = 'createChat' | 'updateChat' | 'getByFilters' | 'getById' | 'getByChatId' | 'getTotalUnreadChatCount';

const rawChatApiRoutes: Record<IChatApi, string> = {
  createChat: '/business/chat/create',
  updateChat: '/business/chat/update',
  getByFilters: '/chat/getByFilters',
  getById: '/chat/getById',
  getByChatId: '/chat/getById',
  getTotalUnreadChatCount: '/chat/getTotalUnreadChatCount',
};

export const chatApiRoutes: Record<IChatApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawChatApiRoutes);
