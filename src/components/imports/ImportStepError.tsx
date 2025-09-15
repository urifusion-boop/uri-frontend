import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

interface ImportStepErrorProps {
  onRetry: () => void;
  onCancel: () => void;
}

const ImportStepError: React.FC<ImportStepErrorProps> = ({ onRetry, onCancel }) => (
  <Box textAlign="center" py={6}>
    <ErrorOutlineIcon sx={{ color: '#CD1B78', fontSize: 74, mb: 2 }} />
    <Typography fontWeight={700} fontSize={22} mb={1}>
      We Couldn&apos;t Import Your Leads
    </Typography>
    <Typography color="#65676B" fontSize={15} mb={3}>
      Something went wrong during the import process. Please check your file and try again.
    </Typography>
    <Box display="flex" gap={2} justifyContent="center">
      <Button
        variant="contained"
        onClick={onRetry}
        sx={{
          bgcolor: '#CD1B78',
          fontWeight: 600,
          px: 6,
          '&:hover': { bgcolor: '#ad1766' },
        }}
      >
        Retry
      </Button>
      <Button variant="outlined" onClick={onCancel} sx={{ px: 6 }}>
        Cancel
      </Button>
    </Box>
  </Box>
);

export default ImportStepError;
