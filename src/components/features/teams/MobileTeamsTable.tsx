import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import { MobileTeamsTableProps } from '@/features/teams/types';
import React from 'react';

const MobileTeamsTable: React.FC<MobileTeamsTableProps> = ({ data }) => {
  return (
    <Stack spacing={2}>
      {data.map((member, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
          }}
          elevation={0}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mr: 1 }}>
                {member.name}
              </Typography>
              {member.role === 'Super Admin' && <Chip label="You" size="small" sx={{ height: 24, bgcolor: '#f5f5f5', fontSize: '0.7rem' }} />}
            </Box>
            {member.checkbox}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {member.email}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body2">{member.role}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Last Login
              </Typography>
              <Typography variant="body2">{member.lastLogin.split(',')[0]}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {typeof member.actions === 'string' ? (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                {member.actions}
              </Typography>
            ) : (
              member.actions
            )}
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default MobileTeamsTable;
