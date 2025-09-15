import { AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react';

const AlertHeader: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        color: '#3c4858',
        boxShadow: 'none',
        padding: '0 16px',
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Alerts Inbox
        </Typography>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: '#007bff' }}>J</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AlertHeader;
