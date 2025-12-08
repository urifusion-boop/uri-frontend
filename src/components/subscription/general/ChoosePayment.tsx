import { Box, Typography } from '@mui/material';
import { useCallback } from 'react';

import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import { TextHelper } from '@/helpers/TextHelper';
import { SubscriptionPlan as SubscriptionPlanDto } from '@/models/dtos/SubscriptionDto';

interface ChoosePaymentProps {
  setStep?: () => void;
  onSelectPlan: (plan: SubscriptionPlanDto) => void;
  selectedPlan?: string;
}

const ChoosePayment = ({ setStep, onSelectPlan, selectedPlan }: ChoosePaymentProps) => {
  const handleSelectPlan = useCallback(
    (plan: SubscriptionPlanDto) => {
      onSelectPlan({
        ...plan,
        amount: Number(TextHelper.shortAmountWithDiscount(Number(plan.amount))),
      });
      setStep?.();
    },
    [onSelectPlan, setStep]
  );

  return (
    <Box sx={{ px: 1 }}>
      <Typography
        sx={{
          color: '#000000',
          fontSize: { xs: '24px', md: '32px' },
          fontWeight: 600,
          textAlign: 'center',
          maxWidth: '478px',
          mx: 'auto',
        }}
      >
        Choose a Plan That Works for You
      </Typography>
      <Typography
        sx={{
          color: '#3B3B3B',
          fontSize: { xs: '16px', md: '20px' },
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '497px',
          mx: 'auto',
        }}
      >
        Upgrade to a plan that fits your business needs
      </Typography>

      {/* Plan List - Trial modal shows automatically in NewSubscription */}
      <SubscriptionPlansList selectedPlan={selectedPlan} onSelectPlan={handleSelectPlan} />
    </Box>
  );
};

export default ChoosePayment;
