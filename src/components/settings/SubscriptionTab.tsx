import { TrialService, TrialStatus } from '@/api/TrialService';
import { LightThemeColors } from '@/configs/colors.config';
import { useActiveSubscription } from '@/hooks/subscription/activeSubscription.hook';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Spinner from '../loaders/Spinner';
import HasActiveSubscription from '../subscription/HasActiveSubscription';
import HasActiveTrial from '../subscription/HasActiveTrial';
import NewSubscription from '../subscription/NewSubscription';

const SubscriptionTab = () => {
  const { userDetails } = useAuth();
  const { activeSubscription, isLoadingActiveSubscription } = useActiveSubscription();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loadingTrial, setLoadingTrial] = useState(true);

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
  if (userDetails?.subscriptionStatus === SubscriptionStatusEnum.ACTIVE) {
    return <HasActiveSubscription activeSubscription={activeSubscription} />;
  }

  // Priority 2: Active or Expired Trial
  if (trialStatus && (trialStatus.status === 'active' || trialStatus.status === 'expired')) {
    return <HasActiveTrial />;
  }

  // Priority 3: No Subscription & No Trial - Show Payment Flow
  return <NewSubscription />;
};

export default SubscriptionTab;
