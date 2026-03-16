/**
 * ConfirmDeleteModal - Confirmation dialog before deleting spam lead
 * PRD Feature 1: Spam Visibility - Enhanced UX
 */

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  spamTitle?: string;
  isProcessing?: boolean;
  title?: string;
  description?: string;
  itemLabel?: string;
}

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  spamTitle,
  isProcessing = false,
  title = 'Confirm Delete',
  description = 'Are you sure you want to permanently delete this spam lead? This action cannot be undone.',
  itemLabel = 'Lead Title',
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DeleteOutlineIcon sx={{ color: '#EF4444', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" fontWeight={600} color="#374151">
          {title}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography fontSize="14px" color="#374151" mb={2}>
          {description}
        </Typography>

        {spamTitle && (
          <Box
            sx={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              p: 2,
            }}
          >
            <Typography fontSize="12px" color="#991B1B" mb={0.5} fontWeight={600}>
              {itemLabel}:
            </Typography>
            <Typography fontSize="14px" color="#7F1D1D" fontWeight={500}>
              {spamTitle}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined" disabled={isProcessing} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isProcessing}
          sx={{
            backgroundColor: '#EF4444',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#DC2626',
            },
          }}
        >
          {isProcessing ? 'Deleting...' : 'Yes, Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
