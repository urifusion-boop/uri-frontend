import { TrialService, TrialStatus } from '@/api/TrialService';
import { LightThemeColors } from '@/configs/colors.config';
import useFeatureLimit from '@/hooks/subscription/featureLimit.hooks';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from '../loaders/Spinner';
import HasActiveSubscription from '../subscription/HasActiveSubscription';
import HasActiveTrial from '../subscription/HasActiveTrial';
import NewSubscription from '../subscription/NewSubscription';

const SubscriptionTab = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { data: featureLimit, isLoading: isLoadingFeatureLimit } = useFeatureLimit(userDetails?.userId ?? '');
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loadingTrial, setLoadingTrial] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (router.query.upgrade === 'true') {
      setShowUpgrade(true);
    }
  }, [router.query]);

  // Fetch trial status
  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (!userDetails?.userId) {
        setLoadingTrial(false);
        return;
      }

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          setTrialStatus(response.responseData);
        }
      } catch (error) {
        console.error('Error fetching trial status:', error);
      } finally {
        setLoadingTrial(false);
      }
    };

    fetchTrialStatus();
  }, [userDetails?.userId]);

  if (isLoadingFeatureLimit || loadingTrial) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Spinner color={LightThemeColors.uriColor} />
      </Box>
    );
  }

  const hasActiveSubscription = !!featureLimit?.subscriptionPlan && featureLimit.subscriptionPlan !== SubscriptionTypeEnum.FreeTrial;

  // Priority 1: Active Subscription (including free plans)
  if (hasActiveSubscription && !showUpgrade && featureLimit) {
    return <HasActiveSubscription featureLimit={featureLimit} />;
  }

  if (showUpgrade) {
    return <NewSubscription />;
  }

  // Priority 2: Active or Expired Trial (only when no subscription)
  if (!hasActiveSubscription && trialStatus && (trialStatus.status === 'active' || trialStatus.status === 'expired')) {
    return <HasActiveTrial onUpgrade={() => setShowUpgrade(true)} />;
  }

  // Priority 3: No Subscription & No Trial - Show Payment Flow
  return <NewSubscription />;
};

export default SubscriptionTab;
