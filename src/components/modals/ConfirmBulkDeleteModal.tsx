/**
 * ConfirmBulkDeleteModal - Confirmation dialog for bulk delete
 * PRD Feature 1: Spam Visibility - Enhanced UX
 */

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';

interface ConfirmBulkDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isProcessing?: boolean;
}

const ConfirmBulkDeleteModal = ({ open, onClose, onConfirm, count, isProcessing = false }: ConfirmBulkDeleteModalProps) => {
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
          <DeleteSweepIcon sx={{ color: '#EF4444', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" fontWeight={600} color="#374151">
          Confirm Bulk Delete
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography fontSize="14px" color="#374151" mb={2}>
          Are you sure you want to permanently delete {count} spam leads? This action cannot be undone.
        </Typography>

        <Box
          sx={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            p: 2,
          }}
        >
          <Typography fontSize="13px" color="#991B1B" fontWeight={600}>
            Warning
          </Typography>
          <Typography fontSize="13px" color="#7F1D1D" mt={1}>
            All selected spam leads will be permanently removed from your database.
          </Typography>
        </Box>
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
          {isProcessing ? 'Deleting...' : 'Yes, Delete All Selected'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBulkDeleteModal;
