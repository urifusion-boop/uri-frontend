import { InviteModalState, InviteTeamMemberModalProps } from '@/features/teams/types';
import { Box, Button, InputLabel, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import CustomModal from '@/components/modals/CustomModal';
import { teamRoles } from '@/features/teams/utils';
import useCustomTheme from '@/hooks/theme.hook';
import { styled } from '@mui/system';
import Image from 'next/image';
import { FaEnvelopeOpen } from 'react-icons/fa6';
import { HiUserGroup } from 'react-icons/hi2';
import { LiaUsersCogSolid } from 'react-icons/lia';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 24px',
  fontWeight: 500,
  textTransform: 'none',
}));

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({ open, onClose }) => {
  const { themeColors } = useCustomTheme();
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('manager');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<InviteModalState>('form');

  const handleInvite = () => {
    setIsSubmitting(true);

    // Simulate API call with 50% chance of success
    setTimeout(() => {
      setIsSubmitting(false);
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.5) {
        setModalState('success');
      } else {
        setModalState('error');
      }
    }, 1000);
  };

  const handleTryAgain = () => {
    setModalState('form');
  };

  const handleClose = () => {
    // Reset state when closing the modal
    setEmail('');
    setRole('manager');
    setModalState('form');
    onClose();
  };

  return (
    <CustomModal open={open} closeModal={handleClose} showCloseIcon={false} closeOnOverlayClick={true} width="420px" radius="16px">
      {modalState === 'form' && (
        <Box sx={{ pt: 1, pb: 3 }}>
          <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 4 }}>
            Invite Team Member
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                backgroundColor: themeColors.primary,
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LiaUsersCogSolid color="#fff" size={50} />
            </Box>
          </Box>

          <Stack spacing={3}>
            <Box>
              <InputLabel htmlFor="email-input" sx={{ mb: 1, fontWeight: 500 }}>
                E-Mail
              </InputLabel>
              <TextField
                id="email-input"
                fullWidth
                placeholder="ayo@gmail.com"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Box>

            <Box>
              <InputLabel htmlFor="role-select" sx={{ mb: 1, fontWeight: 500 }}>
                Assign role
              </InputLabel>
              <TextField
                id="role-select"
                select
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              >
                {teamRoles
                  ?.filter((option) => option.value !== 'super-admin')
                  ?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <StyledButton variant="outlined" fullWidth onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </StyledButton>
              <StyledButton variant="contained" fullWidth onClick={handleInvite} disabled={!email || isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Invite'}
              </StyledButton>
            </Stack>
          </Stack>
        </Box>
      )}

      {modalState === 'success' && (
        <Box sx={{ py: 5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Image src="/assets/images/success.png" alt="Success" width={120} height={120} />
          </Box>

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Invitation Sent!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 320 }}>
            An email invite has been sent to {email} to join your team.
          </Typography>

          <StyledButton variant="contained" sx={{ width: '100%', maxWidth: 200 }} onClick={handleClose}>
            Awesome
          </StyledButton>
        </Box>
      )}

      {modalState === 'error' && (
        <Box sx={{ py: 5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Image src="/assets/images/error.png" alt="Failed" width={120} height={120} />
          </Box>

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Invitation Failed!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 320 }}>
            This might be due to an invalid email address or a temporary issue.
          </Typography>

          <StyledButton variant="contained" sx={{ width: '100%', maxWidth: 200 }} onClick={handleTryAgain}>
            Try Again
          </StyledButton>
        </Box>
      )}

      {modalState === 'alreadyInvited' && (
        <Box sx={{ py: 5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <FaEnvelopeOpen color={themeColors.primary} size={120} />
          </Box>

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Already Invited!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 320 }}>
            An invitation has already been sent to this person.
          </Typography>

          <StyledButton variant="contained" sx={{ width: '100%', maxWidth: 200 }} onClick={handleClose}>
            Resend Invite
          </StyledButton>
        </Box>
      )}

      {modalState === 'alreadyTeamMember' && (
        <Box sx={{ py: 5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <HiUserGroup color={themeColors.primary} size={120} />
          </Box>

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Already a Team Member
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 320 }}>
            This user is an existing team member.
          </Typography>

          <StyledButton variant="contained" sx={{ width: '100%', maxWidth: 200 }} onClick={handleClose}>
            Okay
          </StyledButton>
        </Box>
      )}
    </CustomModal>
  );
};

export default InviteTeamMemberModal;
