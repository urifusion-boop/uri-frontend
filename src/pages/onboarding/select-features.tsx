import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import { useAuth } from '@/providers/AuthProvider';
import { OnboardingService } from '@/api/OnboardingService';
import { toast } from 'react-hot-toast';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { BiBot } from 'react-icons/bi';
import { FaFolder } from 'react-icons/fa';
import { HiHashtag } from 'react-icons/hi';
import { MdRecordVoiceOver } from 'react-icons/md';
import { PiBellRingingFill } from 'react-icons/pi';

const MINIMUM_MODULES = 3;
const MAXIMUM_MODULES = 7;

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const availableModules: Module[] = [
  {
    id: 'account-tracking',
    title: 'Account Tracking',
    description: 'Track your account performance and growth over time.',
    icon: <ChartLine style={{ color: '#CD1B78', width: 50, height: 50 }} />,
  },
  {
    id: 'keyword-tracking',
    title: 'Keyword Tracking',
    description: 'Track your keyword performance and growth over time.',
    icon: <HeartRateSearch style={{ color: '#CD1B78', width: 50, height: 50 }} />,
  },
  {
    id: 'content-management',
    title: 'Content Management',
    description: 'Manage your content and track its performance over time.',
    icon: <FaFolder style={{ color: '#CD1B78', width: 50, height: 50 }} />,
  },
  {
    id: 'hashtag-tracking',
    title: 'Hashtag Tracking',
    description: 'Track your hashtag performance and growth over time.',
    icon: <HiHashtag size={50} color="#CD1B78" />,
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation',
    description: 'Generate leads for your business.',
    icon: <MdRecordVoiceOver size={50} color="#CD1B78" />,
  },
  {
    id: 'alert',
    title: 'Alert',
    description: 'Get alerts based on your keywords.',
    icon: <PiBellRingingFill size={50} color="#CD1B78" />,
  },
  {
    id: 'insight-assistant',
    title: 'Insight Assistant',
    description: 'Get insights and recommendations for your business.',
    icon: <BiBot size={50} color="#CD1B78" />,
  },
];

const SelectFeaturesPage = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        if (prev.length >= MAXIMUM_MODULES) {
          toast.error(`You can select up to ${MAXIMUM_MODULES} features only`);
          return prev;
        }
        return [...prev, moduleId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedModules.length < MINIMUM_MODULES) {
      toast.error(`Please select at least ${MINIMUM_MODULES} features`);
      return;
    }

    if (!userDetails?.userId) {
      toast.error('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const response = await OnboardingService.completeOnboarding(userDetails.userId, {
        selectedModules,
      });

      if (response.status) {
        toast.success('Onboarding completed successfully!');

        // Store selected modules in localStorage to trigger tours
        localStorage.setItem('newUserModules', JSON.stringify(selectedModules));

        router.push('/dashboard');
      } else {
        toast.error(response.responseMessage || 'Failed to complete onboarding');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error?.response?.data?.responseMessage || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!userDetails?.userId) {
      toast.error('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const response = await OnboardingService.skipOnboarding(userDetails.userId);

      if (response.status) {
        toast.success('All features enabled!');
        router.push('/dashboard');
      } else {
        toast.error(response.responseMessage || 'Failed to skip onboarding');
      }
    } catch (error: any) {
      console.error('Skip onboarding error:', error);
      toast.error(error?.response?.data?.responseMessage || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isModuleSelected = (moduleId: string) => selectedModules.includes(moduleId);
  const canContinue = selectedModules.length >= MINIMUM_MODULES;

  return (
    <>
      <SeoHead title="Choose Your Features" />

      <Box
        sx={{
          background: themeColors.background,
          minHeight: '100vh',
          padding: { xs: 2, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          <Typography
            onClick={() => router.back()}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: themeColors.primary,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            ← Back
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 700,
              color: '#0d0e0f',
              textAlign: 'center',
              flex: 1,
            }}
          >
            Choose Your Tools
          </Typography>

          <Typography
            onClick={handleSkip}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: themeColors.primary,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Skip →
          </Typography>
        </Box>

        {/* Instructions */}
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: '#434343',
              mb: 0.5,
            }}
          >
            Select at least {MINIMUM_MODULES} features to get started
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: '#6C727F',
            }}
          >
            (You can add or remove features anytime from settings)
          </Typography>
        </Box>

        {/* Module Grid */}
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            mb: 4,
          }}
        >
          <Grid container spacing={3}>
            {availableModules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Box
                  onClick={() => handleModuleToggle(module.id)}
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    boxShadow: '1px 1px 6px 3px #00000011',
                    border: '2px solid',
                    borderColor: isModuleSelected(module.id) ? '#CD1B78' : 'transparent',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    backgroundColor: isModuleSelected(module.id) ? '#FFF0F8' : '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      borderColor: '#CD1B78',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#FFF0F8',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {module.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#0d0e0f',
                      mb: 1,
                    }}
                  >
                    {module.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      textAlign: 'center',
                      color: '#6C727F',
                      mb: 2,
                    }}
                  >
                    {module.description}
                  </Typography>

                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {isModuleSelected(module.id) ? (
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#CD1B78',
                        }}
                      >
                        ✓ Selected
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#9CA3AF',
                        }}
                      >
                        Select
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Progress Indicator */}
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: selectedModules.length >= MINIMUM_MODULES ? '#4CAF50' : '#6C727F',
              mb: 1,
            }}
          >
            {selectedModules.length}/{MAXIMUM_MODULES} features selected
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {Array.from({ length: MAXIMUM_MODULES }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: index < selectedModules.length ? '#CD1B78' : '#E0E0E0',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Continue Button */}
        <Box
          sx={{
            maxWidth: '500px',
            mx: 'auto',
          }}
        >
          <CustomButton
            mode="primary"
            onClick={handleContinue}
            disabled={!canContinue || loading}
            loading={loading}
            style={{
              width: '100%',
              padding: '14px',
              opacity: canContinue && !loading ? 1 : 0.5,
            }}
          >
            Continue to Dashboard →
          </CustomButton>

          {!canContinue && (
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
                textAlign: 'center',
                color: '#FB5A36',
                mt: 1,
              }}
            >
              Please select at least {MINIMUM_MODULES} features
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SelectFeaturesPage;
