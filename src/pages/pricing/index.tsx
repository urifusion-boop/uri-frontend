import { TrialService } from '@/api/TrialService';
import { triggerToast } from '@/components/atoms/CustomToast';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import LeadGenPricingSection from '@/components/pricing/LeadGenPricingSection';
import UserJourneyCards from '@/components/pricing/UserJourneyCards';
import TrialActivationModal from '@/components/trial/TrialActivationModal';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function PricingPage() {
  const { userDetails } = useAuth();
  const router = useRouter();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const { freeSubscription } = useSubscription();

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
          const eligible = !hasUsedFreeTrial && status === 'not_started';
          setIsTrialEligible(eligible);
        }
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkTrialEligibility();
  }, [userDetails]);

  return (
    <div className="bg-[#FFFCFE]">
      <Navigation />
      <div className="container pt-20">
        {/* Trial Banner for Eligible Users */}
        {!checkingEligibility && isTrialEligible && userDetails && (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #CD1B78 0%, #E91E8C 100%)',
              borderRadius: '16px',
              py: 2.5,
              px: 4,
              mb: 4,
              mt: 2,
              textAlign: 'center',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography sx={{ fontSize: '36px', lineHeight: 1 }}>🎉</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Start Your 7-Day Free Trial
            </Typography>
            <Typography sx={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.3 }}>Try all premium features free for 7 days • No credit card required</Typography>
            <Button
              variant="contained"
              onClick={() => setShowTrialModal(true)}
              sx={{
                backgroundColor: 'white',
                color: '#CD1B78',
                fontSize: '15px',
                fontWeight: 600,
                py: 1.25,
                px: 3.5,
                borderRadius: '12px',
                mt: 0.5,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Start Free Trial Now
            </Button>
          </Box>
        )}

        {/* Page Header */}
        <Box textAlign="center" mb={2}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#000',
              fontSize: { xs: '32px', md: '48px' },
              mb: 1,
            }}
          >
            Simple, <span style={{ color: '#CD1B78' }}>Transparent</span> Pricing
          </Typography>
          <Typography
            sx={{
              color: '#080808',
              fontSize: { xs: '16px', md: '20px' },
              fontWeight: 500,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Pay only for what you use. No hidden fees, no long-term commitments.
          </Typography>
        </Box>

        {/* User Journey Cards - Shows the 4 user types */}
        <UserJourneyCards
          onStartTrial={() => {
            if (userDetails) {
              if (isTrialEligible) {
                setShowTrialModal(true);
              }
            } else {
              router.push('/auth/login?redirect=/pricing');
            }
          }}
          onStartFreeSocialListening={() => {
            if (!userDetails) {
              router.push('/auth/login?redirect=/pricing');
              return;
            }

            freeSubscription.mutate('SOCIAL_LISTENING_FREE_MONTHLY', {
              onSuccess: () => {
                triggerToast('success', 'Social Listening Free activated');
                router.push('/dashboard');
              },
              onError: (err: any) => {
                triggerToast('error', err?.message ?? 'Failed to activate free plan');
              },
            });
          }}
          trialButtonText={checkingEligibility ? 'Loading...' : userDetails && !isTrialEligible ? 'Trial Already Used' : 'Start Free Trial'}
          isTrialDisabled={checkingEligibility || (!!userDetails && !isTrialEligible)}
        />

        {/* Lead Generation Pricing Section */}
        <LeadGenPricingSection />
      </div>

      <Footer />

      {/* Trial Activation Modal */}
      {userDetails?.userId && <TrialActivationModal open={showTrialModal} onClose={() => setShowTrialModal(false)} onSuccess={() => router.push('/dashboard')} userId={userDetails.userId} />}
    </div>
  );
}

export default PricingPage;
