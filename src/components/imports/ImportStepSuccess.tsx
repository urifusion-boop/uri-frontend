import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

interface ImportStepSuccessProps {
  onDone: () => void;
}

const ImportStepSuccess: React.FC<ImportStepSuccessProps> = ({ onDone }) => (
  <Box textAlign="center" py={6}>
    <CheckCircleIcon sx={{ color: '#CD1B78', fontSize: 74, mb: 2 }} />
    <Typography fontWeight={700} fontSize={24} mb={3}>
      Your Leads Have Been Imported
    </Typography>
    <Button
      fullWidth
      variant="contained"
      onClick={onDone}
      sx={{
        bgcolor: '#CD1B78',
        fontWeight: 600,
        py: 1.3,
        borderRadius: 2,
        mt: 1,
        fontSize: 17,
        '&:hover': { bgcolor: '#ad1766' },
      }}
    >
      Done
    </Button>
  </Box>
);

export default ImportStepSuccess;
