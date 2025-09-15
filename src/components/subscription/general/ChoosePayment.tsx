import { Box, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

import FreeTrialPlansList from '@/components/subscription/general/FreeTrialPlansList'; // Make sure this path is correct
import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import { TextHelper } from '@/helpers/TextHelper';
import { SubscriptionPlan as SubscriptionPlanDto } from '@/models/dtos/SubscriptionDto';
import { useAuth } from '@/providers/AuthProvider';

interface ChoosePaymentProps {
  setStep?: () => void;
  onSelectPlan: (plan: SubscriptionPlanDto) => void;
  selectedPlan?: string;
}

const ChoosePayment = ({ setStep, onSelectPlan, selectedPlan }: ChoosePaymentProps) => {
  const [showFreeTrial, setShowFreeTrial] = useState(false);
  const { userDetails } = useAuth();

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

      {/* Toggle between Free Trial and Full Plans */}
      <Box textAlign="center" mt={3}>
        {!showFreeTrial ? (
          <Typography
            onClick={() => setShowFreeTrial(true)}
            sx={{
              cursor: 'pointer',
              color: '#CD1B78',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            Or Try for Free
          </Typography>
        ) : (
          <Typography
            onClick={() => setShowFreeTrial(false)}
            sx={{
              cursor: 'pointer',
              color: '#3B3B3B',
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            Back to full plans
          </Typography>
        )}
      </Box>

      {/* Plan List */}
      {showFreeTrial && !userDetails?.hasUsedFreeTrial ? (
        <FreeTrialPlansList selectedPlan={selectedPlan} onSelectPlan={handleSelectPlan} />
      ) : (
        <SubscriptionPlansList selectedPlan={selectedPlan} onSelectPlan={handleSelectPlan} />
      )}
    </Box>
  );
};

export default ChoosePayment;
