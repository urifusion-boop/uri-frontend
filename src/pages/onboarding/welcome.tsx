import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import { useAuth } from '@/providers/AuthProvider';
import { OnboardingService } from '@/api/OnboardingService';

const WelcomePage = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!userDetails?.userId) {
      router.push('/onboarding/select-workflow');
      return;
    }

    try {
      setLoading(true);
      // Update step to 1 (welcome completed)
      await OnboardingService.updateOnboardingStep(userDetails.userId, { step: 1 });
      router.push('/onboarding/select-workflow');
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      // Continue anyway to not block user
      router.push('/onboarding/select-workflow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead title="Welcome to Uri Creative" />

      <Box
        sx={{
          background: themeColors.background,
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 2, md: 3 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            maxWidth: '450px',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: { xs: 4, md: 5 },
            boxShadow: '1px 1px 6px 3px #00000011',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Image
              src="/assets/images/logo.png"
              alt="Uri Logo"
              width={60}
              height={60}
            />
          </Box>

          {/* Welcome Heading */}
          <Typography
            sx={{
              fontSize: { xs: 24, md: 28 },
              fontWeight: 700,
              textAlign: 'center',
              color: '#0d0e0f',
              mb: 1,
            }}
          >
            Welcome to Uri Creative!
          </Typography>

          {/* Subtext */}
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              textAlign: 'center',
              color: '#6C727F',
              mb: 4,
            }}
          >
            Let's set up your workspace in under 30 seconds
          </Typography>

          {/* Get Started Button */}
          <CustomButton
            mode="primary"
            onClick={handleGetStarted}
            loading={loading}
            style={{
              width: '100%',
              padding: '14px',
            }}
          >
            Get Started
          </CustomButton>
        </Box>
      </Box>
    </>
  );
};

export default WelcomePage;
