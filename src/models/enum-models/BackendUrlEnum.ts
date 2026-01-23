// NOTE:: This communicate directly to local
// export const BackendUrlEnum = {
//   INSIGHTS: '/api/v1',
//   BACKEND: '/api/v1',
//   TRANSACTIONS: process.env.NEXT_PUBLIC_TRANSACTIONS_URL || '/api/v1',
//   TASK_MANAGER: process.env.NEXT_PUBLIC_TASK_MANAGER_URL || '/api/v1',
// } as const;

// NOTE:: For Prod
export const BackendUrlEnum = {
  INSIGHTS: '/uri-insights',
  BACKEND: '/uri-backend/api/v1',
  TRANSACTIONS: '/uri-transactions/api/v1',
  TASK_MANAGER: '/task-manager/api/v1',
} as const;

export type BackendUrlEnum = (typeof BackendUrlEnum)[keyof typeof BackendUrlEnum];
