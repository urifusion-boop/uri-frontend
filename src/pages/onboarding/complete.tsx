import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import { WORKFLOWS, getWorkflowModules, getModuleRoute } from '@/constants/workflows';
import { OnboardingService } from '@/api/OnboardingService';
import { useAuth } from '@/providers/AuthProvider';

const CompletePage = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const { userDetails, saveUserDetails } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const { workflow, module } = router.query;
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const completeOnboarding = async () => {
      // Prevent double execution
      if (hasCompletedRef.current) {
        return;
      }

      // Check authentication first
      if (!userDetails?.userId) {
        router.push('/login');
        return;
      }

      // Mark as completed to prevent re-execution
      hasCompletedRef.current = true;

      // Validate query params
      if (!workflow || !module) {
        toast.error('Missing workflow or module selection');
        router.push('/onboarding/select-workflow');
        return;
      }

      // Validate workflow exists
      const selectedWorkflow = WORKFLOWS[workflow as string];
      if (!selectedWorkflow) {
        toast.error('Invalid workflow selected');
        router.push('/onboarding/select-workflow');
        return;
      }

      try {
        // Get user ID from auth context
        const userId = userDetails?.userId;
        if (!userId) {
          toast.error('User not found. Please login again.');
          router.push('/login');
          return;
        }

        // Get all modules for the selected workflow
        const enabledModules = getWorkflowModules(workflow as string);

        // Call backend to complete onboarding
        const response = await OnboardingService.completeOnboarding(userId, {
          primaryWorkflow: workflow as string,
          primaryModule: module as string,
          enabledModules,
        });

        if (response.status) {
          const { redirectTo, tourKey, enabledWorkflows, enabledModules, primaryWorkflow, primaryModule } = response.responseData;

          // Update userDetails in AuthProvider with new workflow data
          if (userDetails) {
            saveUserDetails({
              ...userDetails,
              onboardingCompleted: true,
              primaryWorkflow: primaryWorkflow,
              primaryModule: primaryModule,
              enabledWorkflows: enabledWorkflows,
              enabledModules: enabledModules,
              lastAccessedModule: primaryModule,
            });
          }

          // Set flag to enable module tours (auto-start on module pages)
          localStorage.setItem('showModuleTours', 'true');

          // Success
          toast.success('Welcome to Uri Creative! 🎉', {
            duration: 3000,
          });

          // Wait a moment for toast to show
          setTimeout(() => {
            // For lead modules, always redirect to form page on first onboarding
            const moduleId = module as string;
            if (moduleId.includes('-leads')) {
              const formRoutes: Record<string, string> = {
                'individual-leads': '/leads-tracking/forms/manage?type=individual',
                'organization-leads': '/leads-tracking/forms/manage?type=organization',
                'conversational-leads': '/leads-tracking/forms/manage?type=conversational',
              };
              router.push(formRoutes[moduleId] || redirectTo || getModuleRoute(moduleId));
            } else {
              // Redirect to the module page
              router.push(redirectTo || getModuleRoute(moduleId));
            }
          }, 500);
        } else {
          throw new Error('Failed to complete onboarding');
        }
      } catch (error) {
        console.error('Onboarding completion error:', error);
        toast.error('Failed to complete onboarding. Please try again.');

        // Redirect back to workflow selection on error
        setTimeout(() => {
          router.push('/onboarding/select-workflow');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    // Only run if query params are available
    if (router.isReady && workflow && module) {
      completeOnboarding();
    }
  }, [router.isReady, workflow, module, router, themeColors]);

  return (
    <>
      <SeoHead title="Completing Setup - Uri Creative" />

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
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: { xs: 3, md: 4 },
            boxShadow: '1px 1px 6px 3px #00000011',
            textAlign: 'center',
          }}
        >
          {/* Loading Spinner */}
          <CircularProgress
            size={60}
            sx={{
              color: themeColors.primary,
              mb: 3,
            }}
          />

          {/* Processing Text */}
          <Typography
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 700,
              color: '#0d0e0f',
              mb: 2,
            }}
          >
            Setting up your workspace...
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, md: 16 },
              fontWeight: 400,
              color: '#6C727F',
            }}
          >
            {workflow && module
              ? `Preparing ${WORKFLOWS[workflow as string]?.name || workflow}...`
              : 'Loading...'}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default CompletePage;
