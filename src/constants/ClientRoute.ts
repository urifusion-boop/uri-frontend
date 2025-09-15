export type IAuthRoute = 'login' | 'registerCreative' | 'registerClient' | 'forgotPassword' | 'resetPassword' | 'emailVerification' | 'pengridLogin' | 'signupAs';

export const authRoutes: Record<IAuthRoute, string> = {
  login: '/login',
  registerCreative: '/auth/creative-signup',
  registerClient: '/auth/client-signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  emailVerification: '/email-verification',
  pengridLogin: '/pengrid-login',
  signupAs: '/signup-as',
};

export type IDashboardRoutes = 'dashboardAdmin' | 'dashboardHome' | 'dashboardCreatives' | 'dashboardClients';

export const dashboardRoutes: Record<IDashboardRoutes, string> = {
  dashboardAdmin: '/admin/dashboard',
  dashboardHome: '/dashboard/home',
  dashboardCreatives: '/dashboard',
  dashboardClients: '/dashboard',
};

export type IProfileSetupRoutes = 'client' | 'creative';

export const profileSetupRoutes: Record<IProfileSetupRoutes, string> = {
  client: '/profile_setup/client',
  creative: '/profile_setup/creative',
};

export type IUserRoutes = 'dashboard' | 'profileSetup' | 'profile';

export const clientUserRoutes: Record<IUserRoutes, string> = {
  dashboard: '/dashboard/clients',
  profileSetup: '/profile_setup/client',
  profile: '/clients/',
};

export const creativeUserRoutes: Record<IUserRoutes, string> = {
  dashboard: '/dashboard/creatives',
  profileSetup: '/profile_setup/creative',
  profile: '/creatives/',
};
