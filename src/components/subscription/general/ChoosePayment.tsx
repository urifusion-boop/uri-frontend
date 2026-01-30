import { Box, Typography } from '@mui/material';

import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';

interface ChoosePaymentProps {
  setStep?: () => void;
  onSelectPlan: (planType: string, planCode: string, amount?: number) => void;
  currentPlanType?: string;
}

const ChoosePayment = ({ setStep, onSelectPlan, currentPlanType }: ChoosePaymentProps) => {
  const handleSelectPlan = (planType: string, planCode: string, amount?: number) => {
    onSelectPlan(planType, planCode, amount);
    setStep?.();
  };

  return (
    <Box sx={{ px: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
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

      {/* Plan List */}
      <SubscriptionPlansList currentPlanType={currentPlanType} onSelectPlan={handleSelectPlan} />
    </Box>
  );
};

export default ChoosePayment;
