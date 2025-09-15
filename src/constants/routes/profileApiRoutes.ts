import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IProfileApi =
  | 'updateCreativeProfile'
  | 'updateClientProfile'
  | 'createClientProfile'
  | 'createCreativeProfile'
  | 'getCreativeProfileByUserId'
  | 'getCreativeProfileById'
  | 'getClientProfileByUserId'
  | 'getClientProfileById'
  | 'getCreativesProfileByFilter'
  | 'getCreativesProfileBySearch'
  | 'getClientsProfileBySearch'
  | 'getClientsProfileByFilter'
  | 'createCreativePortfolio'
  | 'getCreativesPortfolioByFilter'
  | 'getCreativesPortfolioById'
  | 'updateCreativePortfolio'
  | 'getCreativeProfileStatusByUserId'
  | 'getClientProfileStatusByUserId';

const rawProfileApiRoutes: Record<IProfileApi, string> = {
  updateCreativeProfile: '/creative/profile/update',
  updateCreativePortfolio: '/creative/portfolio/update',
  updateClientProfile: '/business/profile/update',
  createCreativeProfile: '/creative/profile/create',
  createCreativePortfolio: '/creative/portfolio/create',
  createClientProfile: '/business/profile/create',
  getClientProfileByUserId: '/profile/getClientByUserId',
  getClientProfileById: '/profile/getClientByProfileId',
  getCreativesPortfolioById: 'creative/portfolio/getById',
  getCreativeProfileByUserId: '/profile/getCreativeByUserId',
  getCreativeProfileById: '/profile/getCreativeByProfileId',
  getClientsProfileByFilter: '/business/profile/getByFilters',
  getCreativesProfileByFilter: '/profile/getCreativeByFilters',
  getCreativesProfileBySearch: '/profile/getCreativesBySearch',
  getClientsProfileBySearch: '/profile/getClientsBySearch',
  getCreativesPortfolioByFilter: '/creative/portfolio/getByFilters',
  getCreativeProfileStatusByUserId: '/creative/profile/getStatusByUserId',
  getClientProfileStatusByUserId: '/business/profile/getStatusByUserId',
};

export const profileApiRoutes: Record<IProfileApi, string> = RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawProfileApiRoutes);
