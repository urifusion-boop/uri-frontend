import Spinner from '@/components/loaders/Spinner';
import { Box, Button, ButtonProps } from '@mui/material';
import React from 'react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  text: string;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading = false, text, loadingText = 'Saving...', disabled, ...props }) => {
  return (
    <Button
      variant="contained"
      disabled={loading || disabled}
      sx={{
        backgroundColor: loading ? '#9ca3af' : '#CD1B78',
        '&:hover': {
          backgroundColor: loading ? '#9ca3af' : '#b31665',
        },
        px: 8,
        py: 2,
        borderRadius: 3,
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: loading ? 'none' : '0 4px 12px rgba(205, 27, 120, 0.3)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        height: 50,
        minWidth: 245,
        whiteSpace: 'nowrap',
      }}
      {...props}
    >
      {loading && (
        <Box sx={{ width: 18, height: 18 }}>
          <Spinner color="#ffffff" size={18} />
        </Box>
      )}
      {loading ? loadingText : text}
    </Button>
  );
};

export default LoadingButton;
