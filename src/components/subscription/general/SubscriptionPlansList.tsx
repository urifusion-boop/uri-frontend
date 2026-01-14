import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FaBuilding, FaHandshake, FaHeadphones, FaWallet } from 'react-icons/fa';
import { PiStackSimpleFill } from 'react-icons/pi';

import LoaderWrapper from '@/components/atoms/LoaderWrapper';
import Toggle from '@/components/atoms/Toggle';
import SubscriptionPlanCard from '@/components/subscription/general/SubscriptionPlanCard';
import { planFeatures } from '@/data/subscription';
import { useSubscriptionPlans } from '@/hooks/subscription/subscriptionPlans.hook';
import { SubscriptionPlan as SubscriptionPlanDto } from '@/models/dtos/SubscriptionDto';

interface ChoosePaymentProps {
  isLoading?: boolean;
  onSelectPlan: (plan: SubscriptionPlanDto) => void;
  selectedPlan?: string;
}

const getPlanType = (plan: SubscriptionPlanDto): keyof typeof planFeatures | undefined => {
  // 1. Check exact match on plan_code
  if (planFeatures[plan.plan_code as keyof typeof planFeatures]) {
    return plan.plan_code as keyof typeof planFeatures;
  }

  return undefined;
};

const normalizeInterval = (interval: string): string => {
  const lower = interval.toLowerCase();
  if (lower === 'yearly') return 'annually';
  return lower;
};

const SubscriptionPlansList = ({ onSelectPlan, selectedPlan }: ChoosePaymentProps) => {
  const { subscriptionPlans, subscriptionPlansLoading } = useSubscriptionPlans();
  const [activeTab, setActiveTab] = useState('social_listening');

  const tabs = useMemo(
    () => [
      { label: 'Social Listening', value: 'social_listening' },
      { label: 'Leads Generation', value: 'leads_gen' },
      { label: 'Enterprise', value: 'enterprise' },
    ],
    []
  );

  // Ensure activeTab is valid
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((t) => t.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [tabs, activeTab]);

  const filteredSubscriptionPlans = useMemo(() => {
    if (!subscriptionPlans) return [];

    return [...subscriptionPlans]
      .sort((a, b) => a.amount - b.amount)
      .filter((plan) => {
        const planType = getPlanType(plan);
        if (!planType) return false;

        if (activeTab === 'social_listening') {
          return [SubscriptionTypeEnum.SocialListeningFree, SubscriptionTypeEnum.SocialListeningPaid].includes(planType as SubscriptionTypeEnum);
        }
        if (activeTab === 'leads_gen') {
          return planType === SubscriptionTypeEnum.LeadsGen;
        }
        if (activeTab === 'enterprise') {
          return planType === SubscriptionTypeEnum.Enterprise;
        }
        return false;
      });
  }, [subscriptionPlans, activeTab]);

  const getPlanStyle = (planType: string) => {
    switch (planType) {
      case SubscriptionTypeEnum.SocialListeningFree:
        return {
          icon: <FaHeadphones size={20} />,
          iconBg: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
          badge: 'FREE',
          title: 'Social Listening Free',
          subtitle: 'Basic monitoring',
        };
      case SubscriptionTypeEnum.SocialListeningPaid:
        return {
          icon: <FaHandshake size={20} />,
          iconBg: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
          badge: 'RECOMMENDED',
          title: 'Social Listening Paid',
          subtitle: 'Pro monitoring',
        };
      case SubscriptionTypeEnum.Enterprise:
        return {
          icon: <FaBuilding size={20} />,
          iconBg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          badge: 'ENTERPRISE',
          title: 'Enterprise',
          subtitle: 'Unlimited access',
        };
      case SubscriptionTypeEnum.LeadsGen:
        return {
          icon: <FaWallet size={20} />,
          iconBg: 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)',
          badge: 'PAYG',
          title: 'Leads Generation',
          subtitle: 'Pay as you go',
        };
      default:
        return {
          icon: <PiStackSimpleFill size={20} />,
          iconBg: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
          badge: undefined,
          title: 'Plan',
          subtitle: 'Subscription',
        };
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: { xs: '30px', md: '40px' },
          mb: { xs: '30px', md: '40px' },
        }}
      >
        <Toggle onChange={(value) => setActiveTab(value)} options={tabs} selectedOption={activeTab} />
      </Box>

      <LoaderWrapper isLoading={subscriptionPlansLoading} numberOfSkeletons={3} skeletonHeight="400px">
        {filteredSubscriptionPlans && filteredSubscriptionPlans.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {filteredSubscriptionPlans.map((plan) => {
              const planTypeKey = getPlanType(plan);
              if (!planTypeKey) return null;

              const style = getPlanStyle(planTypeKey);
              const features = planFeatures[planTypeKey];

              // Format price
              const price = `₦${(plan.amount / 100).toLocaleString()}`;
              const interval = normalizeInterval(plan.interval) === 'annually' ? 'year' : 'month';

              return (
                <Grid item xs={12} sm={6} md={4} key={plan.plan_code}>
                  <SubscriptionPlanCard
                    icon={style.icon}
                    iconBg={style.iconBg}
                    title={style.title}
                    subtitle={style.subtitle}
                    description={plan.description}
                    features={features.includedFeatures}
                    price={price}
                    interval={interval}
                    isHighlighted={selectedPlan === plan.plan_code || style.badge === 'RECOMMENDED'}
                    badge={style.badge}
                    actionLabel={selectedPlan === plan.plan_code ? 'Current Plan' : 'Choose Plan'}
                    onAction={() => onSelectPlan(plan)}
                    isLoading={false} // pass loading state if needed
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box
            sx={{
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Typography sx={{ fontSize: '20px', color: '#666' }}>No Plans Available</Typography>
          </Box>
        )}
      </LoaderWrapper>
    </>
  );
};

export default SubscriptionPlansList;
