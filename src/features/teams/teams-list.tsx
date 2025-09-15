import { Delete, Edit, Settings } from '@mui/icons-material';
import { Box, Button, Checkbox, Chip, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import CustomProgressBar from '@/components/atoms/CustomProgressBar';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import MobileTeamsTable from '@/components/features/teams/MobileTeamsTable';
import TeamMemberActionModal from '@/components/features/teams/TeamMemberActionModal';
import FeaturesHeader from '@/components/headers/FeaturesHeader';
import CustomTable from '@/components/tables/CustomTable';
import { dummyData } from '@/features/teams/utils';
import useResponsiveness from '@/hooks/useResponsiveness';
import Link from 'next/link';
import { BiBriefcase } from 'react-icons/bi';
import { GoPlus } from 'react-icons/go';
import { LiaUsersCogSolid } from 'react-icons/lia';
import InviteTeamMemberModal from '../../components/features/teams/InviteTeamMemberModal';

const TeamsList = () => {
  const { isMobile } = useResponsiveness();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'delete'>('edit');
  const [currentTeamMember, setCurrentTeamMember] = useState<(typeof dummyData)[0] | null>(null);

  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
  };

  const handleEditMember = (member: (typeof dummyData)[0]) => {
    setCurrentTeamMember(member);
    setActionType('edit');
    setActionModalOpen(true);
  };

  const handleDeleteMember = (member: (typeof dummyData)[0]) => {
    setCurrentTeamMember(member);
    setActionType('delete');
    setActionModalOpen(true);
  };

  const handleCloseActionModal = () => {
    setActionModalOpen(false);
    setCurrentTeamMember(null);
  };

  const tableData = useMemo(
    () =>
      dummyData.map((item) => ({
        checkbox: <Checkbox size="small" />,
        ...item,
        actions:
          item.role === 'Super Admin' ? (
            'No action'
          ) : (
            <Box sx={{ display: 'flex' }}>
              <IconButton size="small" onClick={() => handleEditMember(item)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => handleDeleteMember(item)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ),
      })),
    []
  );

  return (
    <DashboardLayout excludeHeader>
      <Box px={{ xs: 2, sm: 3, md: 4 }} pb={3} bgcolor="#FAFAFA" minHeight={'100vh'}>
        <FeaturesHeader title="Teams" titleIcon={<LiaUsersCogSolid color="#fff" size={20} />} hasBtn btnText="Export" />
        <Box my={{ xs: 2, md: 4 }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
            Team Members
          </Typography>
          <Typography variant={isMobile ? 'body2' : 'body1'}>Manage your team members and their roles here</Typography>
        </Box>

        {/* Premium Plan Card */}
        <Box sx={{ borderRadius: 2, bgcolor: 'background.paper', mb: 4, py: 3, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', px: { xs: 2, sm: 3 }, pb: 2, mb: 2, gap: { xs: 2, sm: 0 } }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <BiBriefcase style={{ marginRight: 4 }} />
                <Typography variant="h6" fontWeight={600} component="span" sx={{ mr: 2 }}>
                  Premium Plan
                </Typography>
                <Chip
                  label="Active"
                  variant="outlined"
                  size="small"
                  color="primary"
                  sx={{
                    padding: 1,
                    borderRadius: 2,
                    '& .MuiChip-label': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                  icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2ecc71', mr: 0.5 }} />}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This plan allows you have a maximum of 10 team members
              </Typography>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant={isMobile ? 'h4' : 'h3'} component="span" sx={{ fontWeight: 'bold' }}>
                ₦35k
              </Typography>
              <Typography variant="body1" component="span" color="text.secondary">
                /month
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderBottom: '1px solid #CBCBCB80', mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 1, px: { xs: 2, sm: 3 }, gap: { xs: 2, sm: 5 } }}>
            <Box flex={1} width="100%">
              <CustomProgressBar percentage={0.2} height={8} />
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              2 of 10 team members
            </Typography>
          </Box>
        </Box>

        {/* Team Members Table Section */}
        <Box sx={{ borderRadius: 2, bgcolor: 'background.paper', p: { xs: 2, sm: 3 }, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
          {/* Team Members Header */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={{ xs: 2, md: 0 }} mb={3}>
            <Typography variant="h6" component="h2">
              All Team Members
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width={{ xs: '100%', md: 'auto' }}>
              <Link href="/teams/roles">
                <Button variant="outlined" startIcon={<Settings />} fullWidth={isMobile}>
                  Manage Roles
                </Button>
              </Link>
              <Button variant="contained" startIcon={<GoPlus />} fullWidth={isMobile} onClick={handleOpenInviteModal}>
                Invite Someone
              </Button>
            </Stack>
          </Stack>

          {isMobile ? (
            <MobileTeamsTable data={tableData} />
          ) : (
            <CustomTable headings={[<Checkbox key="checkbox-header" size="small" />, 'Name', 'E-mail Address', 'Role', 'Last Login', 'Actions']} data={tableData} />
          )}
        </Box>
      </Box>

      {/* Invite Team Member Modal */}
      <InviteTeamMemberModal open={inviteModalOpen} onClose={handleCloseInviteModal} />

      {/* Edit Team Member Modal */}
      <TeamMemberActionModal action={actionType} open={editModalOpen} onClose={handleCloseActionModal} teamMember={currentTeamMember || undefined} />
    </DashboardLayout>
  );
};

export default TeamsList;
