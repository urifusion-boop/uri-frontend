import { ActionModalState, TeamMemberActionModalProps } from '@/features/teams/types';
import { Box, Button, InputLabel, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import CustomModal from '@/components/modals/CustomModal';
import { teamRoles } from '@/features/teams/utils';
import { styled } from '@mui/system';
import Image from 'next/image';
import { BiTrash } from 'react-icons/bi';
import { LiaUsersCogSolid } from 'react-icons/lia';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 24px',
  fontWeight: 500,
  textTransform: 'none',
}));

const TeamMemberActionModal: React.FC<TeamMemberActionModalProps> = ({ open, onClose, teamMember, action }) => {
  const [role, setRole] = useState<string>(teamMember?.role.toLowerCase().replace(' ', '_') || 'manager');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ActionModalState>('form');

  const handleSaveChanges = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Randomly succeed or fail
      if (Math.random() > 0.3) {
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
    if (teamMember) {
      setRole(teamMember.role.toLowerCase().replace(' ', '_'));
    }
    setModalState('form');
    onClose();
  };

  if (!teamMember) return null;

  return (
    <CustomModal open={open} closeModal={handleClose} showCloseIcon={false} closeOnOverlayClick={true} width="420px" radius="16px">
      {modalState === 'form' && action === 'edit' && (
        <Box sx={{ pt: 1, pb: 3 }}>
          <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 4 }}>
            Edit Team Member&apos;s Role
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                backgroundColor: 'primary.main',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LiaUsersCogSolid color="#fff" size={100} />
            </Box>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography align="center" variant="subtitle1" fontWeight={600}>
                Edit {teamMember.name}&apos;s role
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <InputLabel htmlFor="role-select" sx={{ fontWeight: 500 }}>
                Assign role
              </InputLabel>
              <TextField
                id="role-select"
                select
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              >
                {teamRoles.map((option) => (
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
              <StyledButton variant="contained" fullWidth onClick={handleSaveChanges} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </StyledButton>
            </Stack>
          </Stack>
        </Box>
      )}

      {modalState === 'form' && action === 'delete' && (
        <Box sx={{ pt: 1, pb: 3 }}>
          <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 4 }}>
            Remove Team Member
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: '#FFC4C442',
                borderRadius: 999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <BiTrash color="#A9302D" size={60} />
            </Box>
          </Box>

          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1" align="center" color="text.primary">
                By doing this,{' '}
                <Box component="span" fontWeight={600}>
                  {teamMember.name}
                </Box>{' '}
                will no longer be able to access this dashboard anymore.{' '}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <StyledButton variant="outlined" fullWidth onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </StyledButton>
              <StyledButton variant="contained" fullWidth onClick={handleSaveChanges} disabled={isSubmitting}>
                {isSubmitting ? 'Removing...' : 'Yes, Remove'}
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
            {action === 'delete' ? 'Member Removed!' : action === 'edit' ? 'Changes Saved' : null}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 320 }}>
            {action === 'delete'
              ? `${teamMember.name} has been removed from your team. They no longer have access to the dashboard.`
              : action === 'edit'
                ? `${teamMember.name}'s role has been successfully updated.`
                : null}
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
            Failed!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 320 }}>
            {action === 'delete'
              ? `There was an issue removing the team member. Please try again.`
              : action === 'edit'
                ? ` There was an issue updating the team member's role. Please try again.`
                : null}
          </Typography>

          <StyledButton variant="contained" sx={{ width: '100%', maxWidth: 200 }} onClick={handleTryAgain}>
            Try Again
          </StyledButton>
        </Box>
      )}
    </CustomModal>
  );
};

export default TeamMemberActionModal;
