import { TrialService, TrialStatus } from '@/api/TrialService';
import { LightThemeColors } from '@/configs/colors.config';
import { useActiveSubscription } from '@/hooks/subscription/activeSubscription.hook';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
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
  const { activeSubscription, isLoadingActiveSubscription } = useActiveSubscription();
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

  if (isLoadingActiveSubscription || loadingTrial) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Spinner color={LightThemeColors.uriColor} />
      </Box>
    );
  }

  // Priority 1: Active Subscription
  if (userDetails?.subscriptionStatus === SubscriptionStatusEnum.ACTIVE && !showUpgrade) {
    return <HasActiveSubscription activeSubscription={activeSubscription} />;
  }

  if (showUpgrade) {
    return <NewSubscription />;
  }

  // Priority 2: Active or Expired Trial
  if (trialStatus && (trialStatus.status === 'active' || trialStatus.status === 'expired')) {
    return <HasActiveTrial onUpgrade={() => setShowUpgrade(true)} />;
  }

  // Priority 3: No Subscription & No Trial - Show Payment Flow
  return <NewSubscription />;
};

export default SubscriptionTab;
