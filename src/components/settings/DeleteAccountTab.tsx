import { UserService } from '@/api/UserService';
import { DeleteUserDto } from '@/models/dtos/DeleteUserDto';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Checkbox, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { triggerToast } from '../atoms/CustomToast';
import Spinner from '../loaders/Spinner';
import AccountDeletionModal from '../modals/AccountDeletionModal';
import SmartModal from '../modals/SmartModal';

const DeleteAccountTab = () => {
  const NOTES = [
    'All data, including social media analytics, lead tracking, keyword insights, and content management, will be permanently deleted.',
    'You and your team will no longer have access to any of Uri’s features or data.',
    ' Once deleted, your account cannot be restored, and all your settings will be gone.',
  ];

  const [checked, setChecked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const { logoutUser, userDetails } = useAuth();

  const deleteAccountMutation = useMutation({
    mutationFn: async (data?: Partial<DeleteUserDto>) => {
      const result = await UserService.deleteUserApi({
        email: userDetails?.email ?? '',
        deletionReasons: data?.deletionReasons,
        otherReason: data?.otherReason,
      });

      if (result.status) {
        setSuccessModal(true);
      } else {
        triggerToast('error', result.responseMessage ?? 'Something went wrong', 'top-right');
      }

      return result;
    },
  });

  return (
    <>
      <Box
        sx={{
          maxWidth: '836px',
          width: '100%',
          margin: 'auto',
          borderRadius: '12px',
          backgroundColor: '#fff',
          py: '30px',
          boxShadow: '-1px -1px 10px 2px #0000000D',
          px: { xs: '20px', sm: '40px' },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#404040',
            fontSize: 'clamp(18px, 1.875vw + 12px, 24px)',
          }}
        >
          Delete Account
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            color: '#3B3B3B',
            maxWidth: '740px',
            py: '12px',
            fontSize: '17px',
          }}
        >
          Deleting your account will &nbsp;
          <span style={{ color: '#C61313' }}>permanently erase all your data</span>
          &nbsp; including your team, social media insights, keyword tracking, content management, and any other settings associated with your account. This action cannot be undone.
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#3B3B3B',
            maxWidth: '740px',
            fontSize: '17px',
          }}
        >
          Note that:
        </Typography>
        <Box my={0.5}>
          {NOTES.map((note) => (
            <Box
              key={note}
              sx={{
                display: 'flex',
                gap: '7px',
                mb: '16px',
              }}
            >
              <BiX
                size={24}
                color="#C61313"
                style={{
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 500,
                  color: '#404040',
                  maxWidth: '685px',
                  fontSize: '17px',
                }}
              >
                {note}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '13.18px',
            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            sx={{
              '&.Mui-checked': {
                color: '#CD1B78',
              },
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              color: '#404040',
              maxWidth: '685px',
              fontSize: '17px',
            }}
          >
            I understand that deleting my account is <span style={{ color: '#CA1A1A' }}>permanent</span> and cannot be <span style={{ color: '#CA1A1A' }}>undone</span>
          </Typography>
        </Box>
        <Box
          component="button"
          disabled={!checked}
          sx={{
            width: '160px',
            py: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ml: 'auto',
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
          onClick={() => setDeleteModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setDeleteModalOpen(true);
            }
          }}
        >
          {deleteAccountMutation.isLoading ? <Spinner color="#fff" /> : 'Delete Account'}
        </Box>
      </Box>

      {/* Account Deletion Modal */}
      <AccountDeletionModal open={deleteModalOpen} onDelete={() => {}} onCancel={() => {}} setOpen={setDeleteModalOpen} deleteAccountMutation={deleteAccountMutation} />

      <SmartModal
        image={<img src="/assets/images/success.png" alt="success" style={{ width: '100px', height: '100px' }} />}
        mainText="Account Deleted"
        open={successModal}
        subText="You will be logged out automatically. We’re sorry to see you go."
        buttonText="Done"
        onClick={() => {
          logoutUser();
          setSuccessModal(false);
        }}
      />
    </>
  );
};

export default DeleteAccountTab;
