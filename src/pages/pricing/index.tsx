import { TrialService } from '@/api/TrialService';
import Enterprise from '@/components/landing/Enterprise';
import Footer from '@/components/landing/Footer';
import Pricing from '@/components/landing/Pricing';
import PricingTable from '@/components/landing/PricingTable';
import Navigation from '@/components/Navigation';
import TrialActivationModal from '@/components/trial/TrialActivationModal';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function PricingPage() {
  const { userDetails } = useAuth();
  const router = useRouter();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

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
        }
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkTrialEligibility();
  }, [userDetails]);

  return (
    <div className="bg-[#FFFCFE]">
      <Navigation />
      <div className="container">
        {/* Trial Banner for Eligible Users - Compact Version */}
        {!checkingEligibility && isTrialEligible && userDetails && (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #CD1B78 0%, #E91E8C 100%)',
              borderRadius: '16px',
              py: 2.5,
              px: 4,
              mb: 4,
              mt: 2,
              textAlign: 'center',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography sx={{ fontSize: '36px', lineHeight: 1 }}>🎉</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Start Your 7-Day Free Trial
            </Typography>
            <Typography sx={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.3 }}>Try all premium features free for 7 days • No credit card required</Typography>
            <Button
              variant="contained"
              onClick={() => setShowTrialModal(true)}
              sx={{
                backgroundColor: 'white',
                color: '#CD1B78',
                fontSize: '15px',
                fontWeight: 600,
                py: 1.25,
                px: 3.5,
                borderRadius: '12px',
                mt: 0.5,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Start Free Trial Now
            </Button>
          </Box>
        )}

        <Pricing />
        <Enterprise />
        <PricingTable />
      </div>

      <Footer />

      {/* Trial Activation Modal */}
      {userDetails?.userId && <TrialActivationModal open={showTrialModal} onClose={() => setShowTrialModal(false)} onSuccess={() => router.push('/dashboard')} userId={userDetails.userId} />}
    </div>
  );
}

export default PricingPage;
