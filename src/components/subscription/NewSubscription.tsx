import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';

import { Box } from '@mui/material';
import { useState } from 'react';
import Stepper2 from '../atoms/Stepper2';
import ChoosePayment from './general/ChoosePayment';
import ExploreUri from './general/ExploreUri';
import MakePayment from './general/MakePayment';
import PaymentMethod from './general/PaymentMethod';

const NewSubscription = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<SubscriptionResponseDto | null>(null);

  const steps = ['Choose Plan', 'Make Payment', 'Payment Method', 'Explore Uri'];

  return (
    <Box
      sx={{
        maxWidth: '1500px',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '20px',
        py: '64px',
        mt: '40px',
        mx: 'auto',
      }}
    >
      <Stepper2
        steps={steps}
        activeStep={activeStep}
        handleStepClick={(step: number) => {
          if (step > activeStep) return;
          setActiveStep(step);
        }}
        disabled={activeStep > 2}
      />
      <Box sx={{ py: '40px' }}>
        {activeStep === 1 && <ChoosePayment setStep={() => setActiveStep(2)} onSelectPlan={setSelectedPlan} selectedPlan={selectedPlan?.interval} />}

        {activeStep === 2 && <MakePayment selectedPlan={selectedPlan} setStep={() => setActiveStep(3)} setTransactionDetails={setTransactionDetails} />}

        {activeStep === 3 && <PaymentMethod selectedPlan={selectedPlan} setStep={() => setActiveStep(4)} transactionDetails={transactionDetails} />}

        {activeStep === 4 && <ExploreUri />}
      </Box>
    </Box>
  );
};

export default NewSubscription;
