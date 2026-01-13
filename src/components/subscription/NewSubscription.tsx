import { TrialService } from '@/api/TrialService';
import SocialListeningPricingSection from '@/components/pricing/SocialListeningPricingSection';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TrialActivationModal from '../trial/TrialActivationModal';

const NewSubscription = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const { userDetails } = useAuth();
  const router = useRouter();

  // Check if user is eligible for free trial
  useEffect(() => {
    const checkTrialEligibility = async () => {
      if (!userDetails?.userId) {
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          const { hasUsedFreeTrial, status } = response.responseData;
          // User is eligible if they haven't used trial and it's not started
          const eligible = !hasUsedFreeTrial && status === 'not_started';
          setIsTrialEligible(eligible);
          // Auto-show trial modal for eligible users
          if (eligible) {
            setShowTrialModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkTrialEligibility();
  }, [userDetails?.userId]);

  const handleTrialSuccess = () => {
    // Check if user has selected a primary module during onboarding
    const primaryModule = localStorage.getItem('primaryModule');

    if (primaryModule) {
      // Map module ID to route for new users
      const moduleRoutes: Record<string, string> = {
        'account-tracking': '/account-tracking',
        'keyword-tracking': '/keyword-tracking',
        'hashtag-tracking': '/hashtag-tracking',
        'lead-generation': '/leads-tracking',
        'content-management': '/content-management',
        alert: '/alert',
        'insight-assistant': '/uri-assistant',
      };

      router.push(moduleRoutes[primaryModule] || '/dashboard');
    } else {
      // Existing user without onboarding, go to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: '1500px',
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '20px',
          py: '64px',
          mt: '40px',
          mx: 'auto',
        }}
      >
        <Box sx={{ py: '16px', px: { xs: 2, md: 4 } }}>
          <SocialListeningPricingSection />
        </Box>
      </Box>

      {/* Trial Activation Modal - Auto-shows for eligible users */}
      {userDetails?.userId && isTrialEligible && <TrialActivationModal open={showTrialModal} onClose={() => setShowTrialModal(false)} onSuccess={handleTrialSuccess} userId={userDetails.userId} />}
    </>
  );
};

export default NewSubscription;
