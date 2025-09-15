import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.TASK_MANAGER;

type ImportsApi = 'uploadLeads' | 'status' | 'confirm';

const rawImportsRoutes: Record<ImportsApi, string> = {
  uploadLeads: '/import/upload',
  status: '/import/progress',
  confirm: '/import/confirm',
};

export const importsRoutes: Record<ImportsApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawImportsRoutes);
