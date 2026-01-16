import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';

import { TrialService } from '@/api/TrialService';
import { triggerToast } from '@/components/atoms/CustomToast';
import LeadGenPricingSection from '@/components/pricing/LeadGenPricingSection';
import { UserJourneyCards } from '@/components/pricing/UserJourneyCards';
import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import TrialActivationModal from '../trial/TrialActivationModal';
import ExploreUri from './general/ExploreUri';
import MakePayment from './general/MakePayment';
import PaymentMethod from './general/PaymentMethod';

const NewSubscription = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<SubscriptionResponseDto | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const { userDetails } = useAuth();
  const { freeSubscription } = useSubscription();
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

  const handlePlanSelection = (plan: SubscriptionPlan) => {
    if (plan.plan_type === SubscriptionTypeEnum.SocialListeningFree) {
      freeSubscription.mutate(plan.plan_code, {
        onSuccess: () => {
          setSelectedPlan(plan);
          setShowPlansModal(false);
          setActiveStep(4);
        },
        onError: (err: any) => {
          triggerToast('error', err?.message ?? 'Failed to activate free plan');
        },
      });
      return;
    }

    setSelectedPlan(plan);
    setShowPlansModal(false);
    setActiveStep(2);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: '1500px',
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '20px',
          py: '40px',
          mt: '20px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
        }}
      >
        {activeStep === 1 && (
          <Box>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#141414', mb: 1 }}>
                Choose Your Plan
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B6B6B' }}>
                Select the plan that best fits your needs
              </Typography>
            </Box>

            <UserJourneyCards
              onStartTrial={() => setShowTrialModal(true)}
              onViewPaidPlans={() => setShowPlansModal(true)}
              onStartFreeSocialListening={() => {
                if (!userDetails) {
                  router.push('/auth/login?redirect=/settings?tab=subscription');
                  return;
                }

                freeSubscription.mutate('SOCIAL_LISTENING_FREE_MONTHLY', {
                  onSuccess: () => {
                    setActiveStep(4);
                  },
                  onError: (err: any) => {
                    triggerToast('error', err?.message ?? 'Failed to activate free plan');
                  },
                });
              }}
              isTrialDisabled={!isTrialEligible}
              trialButtonText={checkingEligibility ? 'Loading...' : !isTrialEligible ? 'Trial Already Used' : 'Start Free Trial'}
            />

            <Box sx={{ mt: 8 }}>
              <LeadGenPricingSection />
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Box mb={4}>
              <IconButton onClick={() => setActiveStep(1)} sx={{ mb: 2 }}>
                <Typography sx={{ textDecoration: 'underline', fontWeight: 600 }}>Back to Plans</Typography>
              </IconButton>
            </Box>
            <MakePayment selectedPlan={selectedPlan} setStep={() => setActiveStep(3)} setTransactionDetails={setTransactionDetails} />
          </Box>
        )}

        {activeStep === 3 && <PaymentMethod selectedPlan={selectedPlan} setStep={() => setActiveStep(4)} transactionDetails={transactionDetails} />}

        {activeStep === 4 && <ExploreUri />}
      </Box>

      {/* Trial Activation Modal */}
      {userDetails?.userId && isTrialEligible && <TrialActivationModal open={showTrialModal} onClose={() => setShowTrialModal(false)} onSuccess={handleTrialSuccess} userId={userDetails.userId} />}

      {/* Plan Selection Modal */}
      <Dialog open={showPlansModal} onClose={() => setShowPlansModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Select Subscription Plan
          </Typography>
          <IconButton onClick={() => setShowPlansModal(false)}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SubscriptionPlansList onSelectPlan={handlePlanSelection} selectedPlan={selectedPlan?.plan_code} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewSubscription;
