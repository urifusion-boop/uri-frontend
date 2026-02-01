import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';

import { TrialService } from '@/api/TrialService';
import { triggerToast } from '@/components/atoms/CustomToast';
import LeadGenPricingSection from '@/components/pricing/LeadGenPricingSection';
import { UserJourneyCards } from '@/components/pricing/UserJourneyCards';
import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
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
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isFeatureLimitLoading = useFeatureLimitStore((state) => state.isLoading);

  // Check if user already has Social Listening Free plan active
  const isFreeSocialListeningActive = featureLimit?.subscriptionPlan === SubscriptionTypeEnum.SocialListeningFree && featureLimit?.subscriptionStatus === 'ACTIVE';

  // Check if user already has PAYG Lead Gen plan active
  const isPaygActive = featureLimit?.subscriptionPlan === SubscriptionTypeEnum.LeadsGen && featureLimit?.subscriptionStatus === 'ACTIVE';

  // Check if user is eligible for free trial
  useEffect(() => {
    const checkTrialEligibility = async () => {
      if (!userDetails?.userId) {
        // User not logged in - they're still eligible to try (will redirect to login)
        setIsTrialEligible(true);
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          const { hasUsedFreeTrial, status } = response.responseData;
          // User is eligible if they haven't used trial OR if trial status allows starting
          // (not_started means never started, but we should also allow if status check fails)
          const eligible = !hasUsedFreeTrial && (status === 'not_started' || status === undefined);
          setIsTrialEligible(eligible);
        } else {
          // API returned but no valid data - assume eligible
          setIsTrialEligible(true);
        }
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
        // On error, default to eligible (let the activation endpoint handle validation)
        setIsTrialEligible(true);
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

  const handlePlanSelection = (planType: string, planCode: string, amount?: number) => {
    // Handle Credit Bundles - redirect to credits purchase page
    if (planType === 'CREDIT_BUNDLES') {
      setShowPlansModal(false);
      router.push('/credits');
      return;
    }

    // Handle Free Trial
    if (planType === SubscriptionTypeEnum.FreeTrial) {
      if (!userDetails) {
        router.push('/auth/login?redirect=/settings?tab=subscription');
        return;
      }
      setShowPlansModal(false);
      setShowTrialModal(true);
      return;
    }

    // Handle Social Listening Free
    if (planType === SubscriptionTypeEnum.SocialListeningFree) {
      freeSubscription.mutate(planCode, {
        onSuccess: () => {
          setShowPlansModal(false);
          setActiveStep(4);
        },
        onError: (err: any) => {
          triggerToast('error', err?.message ?? 'Failed to activate free plan');
        },
      });
      return;
    }

    // Handle PAYG Lead Gen activation (no payment required, users fund wallet separately)
    if (planType === SubscriptionTypeEnum.LeadsGen) {
      freeSubscription.mutate(planCode, {
        onSuccess: () => {
          setShowPlansModal(false);
          setActiveStep(4);
        },
        onError: (err: any) => {
          triggerToast('error', err?.message ?? 'Failed to activate PAYG plan');
        },
      });
      return;
    }

    // Handle paid plans (Social Listening Paid, Enterprise) - show payment flow
    let planName = planType;
    if (planType === SubscriptionTypeEnum.SocialListeningPaid) {
      planName = 'Social listening Paid plan';
    } else if (planType === SubscriptionTypeEnum.Enterprise) {
      planName = 'Enterprise Plan';
    }

    const plan: SubscriptionPlan = {
      plan_code: planCode,
      plan_type: planType,
      name: planName,
      amount: amount || 0,
      description: '',
      interval: 'monthly',
      created_at: '',
      updated_at: '',
    };
    setSelectedPlan(plan);
    setShowPlansModal(false);
    setActiveStep(2);
  };

  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasAutoSelectedRef.current) return;

    const { plan } = router.query;
    if (plan === 'social_listening_paid') {
      hasAutoSelectedRef.current = true;
      handlePlanSelection(SubscriptionTypeEnum.SocialListeningPaid, 'SOCIAL_LISTENING_PAID_MONTHLY', 1000000);
    } else if (plan === 'start_trial') {
      hasAutoSelectedRef.current = true;
      setShowTrialModal(true);
    }
  }, [router.isReady, router.query]);

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
              onStartTrial={() => {
                if (!userDetails) {
                  router.push('/auth/login?redirect=/settings?tab=subscription');
                  return;
                }
                setShowTrialModal(true);
              }}
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
              onStartPaidSocialListening={() => {
                if (!userDetails) {
                  router.push('/auth/login?redirect=/settings?tab=subscription');
                  return;
                }
                handlePlanSelection(SubscriptionTypeEnum.SocialListeningPaid, 'SOCIAL_LISTENING_PAID_MONTHLY', 1000000);
              }}
              onActivatePayg={() => {
                if (!userDetails) {
                  router.push('/auth/login?redirect=/settings?tab=subscription');
                  return;
                }

                freeSubscription.mutate('LEADS_GEN_MONTHLY', {
                  onSuccess: () => {
                    setActiveStep(4);
                  },
                  onError: (err: any) => {
                    triggerToast('error', err?.message ?? 'Failed to activate PAYG plan');
                  },
                });
              }}
              isTrialDisabled={!isTrialEligible}
              trialButtonText={checkingEligibility ? 'Loading...' : !isTrialEligible ? 'Trial Already Used' : 'Start Free Trial'}
              isFreeSocialListeningActive={isFreeSocialListeningActive}
              isFreeSocialListeningLoading={isFeatureLimitLoading}
              isPaygActive={isPaygActive}
              isPaygLoading={freeSubscription.isLoading}
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
      {userDetails?.userId && <TrialActivationModal open={showTrialModal} onClose={() => setShowTrialModal(false)} onSuccess={handleTrialSuccess} userId={userDetails.userId} />}

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
          <SubscriptionPlansList onSelectPlan={handlePlanSelection} currentPlanType={featureLimit?.subscriptionPlan} isLoading={freeSubscription.isLoading} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewSubscription;
