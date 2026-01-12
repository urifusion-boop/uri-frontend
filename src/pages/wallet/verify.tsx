import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import { dashboardRoutes } from '@/constants/ClientRoute';
import { useWallet } from '@/hooks/wallet/useWallet.hook';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const WalletVerifyPage = () => {
  const router = useRouter();
  const { verifyFunding, isVerifyingFunding } = useWallet();
  const { reference, trxref } = router.query;
  const txRef = (reference as string) || (trxref as string);

  useEffect(() => {
    if (txRef) {
      handleVerification(txRef);
    }
  }, [txRef]);

  const handleVerification = async (ref: string) => {
    try {
      await verifyFunding(ref);
      setTimeout(() => {
        router.push(dashboardRoutes.dashboardHome);
      }, 3000);
    } catch (error) {
      console.error('Verification failed', error);
    }
  };

  if (!router.isReady) return null;

  return (
    <>
      <SeoHead title="Verifying Payment" />
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
        {isVerifyingFunding || (txRef && !isVerifyingFunding) ? (
          <>
            <CircularProgress size={60} sx={{ color: '#CD1B78' }} />
            <Typography variant="h5" fontWeight={600}>
              Verifying your payment...
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please wait while we confirm your transaction.
            </Typography>
          </>
        ) : (
          <>
            {!txRef ? (
              <Typography variant="h6" color="error">
                Invalid Reference
              </Typography>
            ) : (
              <Typography variant="h6">Payment Processed</Typography>
            )}
            <CustomButton mode="primary" onClick={() => router.push(dashboardRoutes.dashboardHome)}>
              Go to Dashboard
            </CustomButton>
          </>
        )}
      </Box>
    </>
  );
};

export default WalletVerifyPage;
