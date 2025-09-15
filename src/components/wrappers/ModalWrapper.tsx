import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import React, { ReactNode } from 'react';

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ open, onClose, children }) => (
  <Box
    sx={{
      display: open ? 'flex' : 'none',
      position: 'fixed',
      zIndex: 1400,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      bgcolor: 'rgba(0,0,0,0.10)',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '18px',
        width: { xs: '95vw', sm: 440 },
        maxWidth: 480,
        p: { xs: 2, sm: 4 },
        boxShadow: 3,
        position: 'relative',
        minHeight: 420,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#232323',
        }}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>
      {children}
    </Box>
  </Box>
);

export default ModalWrapper;
