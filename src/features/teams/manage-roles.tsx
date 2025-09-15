import { teamRoles, teamTabs } from '@/features/teams/utils';
import { ArrowBack, Check } from '@mui/icons-material';
import { Box, Chip, IconButton, List, ListItem, Paper, Typography } from '@mui/material';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import ManageRoleSidebar from '@/components/features/teams/ManageRoleSidebar';
import FeaturesHeader from '@/components/headers/FeaturesHeader';
import useResponsiveness from '@/hooks/useResponsiveness';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { LiaUsersCogSolid } from 'react-icons/lia';
import { RiTeamLine } from 'react-icons/ri';

// Permission details for each role
const rolePermissions = {
  'super-admin': {
    canAccess: ['This role can create content', 'This role can edit content', 'This role can delete content', 'This role can approve scheduled posts'],
    cannotAccess: ['Any team member with this role can access all the sections of the dashboard'],
  },
};

const ManageRoles = () => {
  const router = useRouter();
  const { isMobile } = useResponsiveness();

  const [selectedRole, setSelectedRole] = useState('super-admin');
  const [activeTab, setActiveTab] = useState('content-management');

  const currentRole = teamRoles?.find((role) => role.id === selectedRole);

  return (
    <DashboardLayout excludeHeader>
      <Box px={{ xs: 2, sm: 3, md: 4 }} pb={3} bgcolor="#FAFAFA" minHeight={'100vh'}>
        <FeaturesHeader title="Teams" titleIcon={<LiaUsersCogSolid color="#fff" size={20} />} />

        <Box display="flex" alignItems="center" my={{ xs: 2, md: 4 }}>
          <IconButton onClick={() => router.back?.()}>
            <ArrowBack />
          </IconButton>
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
            Manage Roles
          </Typography>
        </Box>

        <Box display="flex" height={'70vh'} sx={{ mb: 3 }}>
          <ManageRoleSidebar teamRoles={teamRoles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

          <Paper sx={{ mb: 3, py: 2, borderRadius: 2, flex: 1 }}>
            <Box sx={{ px: 2, pb: 1, borderBottom: '1px solid #eee' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {currentRole?.label}
              </Typography>
              {/* Role description or header */}
              {currentRole?.description && (
                <Typography variant="body2" color="#313131CC" sx={{ mb: 1 }}>
                  {currentRole.description}
                </Typography>
              )}
            </Box>

            {/* Team members with this role */}
            {currentRole?.members && (
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1 }}>
                <RiTeamLine />
                <Typography variant="body2" fontWeight={500} color="#313131CC" sx={{ mr: 1 }}>
                  Team members with this role
                </Typography>
                {currentRole.members.map((member, index) => (
                  <Chip
                    key={index}
                    label={member}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      bgcolor: '#FFE0F0',
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Permission Categories */}
            <Box>
              <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={teamTabs} wrapperStyles={{ my: 1 }} />

              {/* Permissions list */}
              {rolePermissions[selectedRole as keyof typeof rolePermissions]?.canAccess && (
                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} mt={3}>
                    What this role can access
                  </Typography>
                  <List>
                    {rolePermissions[selectedRole as keyof typeof rolePermissions].canAccess.map((permission, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <Check color="success" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{permission}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* What this role cannot access */}
              {rolePermissions[selectedRole as keyof typeof rolePermissions]?.cannotAccess && (
                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} mt={3}>
                    What this role cannot access
                  </Typography>
                  <List>
                    {rolePermissions[selectedRole as keyof typeof rolePermissions].cannotAccess.map((restriction, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <IoMdClose color="red" />
                        <Typography variant="body2">{restriction}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default ManageRoles;
