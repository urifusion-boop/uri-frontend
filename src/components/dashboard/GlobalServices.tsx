import { UserModuleService } from '@/api/UserModuleService';
import { LightThemeColors } from '@/configs/colors.config';
import { useWorkflowFilter } from '@/contexts/WorkflowFilterContext';
import { useUserModules } from '@/hooks/useUserModules.hook';
import { useAuth } from '@/providers/AuthProvider';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { Box, Button, Chip, Collapse, Grid, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { BsGraphUp } from 'react-icons/bs';
import { FaBuilding, FaComments, FaFolder, FaHeartbeat, FaUser } from 'react-icons/fa';
import { HiHashtag } from 'react-icons/hi';
import { MdAutorenew, MdRecordVoiceOver } from 'react-icons/md';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
  padding: '0 40px',
});

// Workflow definitions with their modules
const workflowData = [
  {
    id: 'social-listening',
    name: 'Social Listening',
    description: 'Track conversations & monitor brand performance',
    icon: <BsGraphUp size={40} color={LightThemeColors.uriColor} />,
    comingSoon: false,
    modules: [
      {
        id: 'account-tracking',
        title: 'Account Tracking',
        description: 'Track your account performance and growth over time.',
        icon: (
          <ChartLine
            style={{
              color: LightThemeColors.uriColor,
              width: 40,
              height: 40,
            }}
          />
        ),
        href: '/account-tracking',
      },
      {
        id: 'keyword-tracking',
        title: 'Keyword Tracking',
        description: 'Track your keyword performance and growth over time.',
        icon: (
          <HeartRateSearch
            style={{
              color: LightThemeColors.uriColor,
              width: 40,
              height: 40,
            }}
          />
        ),
        href: '/keyword-tracking/overview',
      },
      {
        id: 'hashtag-tracking',
        title: 'Hashtag Tracking',
        description: 'Track your hashtag performance and growth over time.',
        icon: <HiHashtag size={40} color={LightThemeColors.uriColor} />,
        href: '/hashtag-tracking',
      },
      {
        id: 'report-generation',
        title: 'Report Generation',
        description: 'Generate insights reports for your business.',
        icon: (
          <FaFolder
            style={{
              color: LightThemeColors.uriColor,
              width: 40,
              height: 40,
            }}
          />
        ),
        href: '/report-generation',
      },
    ],
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'Find potential customers & leads',
    icon: <MdRecordVoiceOver size={40} color={LightThemeColors.uriColor} />,
    comingSoon: false,
    modules: [
      {
        id: 'individual-leads',
        title: 'Individual Leads',
        description: 'Track and manage individual person leads.',
        icon: <FaUser size={40} color={LightThemeColors.uriColor} />,
        href: '/leads-tracking/forms/leads?type=individual',
      },
      {
        id: 'organization-leads',
        title: 'Organization Leads',
        description: 'Track and manage organization leads.',
        icon: <FaBuilding size={40} color={LightThemeColors.uriColor} />,
        href: '/leads-tracking/forms/leads?type=organization',
      },
      {
        id: 'conversational-leads',
        title: 'Sales Signals',
        description: 'Public online conversations indicating buying intent, pain, or opportunity.',
        icon: <FaComments size={40} color={LightThemeColors.uriColor} />,
        href: '/leads-tracking/forms/leads?type=conversational',
      },
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'The Prospect Pulse. Active Signals for High-Ticket Leads',
    icon: <MdAutorenew size={40} color={LightThemeColors.uriColor} />,
    comingSoon: false,
    modules: [
      {
        id: 'lazarus-protocol',
        title: 'The Prospect Pulse',
        description: 'Who do you want us to monitor for buying signals? Connect your CRM or upload contacts manually.',
        icon: <FaHeartbeat size={40} color={LightThemeColors.uriColor} />,
        href: '/lazarus',
      },
    ],
  },
];

const GlobalServices: React.FC = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { selectedModules } = useUserModules();
  const { selectedWorkflows, setSelectedWorkflows } = useWorkflowFilter();

  const handleWorkflowClick = (workflowId: string) => {
    const isCurrentlyExpanded = selectedWorkflows.includes(workflowId);

    let newExpandedWorkflows: string[];

    if (isCurrentlyExpanded) {
      // Remove from selection (deselect)
      newExpandedWorkflows = selectedWorkflows.filter((w) => w !== workflowId);
    } else {
      // Add to selection (multi-select)
      newExpandedWorkflows = [...selectedWorkflows, workflowId];
    }

    // Update context and URL
    setSelectedWorkflows(newExpandedWorkflows);

    // Update URL with new selection
    if (newExpandedWorkflows.length === 0) {
      router.push('/dashboard', undefined, { shallow: true });
    } else {
      router.push(`/dashboard?workflow=${newExpandedWorkflows.join(',')}`, undefined, { shallow: true });
    }
  };

  const handleModuleClick = async (moduleId: string, href: string) => {
    try {
      if (userDetails?.userId) {
        await UserModuleService.trackModuleAccess(userDetails.userId, moduleId);
      }
    } catch (error) {
      console.error('Error tracking module access:', error);
    }
    router.push(href);
  };

  // Filter workflows based on user's enabled modules
  // Show all workflows but filter modules, and always show coming soon workflows
  const filteredWorkflows = workflowData
    .map((workflow) => ({
      ...workflow,
      modules: workflow.comingSoon ? [] : workflow.modules.filter((module) => selectedModules.length === 0 || selectedModules.includes(module.id)),
    }))
    .filter((workflow) => workflow.comingSoon || workflow.modules.length > 0);

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center">
        {filteredWorkflows.map((workflow) => (
          <Grid item xs={12} md={6} key={workflow.id}>
            {/* Workflow Card */}
            <Box
              onClick={() => !workflow.comingSoon && handleWorkflowClick(workflow.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: workflow.comingSoon ? 'not-allowed' : 'pointer',
                p: 3,
                borderRadius: '20px',
                boxShadow: '1px 1px 6px 3px #00000011',
                border: selectedWorkflows.includes(workflow.id) ? `2px solid ${LightThemeColors.uriColor}` : '2px solid transparent',
                backgroundColor: selectedWorkflows.includes(workflow.id) ? `${LightThemeColors.uriColor}10` : '#fff',
                opacity: workflow.comingSoon ? 0.6 : 1,
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                '&:hover': !workflow.comingSoon
                  ? {
                      borderColor: LightThemeColors.uriColor,
                      transform: 'scale(1.02)',
                    }
                  : {},
              }}
            >
              {workflow.comingSoon && (
                <Chip
                  label="Coming Soon"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: LightThemeColors.uriColor,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
              )}
              <Box sx={{ mb: 2 }}>{workflow.icon}</Box>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#0d0e0f',
                }}
              >
                {workflow.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#6C727F',
                  mb: 1,
                }}
              >
                {workflow.description}
              </Typography>
              {!workflow.comingSoon && (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: LightThemeColors.uriColor,
                    fontWeight: 600,
                  }}
                >
                  {workflow.modules.length} module{workflow.modules.length !== 1 ? 's' : ''} • Click to {selectedWorkflows.includes(workflow.id) ? 'collapse' : 'expand'}
                </Typography>
              )}
            </Box>

            {/* Modules List */}
            <Collapse in={selectedWorkflows.includes(workflow.id)}>
              <Box sx={{ mt: 2, pl: 2 }}>
                {workflow.modules.map((module) => (
                  <Box
                    key={module.id}
                    onClick={() => handleModuleClick(module.id, module.href)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      mb: 1.5,
                      borderRadius: '12px',
                      boxShadow: '1px 1px 4px 2px #00000008',
                      border: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: LightThemeColors.uriColor,
                        backgroundColor: `${LightThemeColors.uriColor}05`,
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>{module.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#0d0e0f',
                        }}
                      >
                        {module.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: '#6C727F',
                        }}
                      >
                        {module.description}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        borderRadius: '8px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: LightThemeColors.uriColor,
                        '&:hover': {
                          backgroundColor: LightThemeColors.uriColor,
                          color: '#fff !important',
                        },
                      }}
                    >
                      Open
                    </Button>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GlobalServices;
