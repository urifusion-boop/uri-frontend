import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import { WORKFLOWS } from '@/constants/workflows';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useAuth } from '@/providers/AuthProvider';

const SelectModulePage = () => {
  const router = useRouter();
  const { workflow: workflowId } = router.query;
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!userDetails?.userId) {
      router.push('/login');
    }
  }, [userDetails, router]);

  const workflow = workflowId && typeof workflowId === 'string' ? WORKFLOWS[workflowId] : null;

  if (!workflow) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const handleContinue = () => {
    if (!selectedModule) {
      toast.error('Please select a module to start with');
      return;
    }

    // Navigate to completion screen with workflow and module
    router.push({
      pathname: `/onboarding/complete`,
      query: {
        workflow: workflowId,
        module: selectedModule,
      },
    });
  };

  const handleBack = () => {
    router.push('/onboarding/select-workflow');
  };

  return (
    <>
      <SeoHead title={`${workflow.name} Setup - Uri Creative`} />

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
            position: 'relative',
          }}
        >
          {/* Back Button */}
          <Box
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              color: themeColors.primary,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <FaArrowLeft size={16} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Back
            </Typography>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4, mt: 3 }}>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 26 },
                fontWeight: 700,
                color: '#0d0e0f',
                mb: 1,
              }}
            >
              {workflow.name} Setup
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 13, md: 15 },
                fontWeight: 400,
                color: '#6C727F',
                mb: 2,
              }}
            >
              Great choice! You'll get access to all of these:
            </Typography>

            {/* Modules List */}
            <Box
              sx={{
                maxWidth: 500,
                margin: '0 auto',
                backgroundColor: '#F9FAFB',
                borderRadius: 2,
                p: 2,
              }}
            >
              <List dense>
                {workflow.modules.map((module) => (
                  <ListItem key={module.id} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FaCheck color={themeColors.primary} size={14} />
                    </ListItemIcon>
                    <ListItemText
                      primary={module.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#0d0e0f',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: 14, md: 16 },
                fontWeight: 600,
                color: '#0d0e0f',
                mt: 3,
              }}
            >
              Which one would you like to start with?
            </Typography>
          </Box>

          {/* Module Cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {workflow.modules.map((module) => {
              const IconComponent = module.icon;
              const isSelected = selectedModule === module.id;

              return (
                <Grid item xs={12} sm={6} key={module.id}>
                  <Card
                    onClick={() => handleModuleSelect(module.id)}
                    sx={{
                      height: '100%',
                      minHeight: 160,
                      cursor: 'pointer',
                      border: isSelected
                        ? `2px solid ${themeColors.primary}`
                        : '2px solid transparent',
                      backgroundColor: isSelected
                        ? `${themeColors.primary}10`
                        : '#fff',
                      transition: 'all 0.3s ease-in-out',
                      borderRadius: '20px',
                      boxShadow: '1px 1px 6px 3px #00000011',
                      '&:hover': {
                        borderColor: themeColors.primary,
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        height: '100%',
                        p: 2.5,
                      }}
                    >
                      {/* Icon */}
                      <Box sx={{ mb: 1.5 }}>
                        <IconComponent
                          size={40}
                          color={isSelected ? themeColors.primary : '#6C727F'}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </Box>

                      {/* Title */}
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#0d0e0f',
                          mb: 0.75,
                        }}
                      >
                        {module.name}
                      </Typography>

                      {/* Description */}
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 400,
                          color: '#6C727F',
                          lineHeight: 1.4,
                        }}
                      >
                        {module.description}
                      </Typography>

                      {/* Checkmark for selected */}
                      {isSelected && (
                        <Box
                          sx={{
                            mt: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              backgroundColor: themeColors.primary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            ✓
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 11,
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
            disabled={!selectedModule}
            style={{
              width: '100%',
              padding: '12px',
              opacity: selectedModule ? 1 : 0.5,
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
            You can access all enabled modules from the sidebar
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SelectModulePage;
