import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { useRouter } from 'next/router';
import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import { WORKFLOW_LIST } from '@/constants/workflows';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/providers/AuthProvider';

const SelectWorkflowPage = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!userDetails?.userId) {
      router.push('/login');
    }
  }, [userDetails, router]);

  const handleWorkflowSelect = (workflowId: string) => {
    const workflow = WORKFLOW_LIST.find(w => w.id === workflowId);

    if (!workflow) return;

    // Handle "Coming Soon" workflows
    if (workflow.comingSoon) {
      toast.info(`${workflow.name} is coming soon! Please choose another workflow.`, {
        duration: 3000,
      });
      return;
    }

    setSelectedWorkflow(workflowId);
  };

  const handleContinue = () => {
    if (!selectedWorkflow) {
      toast.error('Please select a workflow to continue');
      return;
    }

    const workflow = WORKFLOW_LIST.find(w => w.id === selectedWorkflow);

    if (!workflow) return;

    // After workflow selection, go to business details form
    router.push({
      pathname: `/onboarding/business-details`,
      query: {
        workflow: selectedWorkflow,
      },
    });
  };

  return (
    <>
      <SeoHead title="Select Your Workflow - Uri Creative" />

      <Box
        sx={{
          background: themeColors.background,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: '900px',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: { xs: 3, md: 4 },
            boxShadow: '1px 1px 6px 3px #00000011',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              sx={{
                fontSize: { xs: 24, md: 28 },
                fontWeight: 700,
                color: '#0d0e0f',
                mb: 1,
              }}
            >
              What would you like to do today?
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, md: 16 },
                fontWeight: 400,
                color: '#6C727F',
              }}
            >
              Pick one to get started — you can always add more later
            </Typography>
          </Box>

          {/* Workflow Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {WORKFLOW_LIST.map((workflow) => {
              const IconComponent = workflow.icon;
              const isSelected = selectedWorkflow === workflow.id;
              const isComingSoon = workflow.comingSoon;

              return (
                <Grid item xs={12} md={4} key={workflow.id}>
                  <Card
                    onClick={() => handleWorkflowSelect(workflow.id)}
                    sx={{
                      height: '100%',
                      minHeight: 220,
                      cursor: isComingSoon ? 'not-allowed' : 'pointer',
                      border: isSelected
                        ? `2px solid ${themeColors.primary}`
                        : '2px solid transparent',
                      backgroundColor: isSelected
                        ? `${themeColors.primary}10`
                        : '#fff',
                      opacity: isComingSoon ? 0.6 : 1,
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      borderRadius: '20px',
                      boxShadow: '1px 1px 6px 3px #00000011',
                      '&:hover': !isComingSoon
                        ? {
                            borderColor: themeColors.primary,
                            transform: 'scale(1.02)',
                          }
                        : {},
                    }}
                  >
                    {isComingSoon && (
                      <Chip
                        label="Coming Soon"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: themeColors.primary,
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      />
                    )}

                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        height: '100%',
                        p: 3,
                      }}
                    >
                      {/* Icon */}
                      <Box sx={{ mb: 2 }}>
                        <IconComponent
                          size={50}
                          color={isSelected ? themeColors.primary : '#6C727F'}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                      </Box>

                      {/* Title */}
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#0d0e0f',
                          mb: 1,
                        }}
                      >
                        {workflow.name}
                      </Typography>

                      {/* Description */}
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 400,
                          color: '#6C727F',
                          lineHeight: 1.5,
                        }}
                      >
                        {workflow.description}
                      </Typography>

                      {/* Checkmark for selected */}
                      {isSelected && (
                        <Box
                          sx={{
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: themeColors.primary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 14,
                              fontWeight: 'bold',
                            }}
                          >
                            ✓
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: themeColors.primary,
                            }}
                          >
                            Selected
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Continue Button */}
          <CustomButton
            mode="primary"
            onClick={handleContinue}
            disabled={!selectedWorkflow}
            style={{
              width: '100%',
              padding: '12px',
              opacity: selectedWorkflow ? 1 : 0.5,
            }}
          >
            Continue →
          </CustomButton>

          {/* Footer Text */}
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              textAlign: 'center',
              color: '#9CA3AF',
              mt: 2,
            }}
          >
            Takes less than 30 seconds
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SelectWorkflowPage;
