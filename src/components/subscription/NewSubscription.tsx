import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';

import { TrialService } from '@/api/TrialService';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Stepper2 from '../atoms/Stepper2';
import TrialActivationModal from '../trial/TrialActivationModal';
import ChoosePayment from './general/ChoosePayment';
import ExploreUri from './general/ExploreUri';
import MakePayment from './general/MakePayment';
import PaymentMethod from './general/PaymentMethod';

const NewSubscription = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<SubscriptionResponseDto | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const { userDetails } = useAuth();
  const router = useRouter();

  // Check if user is eligible for free trial
  useEffect(() => {
    const checkTrialEligibility = async () => {
      if (!userDetails?.userId) {
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          const { hasUsedFreeTrial, status } = response.responseData;
          // User is eligible if they haven't used trial and it's not started
          const eligible = !hasUsedFreeTrial && status === 'not_started';
          setIsTrialEligible(eligible);
          // Auto-show trial modal for eligible users
          if (eligible) {
            setShowTrialModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkTrialEligibility();
  }, [userDetails?.userId]);

  const handleTrialSuccess = () => {
    // Check if user has selected a primary module during onboarding
    const primaryModule = localStorage.getItem('primaryModule');

    if (primaryModule) {
      // Map module ID to route for new users
      const moduleRoutes: Record<string, string> = {
        'account-tracking': '/account-tracking',
        'keyword-tracking': '/keyword-tracking',
        'hashtag-tracking': '/hashtag-tracking',
        'lead-generation': '/leads-tracking',
        'content-management': '/content-management',
        alert: '/alert',
        'insight-assistant': '/uri-assistant',
      };

      router.push(moduleRoutes[primaryModule] || '/dashboard');
    } else {
      // Existing user without onboarding, go to dashboard
      router.push('/dashboard');
    }
  };

  const steps = ['Choose Plan', 'Make Payment', 'Payment Method', 'Explore Uri'];

  return (
    <>
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

      {/* Trial Activation Modal - Auto-shows for eligible users */}
      {userDetails?.userId && isTrialEligible && <TrialActivationModal open={showTrialModal} onClose={() => setShowTrialModal(false)} onSuccess={handleTrialSuccess} userId={userDetails.userId} />}
    </>
  );
};

export default NewSubscription;
