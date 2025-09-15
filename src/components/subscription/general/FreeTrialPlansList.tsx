import { Box } from '@mui/material';
import { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';

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
  const { trialSubscription, getUserDetails } = useSubscription();
  const { userDetails } = useAuth();

  const freeTrialPlan: SubscriptionPlanDto = {
    name: SubscriptionTypeEnum.FreeTrial,
    plan_code: 'TRIAL_000',
    interval: 'three_days',
    amount: 0,
    description: 'URI free trial plan',
    created_at: '',
    updated_at: '',
    plan_type: SubscriptionTypeEnum.FreeTrial,
  };

  const handleTrialStart = async () => {
    try {
      if (!userDetails?.userId || !userDetails?.email) return;
      await trialSubscription.mutateAsync({
        user_id: userDetails.userId,
        email: userDetails.email,
      });

      await getUserDetails.mutateAsync(); // refresh auth and subscription info
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
        duration="/3 days"
        planType={SubscriptionTypeEnum.FreeTrial}
        planFeatures={planFeatures[SubscriptionTypeEnum.FreeTrial]}
        onSelect={handleTrialStart}
        price={freeTrialPlan.amount}
        selected={selectedPlan === freeTrialPlan.name}
        icon={FaRegStar}
        subTitle="valid for 3 days"
        description="Try it free before choosing a paid plan"
        buttonText={trialSubscription.isLoading || getUserDetails.isLoading ? 'Activating...' : 'Activate Free Trial'}
      />
    </Box>
  );
};

export default FreeTrialPlansList;
