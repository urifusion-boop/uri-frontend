import { TransactionService } from '@/api/TransactionService';
import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SubscriptionVerifyPage = () => {
  const router = useRouter();
  const { reference, trxref } = router.query;
  const txRef = (reference as string) || (trxref as string);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (txRef) {
      handleVerification(txRef);
    }
  }, [txRef]);

  const handleVerification = async (ref: string) => {
    setIsVerifying(true);
    setError('');
    try {
      const response = await TransactionService.verifySubscription(ref);
      if (response.status) {
        setSuccess(true);
        // Redirect to dashboard after a delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(response.responseMessage || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification failed', error);
      setError(error?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!router.isReady) return null;

  return (
    <>
      <SeoHead title="Verifying Subscription" />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {isVerifying ? (
          <>
            <CircularProgress size={60} sx={{ color: '#CD1B78' }} />
            <Typography variant="h5" fontWeight={600}>
              Verifying your subscription...
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please wait while we confirm your payment.
            </Typography>
          </>
        ) : (
          <>
            {error ? (
              <>
                <Typography variant="h6" color="error">
                  {error}
                </Typography>
                <CustomButton mode="secondary" onClick={() => router.push('/pricing')}>
                  Back to Pricing
                </CustomButton>
              </>
            ) : success ? (
              <>
                <Typography variant="h6" color="success.main">
                  Subscription Active!
                </Typography>
                <Typography variant="body1">Redirecting you to dashboard...</Typography>
                <CustomButton mode="primary" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </CustomButton>
              </>
            ) : (
              <Typography variant="h6" color="error">
                Invalid Request
              </Typography>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SubscriptionVerifyPage;
