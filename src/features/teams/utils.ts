export const dummyData = [
  {
    name: 'Fatimah Ola',
    email: 'fatimah@uricreative',
    role: 'Super Admin',
    lastLogin: 'Feb 5, 2025, 10:00 AM',
  },
  {
    name: 'Jibola Ajide',
    email: 'jibola@uricreative',
    role: 'Manager',
    lastLogin: 'Feb 5, 2025, 10:00 AM',
  },
];

export const teamRoles = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    value: 'super-admin',
    description: 'This role grants users the permission to have full access to everything on the dashboard',
    members: ['Ebube Onwordi', 'Bukola Willy'],
  },
  {
    id: 'admin',
    label: 'Admin',
    value: 'admin',
    description: 'This role grants users the permission to have full access to everything on the dashboard',
    members: ['Ebube Onwordi', 'Bukola Willy'],
  },
  {
    id: 'editor',
    label: 'Editor',
    value: 'editor',
    description: 'This role grants users the permission to have edit access to everything on the dashboard',
    members: ['Ebube Onwordi', 'Bukola Willy'],
  },
  {
    id: 'analyst',
    label: 'Analyst',
    value: 'analyst',
    description: 'This role grants users the permission to have view access to everything on the dashboard',
  },
  {
    id: 'viewer',
    label: 'Viewer',
    value: 'viewer',
    description: 'This role grants users the permission to have view access to everything on the dashboard',
    members: ['Ebube Onwordi', 'Bukola Willy'],
  },
];

// Different permission categories
export const teamTabs = ['content-management', 'lead-tracking', 'keyword-tracking', 'hashtag-tracking', 'account-tracking'];
