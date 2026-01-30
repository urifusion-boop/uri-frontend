/**
 * FormDeleteConfirmDialog - Confirmation dialog for cascade delete of lead forms
 * PRD Feature 2: Multiple Lead Forms - Section 4.6
 *
 * NEW COMPONENT - Warns user about cascade deletion
 */

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import WarningIcon from '@mui/icons-material/Warning';
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

interface FormDeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formTitle: string;
  cascadeStats?: {
    total_leads: number;
    total_spam: number;
    total_snapshots: number;
  };
  isDeleting?: boolean;
}

const FormDeleteConfirmDialog = ({ open, onClose, onConfirm, formTitle, cascadeStats, isDeleting = false }: FormDeleteConfirmDialogProps) => {
  const [confirmText, setConfirmText] = useState('');

  const isConfirmed = confirmText === 'DELETE';

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onClose();
    }
  };

  const totalLeads = cascadeStats?.total_leads || 0;
  const totalSpam = cascadeStats?.total_spam || 0;
  const totalSnapshots = cascadeStats?.total_snapshots || 0;
  const totalItems = totalLeads + totalSpam + totalSnapshots;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon sx={{ color: '#FF5252', fontSize: 28 }} />
            <Typography fontSize="20px" fontWeight={700} color="#374151">
              Delete Form?
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={isDeleting} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Warning Alert */}
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle sx={{ fontWeight: 700, fontSize: '14px' }}>This action cannot be undone</AlertTitle>
          <Typography fontSize="13px">Deleting this form will permanently remove all associated data.</Typography>
        </Alert>

        {/* Form Info */}
        <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '8px', p: 2, mb: 2 }}>
          <Typography fontSize="12px" color="#6C727F" mb={0.5}>
            Form to be deleted
          </Typography>
          <Typography fontSize="16px" fontWeight={700} color="#374151">
            {formTitle}
          </Typography>
        </Box>

        {/* Cascade Impact */}
        {totalItems > 0 && (
          <>
            <Typography fontSize="14px" fontWeight={600} color="#374151" mb={1.5}>
              The following data will also be deleted:
            </Typography>

            <List sx={{ py: 0 }}>
              {totalLeads > 0 && (
                <>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LeaderboardIcon sx={{ color: '#6C727F', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontSize="14px" color="#374151">
                          {totalLeads.toLocaleString()} qualified {totalLeads === 1 ? 'lead' : 'leads'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </>
              )}

              {totalSpam > 0 && (
                <>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FilterListIcon sx={{ color: '#6C727F', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontSize="14px" color="#374151">
                          {totalSpam.toLocaleString()} unqualified {totalSpam === 1 ? 'lead' : 'leads'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </>
              )}

              {totalSnapshots > 0 && (
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CameraAltIcon sx={{ color: '#6C727F', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontSize="14px" color="#374151">
                        {totalSnapshots.toLocaleString()} form {totalSnapshots === 1 ? 'snapshot' : 'snapshots'}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

            <Box
              sx={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '8px',
                p: 2,
                mt: 2,
                mb: 2,
              }}
            >
              <Typography fontSize="13px" fontWeight={600} color="#92400E">
                Total: {totalItems.toLocaleString()} {totalItems === 1 ? 'item' : 'items'} will be permanently deleted
              </Typography>
            </Box>
          </>
        )}

        {/* Confirmation Input */}
        <Box mt={2}>
          <Typography fontSize="13px" color="#374151" mb={1}>
            To confirm deletion, type <strong>DELETE</strong> below:
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            disabled={isDeleting}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'monospace',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={handleClose}
          disabled={isDeleting}
          sx={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: '#6C727F',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!isConfirmed || isDeleting}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            backgroundColor: '#FF5252',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#DC2626',
            },
            '&:disabled': {
              backgroundColor: '#F3F4F6',
              color: '#9CA3AF',
            },
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Form'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDeleteConfirmDialog;
