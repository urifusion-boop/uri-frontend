import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

const AlertChatPanel: React.FC = () => {
  return (
    <Box
      sx={{
        width: '300px',
        padding: '16px',
        borderLeft: '1px solid #eaeaea',
        backgroundColor: '#f7f9fc',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '16px' }}>
        Chat
      </Typography>
      <Paper
        sx={{
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Nur Fariha
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '8px' }}>
          Hi Jason, can you reply to my message?
        </Typography>
      </Paper>
    </Box>
  );
};

export default AlertChatPanel;
