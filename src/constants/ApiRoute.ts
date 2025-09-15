// Identity Api Routes

type IAdminProfileApi =
  | "updateCreativeProfile"
  | "updateClientProfile"
  | "createClientProfile"
  | "createCreativeProfile"
  | "getCreativeProfileByUserId"
  | "getCreativeProfileById"
  | "getClientProfileByUserId"
  | "getClientProfileById"
  | "getCreativesProfileByFilter"
  | "getClientsProfileByFilter"
  | "getCreativeProfileStatusByUserId"
  | "getClientProfileStatusByUserId"
  | "deleteCreativeDoc"
  | "deleteClientDoc";

export const adminProfileApiRoutes: Record<IAdminProfileApi, string> = {
  updateCreativeProfile: "/admin/profiles/creative/update",
  updateClientProfile: "/admin/profiles/client/update",
  createCreativeProfile: "/admin/profiles/creative/create",
  createClientProfile: "/admin/profiles/client/create",
  getClientProfileByUserId: "/client/profile/getByUserId",
  getClientProfileById: "/admin/profiles/client/getById",
  getCreativeProfileByUserId: "/admin/profiles/creative/getByUserId",
  getCreativeProfileById: "/admin/profiles/creative/getById",
  getClientsProfileByFilter: "/admin/profiles/client/getByFilters",
  getCreativesProfileByFilter: "/admin/profiles/creative/getByFilters",
  getCreativeProfileStatusByUserId:
    "/admin/profiles/creative/getStatusByUserId",
  getClientProfileStatusByUserId: "/admin/profiles/client/getStatusByUserId",
  deleteCreativeDoc: "/admin/profiles/creative/deleteDoc",
  deleteClientDoc: "/admin/profiles/client/deleteDoc",
};

type AdminJobRoutes = "deleteDoc" | "dropJob";

export const adminJobRoutes: Record<AdminJobRoutes, string> = {
  deleteDoc: "/admin/job/deleteDoc",
  dropJob: "/admin/job/dropJob",
};

type IEventApi = "createEvent" | "getEvents" | "updateEvent" | "deleteEvent";

export const eventApiRoutes: Record<IEventApi, string> = {
  createEvent: "/events/create-event",
  getEvents: "/events/get-events",
  updateEvent: "/events/update-event",
  deleteEvent: "/events/delete-event",
};

export const adminUserRoutes = {
  createUser: "/admin/users/createUser",
  createBulkUsers: "/admin/users/bulkCreateUsers",
  updateUser: "/admin/users/update-user",
  getById: "/admin/users",
  getByFilters: "/admin/users/getByFilters",
};

export const adminSubscriptionPlanRoutes = {
  createSubscriptionPlan: "/admin/subscriptionPlans/create",
  updateSubscriptionPlan: "/admin/subscriptionPlans/update",
  deleteSubscriptionPlan: "/admin/subscriptionPlans/delete",
};

export const adminFeatureRoutes = {
  createFeature: "/admin/feature/create",
  updateFeature: "/admin/feature/update",
  deleteFeature: "/admin/feature/delete",
  getById: "/admin/feature/getByFeatureId",
  getByFilters: "/admin/feature/getByFilters",
};
