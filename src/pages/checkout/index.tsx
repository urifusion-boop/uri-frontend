import { TrialService, TrialStatus } from '@/api/TrialService';
import SeoHead from '@/components/atoms/SeoHead';
import Stepper2 from '@/components/atoms/Stepper2';
import Header from '@/components/landing/Header';
import UpperFooter from '@/components/landing/UpperFooter';
import ExploreUri from '@/components/subscription/general/ExploreUri';
import MakePayment from '@/components/subscription/general/MakePayment';
import PaymentMethod from '@/components/subscription/general/PaymentMethod';
import TrialCountdownBanner from '@/components/trial/TrialCountdownBanner';
import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CheckoutPage = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const [activeStep, setActiveStep] = useState(1); // Start at 1 (MakePayment) - plan already selected on pricing page
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<SubscriptionResponseDto | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);

  // Fetch trial status
  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (!userDetails?.userId) return;

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          setTrialStatus(response.responseData);
        }
      } catch (error) {
        console.error('Error fetching trial status:', error);
      }
    };

    fetchTrialStatus();
  }, [userDetails?.userId]);

  // Get selected plan from URL query params
  useEffect(() => {
    const { plan } = router.query;
    if (plan && typeof plan === 'string') {
      try {
        const parsedPlan = JSON.parse(decodeURIComponent(plan));
        setSelectedPlan(parsedPlan);
      } catch (error) {
        console.error('Error parsing plan:', error);
        // If no valid plan, redirect back to pricing
        router.push('/pricing');
      }
    }
  }, [router.query]);

  const steps = ['Make Payment', 'Payment Method', 'Explore Uri'];

  return (
    <>
      <SeoHead title="Checkout" />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Header />
        <div className="container py-8">
          {/* Trial Banner - only show if trial is active */}
          {trialStatus && trialStatus.status === 'active' && (
            <Box sx={{ mb: 3 }}>
              <TrialCountdownBanner trialStatus={trialStatus} hideUpgradeButton={true} />
            </Box>
          )}

          <Box
            sx={{
              maxWidth: '1500px',
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: '20px',
              py: '64px',
              mt: '40px',
              mx: 'auto',
              px: { xs: 2, md: 4 },
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
              {activeStep === 1 && <MakePayment selectedPlan={selectedPlan} setStep={() => setActiveStep(2)} setTransactionDetails={setTransactionDetails} />}

              {activeStep === 2 && <PaymentMethod selectedPlan={selectedPlan} setStep={() => setActiveStep(3)} transactionDetails={transactionDetails} />}

              {activeStep === 3 && <ExploreUri />}
            </Box>
          </Box>
        </div>
        <UpperFooter />
      </div>
    </>
  );
};

export default CheckoutPage;
