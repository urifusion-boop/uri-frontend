import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import Spinner from '../loaders/Spinner';

// --- SmartModal.tsx ---
interface SmartModalProps {
  open: boolean;
  onClick?: () => void;
  image?: React.ReactNode;
  mainText?: string | React.ReactNode;
  subText?: string | React.ReactNode;
  children?: React.ReactNode; // <- NEW!
  buttonText?: string;
  onOutlineButtonClick?: () => void;
  outlineButtonText?: string;
  loading?: boolean;
  outlineBtnLoading?: boolean;
  sx?: SxProps<Theme>;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  showCloseButton?: boolean;
}

const SmartModal: React.FC<SmartModalProps> = ({
  open,
  onClick,
  image,
  mainText,
  subText,
  children,
  buttonText = 'Close',
  onOutlineButtonClick,
  outlineButtonText = 'Cancel',
  loading = false,
  outlineBtnLoading = false,
  sx,
  maxWidth = 'sm',
  fullWidth = false,
  showCloseButton = false,
}) => {
  return (
    <Box sx={sx}>
      <Dialog
        open={open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        sx={sx}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(2px)',
          },
        }}
        PaperProps={{
          sx: { borderRadius: '18px', py: '30px', px: '20px' },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClick}
          size="small"
          sx={{
            position: 'absolute',
            right: 20,
            top: 20,
            color: '#222',
            zIndex: 10,
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" width="100%">
            {image}
            {mainText && (
              <Typography variant="h5" fontWeight="bold" mt={2} sx={{ color: '#212529', justifySelf: 'center' }}>
                {mainText}
              </Typography>
            )}
            {subText && (
              <Typography variant="body1" color="textSecondary" mt={1} sx={{ color: '#616161', maxWidth: '540px', width: '100%', mx: 'auto' }}>
                {subText}
              </Typography>
            )}
            {children}
          </Box>
        </DialogContent>
        {onClick && (
          <DialogActions sx={{ justifyContent: 'center' }}>
            {onOutlineButtonClick && (
              <Button variant="outlined" color="primary" onClick={onOutlineButtonClick} sx={{ boxShadow: 'none', px: 3 }} disabled={outlineBtnLoading}>
                {outlineBtnLoading ? <Spinner color="#CD1B78" /> : outlineButtonText}
              </Button>
            )}
            {showCloseButton && (
              <Button variant="contained" color="primary" onClick={onClick} sx={{ boxShadow: 'none', px: 3 }} disabled={loading}>
                {loading ? <Spinner color="#fff" /> : buttonText}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default SmartModal;
