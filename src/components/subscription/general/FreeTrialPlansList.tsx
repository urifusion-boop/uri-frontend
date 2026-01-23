import { Box } from '@mui/material';
import { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';

import { TrialService } from '@/api/TrialService';
import { triggerToast } from '@/components/atoms/CustomToast';
import ExploreUri from '@/components/subscription/general/ExploreUri';
import SubscriptionPlan from '@/components/subscription/general/SubscriptionPlan';
import { planFeatures } from '@/data/subscription';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { SubscriptionPlan as SubscriptionPlanDto } from '@/models/dtos/SubscriptionDto';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';

interface Props {
  onSelectPlan: (plan: SubscriptionPlanDto) => void;
  selectedPlan?: string;
}

const FreeTrialPlansList = ({ onSelectPlan, selectedPlan }: Props) => {
  const [trialComplete, setTrialComplete] = useState(false);
  const { getUserDetails } = useSubscription();
  const { userDetails, saveUserTokens } = useAuth();

  const freeTrialPlan: SubscriptionPlanDto = {
    name: SubscriptionTypeEnum.FreeTrial,
    plan_code: 'TRIAL_7_DAY_FREE',
    interval: 'seven_days',
    amount: 0,
    description: 'URI 7-day free trial',
    created_at: '',
    updated_at: '',
    plan_type: SubscriptionTypeEnum.FreeTrial,
  };

  const handleTrialStart = async () => {
    try {
      if (!userDetails?.userId) return;
      const response = await TrialService.activateTrial(userDetails.userId);
      if (!response?.status) {
        triggerToast('error', response?.responseMessage ?? 'Failed to activate trial');
        return;
      }
      const accessToken = response?.responseData?.accessToken;
      const refreshToken = response?.responseData?.refreshToken;
      if (accessToken && refreshToken) {
        // Save tokens to both localStorage AND AuthProvider context
        // This ensures getUserDetails uses the new tokens, not stale ones
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        saveUserTokens({ accessToken, refreshToken });
      }
      await getUserDetails.mutateAsync();
      setTrialComplete(true);
    } catch (error: any) {
      triggerToast('error', error?.message ?? 'Failed to activate trial');
    }
  };

  console.log('userDetails to check subscription : ', userDetails);
  if (trialComplete && userDetails?.hasUsedFreeTrial) {
    return <ExploreUri />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: { xs: '30px', md: '60px' },
      }}
    >
      <SubscriptionPlan
        key={freeTrialPlan.plan_code}
        duration="/7 days"
        planType={SubscriptionTypeEnum.FreeTrial}
        planFeatures={planFeatures[SubscriptionTypeEnum.FreeTrial]}
        onSelect={handleTrialStart}
        price={freeTrialPlan.amount}
        selected={selectedPlan === freeTrialPlan.name}
        icon={FaRegStar}
        subTitle="valid for 7 days"
        description="Start your 7-day free trial"
        buttonText={getUserDetails.isLoading ? 'Activating...' : 'Start Free Trial Now'}
      />
    </Box>
  );
};

export default FreeTrialPlansList;
