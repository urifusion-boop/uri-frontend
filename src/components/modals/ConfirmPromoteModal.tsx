/**
 * ConfirmPromoteModal - Confirmation dialog before promoting spam to lead
 * PRD Feature 1: Spam Visibility - Section 3.5
 */

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';

interface ConfirmPromoteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  spamTitle?: string;
  isProcessing?: boolean;
}

const ConfirmPromoteModal = ({ open, onClose, onConfirm, spamTitle, isProcessing = false }: ConfirmPromoteModalProps) => {
  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: '#10B981', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" fontWeight={600} color="#374151">
          Confirm Add to Leads
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography fontSize="14px" color="#374151" mb={2}>
          Are you sure you want to add this unqualified lead to your active leads list?
        </Typography>

        {spamTitle && (
          <Box
            sx={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              p: 2,
            }}
          >
            <Typography fontSize="12px" color="#6C727F" mb={0.5} fontWeight={600}>
              Lead Title:
            </Typography>
            <Typography fontSize="14px" color="#374151" fontWeight={500}>
              {spamTitle}
            </Typography>
          </Box>
        )}

        <Typography fontSize="13px" color="#6C727F" mt={2}>
          This will move the lead from unqualified to your main leads dashboard.
        </Typography>
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
            backgroundColor: '#10B981',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#059669',
            },
          }}
        >
          {isProcessing ? 'Adding...' : 'Yes, Add to Leads'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPromoteModal;
