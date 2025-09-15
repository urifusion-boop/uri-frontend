import { DeleteUserDto } from '@/models/dtos/DeleteUserDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { Box, Checkbox, Modal, TextField, Typography } from '@mui/material';
import { UseMutationResult } from '@tanstack/react-query';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { HiTrash } from 'react-icons/hi2';
import SmartModal from './SmartModal';

interface AccountDeletionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  onCancel: () => void;
  deleteAccountMutation: UseMutationResult<UriResponse<null>, unknown, Partial<DeleteUserDto> | undefined, unknown>;
}

const AccountDeletionModal = ({ open, setOpen, onDelete, onCancel, deleteAccountMutation }: AccountDeletionModalProps) => {
  const REASONS = [
    'No longer using the service/platform',
    'Found a better alternative',
    'Privacy concerns',
    'Difficulty navigating the platform',
    'Account security concerns',
    'Personal reasons',
    'Others',
  ];

  const [selectedReason, setSelectedReason] = useState<string[]>([]);

  // Form data state
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  return (
    <>
      {/* Modal 1: Reason for Deletion */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{
          padding: '0 20px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 647,
            bgcolor: '#fff',
            border: 'none',
            py: '40px',
            px: '32px',
            borderRadius: '20px',
            maxHeight: '95vh',
            overflowY: 'auto',
            width: {
              xs: '90%',
              md: '100%',
            },
          }}
          className="scroll"
        >
          <BiX
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '17px',
              cursor: 'pointer',
            }}
            size={30}
          />
          <Typography
            sx={{
              fontSize: 'clamp(1.25rem, 0.9392rem + 1.326vw, 2rem)',
              color: '#333333',
              fontWeight: 700,
            }}
          >
            We’d love to know why you’re leaving
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '20px' },
              color: '#333333',
              fontWeight: 500,
              mt: '11px',
              mb: '26px',
            }}
          >
            Please take a moment to share your reason for deleting your account. Your feedback helps us improve.
          </Typography>
          <Box>
            {REASONS.map((reason, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: '25px' }}>
                <Checkbox
                  checked={selectedReason.includes(reason)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReason((prev) => [...prev, reason]);
                    } else {
                      setSelectedReason((prev) => prev.filter((item) => item !== reason));
                    }

                    if (reason === 'Others') {
                      setOtherSelected(e.target.checked);
                    }
                  }}
                  value={reason}
                  sx={{
                    '&.Mui-checked': {
                      color: '#CD241B',
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: '14px', md: '18px' },
                    color: '#404040',
                    fontWeight: 500,
                  }}
                >
                  {reason}
                </Typography>
              </Box>
            ))}

            {otherSelected && (
              <TextField variant="outlined" fullWidth multiline rows={4} placeholder="Please specify" sx={{ mt: '20px' }} value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />
            )}
          </Box>
          <Box
            component="button"
            onClick={() => {
              setOpen(false);
              setConfirmDeleteModal(true);
            }}
            disabled={selectedReason.length < 1 || (selectedReason.includes('Others') && otherReason.trim() === '')}
            sx={{
              width: '214px',
              py: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mx: 'auto',
              background: '#CD1B78',
              color: '#fff',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '20px',
              mt: '30px',
              mb: '20px',
              '&:disabled': {
                cursor: 'not-allowed',
                opacity: 0.5,
              },
            }}
          >
            Next
          </Box>
        </Box>
      </Modal>

      {/* Modal 2: Confirmation */}
      <SmartModal
        image={
          <Box
            sx={{
              height: '62px',
              width: '62px',
              backgroundColor: '#FFC4C442',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <HiTrash size={34} color="#CD1B78" />
          </Box>
        }
        mainText="Delete Account"
        open={confirmDeleteModal}
        subText="Are you sure you want to delete your account. This is permanent and cannot be undone"
        buttonText="Delete Account"
        outlineButtonText="Cancel"
        onClick={() => {
          deleteAccountMutation.mutate({
            deletionReasons: selectedReason,
            otherReason,
          });
          setConfirmDeleteModal(false);
        }}
        onOutlineButtonClick={() => setConfirmDeleteModal(false)}
      />
    </>
  );
};

export default AccountDeletionModal;
