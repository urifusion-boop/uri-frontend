import { Box, List, ListItemButton, Paper, Typography } from '@mui/material';

import { IManageRoleSidebarProps } from '@/features/teams/types';

const ManageRoleSidebar = ({ teamRoles, selectedRole, setSelectedRole }: IManageRoleSidebarProps) => {
  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', width: 200, mr: 2 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Default Roles
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {teamRoles.map((role) => (
          <ListItemButton
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            sx={{
              py: 1.5,
              backgroundColor: selectedRole === role.id ? '#f8f0f6' : 'transparent',
              borderBottom: '1px solid #DEDEDE',
              '&:hover': {
                backgroundColor: selectedRole === role.id ? '#f8f0f6' : '#f5f5f5',
              },
            }}
          >
            <Typography
              sx={{
                color: selectedRole === role.id ? 'primary.main' : 'text.primary',
                fontWeight: selectedRole === role.id ? 600 : 400,
              }}
            >
              {role.label}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default ManageRoleSidebar;
