import { SubscriptionDurationEnum, SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { Box, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import HorizontalSlider from '@/components/atoms/HorizontalSlider';
import LoaderWrapper from '@/components/atoms/LoaderWrapper';
import Toggle from '@/components/atoms/Toggle';
import SubscriptionPlan from '@/components/subscription/general/SubscriptionPlan';
import { planFeatures } from '@/data/subscription';
import { useSubscriptionPlans } from '@/hooks/subscription/subscriptionPlans.hook';
import { SubscriptionPlan as SubscriptionPlanDto } from '@/models/dtos/SubscriptionDto';
import { IconType } from 'react-icons';
import { BiBriefcase } from 'react-icons/bi';
import { IoDiamondOutline } from 'react-icons/io5';
import { PiStackSimpleFill } from 'react-icons/pi';

interface ChoosePaymentProps {
  isLoading?: boolean;
  onSelectPlan: (plan: SubscriptionPlanDto) => void;
  selectedPlan?: string;
}

const SubscriptionPlansList = ({ onSelectPlan, selectedPlan }: ChoosePaymentProps) => {
  const { subscriptionPlans, subscriptionPlansLoading } = useSubscriptionPlans();
  const [activeTab, setActiveTab] = useState('monthly');

  const tabs = useMemo(
    () => [
      {
        label: 'Monthly',
        value: 'monthly',
      },
      {
        label: 'Quarterly',
        value: 'quarterly',
      },
      {
        label: 'Yearly (Save upto 5k+)',
        value: 'annually',
      },
    ],
    []
  );

  const filteredSubscriptionPlans = useMemo(() => {
    if (!subscriptionPlans) return [];

    return [...subscriptionPlans]
      .sort((a, b) => a.amount - b.amount)
      .filter((plan) => {
        // Filter by active tab interval
        if (plan.interval !== activeTab) return false;

        // Filter to allow specific plan types and rely on plan_type when available
        const allowedTypes = ['SOCIAL_LISTENING_FREE', 'SOCIAL_LISTENING_PAID', 'LEADS_GENERATION', 'ENTERPRISE'];
        const planTypeSource = (plan as any).plan_type || plan.name.split('_')[0];
        const planTypeUpper = (planTypeSource || '').toUpperCase();
        const isAllowed = allowedTypes.includes(planTypeUpper);

        if (!isAllowed) return false;

        // Filter out plans that don't have matching plan features
        const planType = planTypeUpper as keyof typeof planFeatures;
        return planFeatures[planType] !== undefined;
      });
  }, [subscriptionPlans, activeTab]);

  const getPlanTypeIcon = (planType: string): IconType => {
    switch (planType) {
      case SubscriptionTypeEnum.Social_Listening_Paid:
      case SubscriptionTypeEnum.Social_Listening_Free:
        return IoDiamondOutline;
      case SubscriptionTypeEnum.Leads_Generation:
        return BiBriefcase;
      default:
        return PiStackSimpleFill;
    }
  };

  const getPlanDurationDetails = (planDuration: string) => {
    switch (planDuration) {
      case SubscriptionDurationEnum.MONTHLY:
        return 'renews every month';
      case SubscriptionDurationEnum.QUARTERLY:
        return 'renews every 3 months';
      case SubscriptionDurationEnum.ANNUALLY:
        return 'billed annually';
      default:
        return 'billed monthly';
    }
  };

  const getPlanTypeDiscount = (planType: string) => {
    switch (planType) {
      default:
        return undefined;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: { xs: '30px', md: '60px' },
        }}
      >
        <Toggle onChange={(value) => setActiveTab(value)} options={tabs} selectedOption={activeTab} />
      </Box>
      <Box
        sx={{
          mt: { xs: '30px', md: '60px' },
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'auto',
        }}
      >
        <LoaderWrapper
          isLoading={subscriptionPlansLoading}
          numberOfSkeletons={2}
          skeletonHeight="300px"
          sx={{
            mx: 'auto',
          }}
        >
          <HorizontalSlider>
            {filteredSubscriptionPlans && filteredSubscriptionPlans?.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: { xs: 1, sm: 2 },
                  minWidth: 'max-content',
                  justifyContent: 'center',
                }}
              >
                {filteredSubscriptionPlans?.map((plan) => {
                  const planTypeSource = (plan as any).plan_type || plan.name.split('_')[0];
                  const planType = (planTypeSource || '').toUpperCase() as keyof typeof planFeatures;

                  return (
                    <SubscriptionPlan
                      key={plan.plan_code}
                      duration={`/${plan.interval === SubscriptionDurationEnum.MONTHLY ? 'month' : plan.interval === SubscriptionDurationEnum.QUARTERLY ? '3 months' : 'year'}`}
                      planType={planType}
                      planFeatures={planFeatures[planType]}
                      onSelect={() => onSelectPlan(plan)}
                      price={plan.amount}
                      selected={selectedPlan === plan.name}
                      icon={getPlanTypeIcon(planType as string)}
                      subTitle={getPlanDurationDetails(plan.interval)}
                      description={getPlanTypeDiscount(plan.name)}
                    />
                  );
                })}
                <SubscriptionPlan
                  duration={'Bring Enterprise level functionality to your brand'}
                  planType={SubscriptionTypeEnum.Enterprise}
                  planFeatures={planFeatures[SubscriptionTypeEnum.Enterprise]}
                  onSelect={() => window.open('https://calendly.com/precious-zino-uricreative/let-s-talk-about-uri', '_blank')}
                  price={'Custom'}
                  selected={false}
                  recommended
                  icon={IoDiamondOutline}
                  buttonText="Book a Call"
                  subTitle={getPlanDurationDetails(activeTab)}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '20px',
                  }}
                >
                  No Plans Available
                </Typography>
              </Box>
            )}
          </HorizontalSlider>
        </LoaderWrapper>
      </Box>
    </>
  );
};

export default SubscriptionPlansList;
