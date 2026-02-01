import { triggerToast } from '@/components/atoms/CustomToast';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import LeadGenPricingSection from '@/components/pricing/LeadGenPricingSection';
import UserJourneyCards from '@/components/pricing/UserJourneyCards';
import useFeatureLimit from '@/hooks/subscription/featureLimit.hooks';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';

function PricingPage() {
  const { userDetails } = useAuth();
  const router = useRouter();
  const { freeSubscription, getUserDetails } = useSubscription();
  const { data: featureLimit, isLoading: isLoadingFeatureLimit, refetch: refetchFeatureLimit } = useFeatureLimit(userDetails?.userId ?? '');
  const isFreeSocialListeningActive = !!userDetails && featureLimit?.subscriptionPlan === SubscriptionTypeEnum.SocialListeningFree && featureLimit.subscriptionStatus === 'ACTIVE';
  const isFreeSocialListeningLoading = !!userDetails && isLoadingFeatureLimit;
  const isPaygActive = !!userDetails && featureLimit?.subscriptionPlan === SubscriptionTypeEnum.LeadsGen && featureLimit.subscriptionStatus === 'ACTIVE';

  return (
    <div className="bg-[#FFFCFE]">
      <Navigation />
      <div className="container pt-20">
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
            const redirectUrl = '/settings?tab=subscription&plan=start_trial';
            if (!userDetails) {
              router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
            } else {
              router.push(redirectUrl);
            }
          }}
          onStartFreeSocialListening={() => {
            if (!userDetails) {
              router.push('/auth/login?redirect=/pricing');
              return;
            }

            freeSubscription.mutate('SOCIAL_LISTENING_FREE_MONTHLY', {
              onSuccess: async () => {
                triggerToast('success', 'Social Listening Free activated');
                try {
                  await getUserDetails.mutateAsync();
                  await refetchFeatureLimit();
                } catch (error) {
                  console.error('Error refetching user data after activating free plan', error);
                }
                router.push('/dashboard');
              },
              onError: (err: any) => {
                triggerToast('error', err?.message ?? 'Failed to activate free plan');
              },
            });
          }}
          onStartPaidSocialListening={() => {
            const redirectUrl = '/settings?tab=subscription&plan=social_listening_paid';
            if (!userDetails) {
              router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
            } else {
              router.push(redirectUrl);
            }
          }}
          onActivatePayg={() => {
            if (!userDetails) {
              router.push('/auth/login?redirect=/pricing');
              return;
            }

            freeSubscription.mutate('LEADS_GEN_MONTHLY', {
              onSuccess: async () => {
                triggerToast('success', 'PAYG Lead Gen activated');
                try {
                  await getUserDetails.mutateAsync();
                  await refetchFeatureLimit();
                } catch (error) {
                  console.error('Error refetching user data after activating PAYG plan', error);
                }
                router.push('/dashboard');
              },
              onError: (err: any) => {
                triggerToast('error', err?.message ?? 'Failed to activate PAYG plan');
              },
            });
          }}
          isFreeSocialListeningActive={isFreeSocialListeningActive}
          isFreeSocialListeningLoading={isFreeSocialListeningLoading}
          isPaygActive={isPaygActive}
          isPaygLoading={freeSubscription.isLoading}
        />

        {/* Lead Generation Pricing Section */}
        <LeadGenPricingSection />
      </div>

      <Footer />
    </div>
  );
}

export default PricingPage;
