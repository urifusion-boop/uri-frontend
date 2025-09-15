import SmartModal from '@/components/modals/SmartModal';
import { usePaymentTransaction } from '@/hooks/subscription/paymentTransaction.hook';
import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';
import { Box, Button, Radio, Typography } from '@mui/material';
import { useState } from 'react';

interface PaymentMethodProps {
  setStep: () => void;
  selectedPlan: SubscriptionPlan | null;
  transactionDetails: SubscriptionResponseDto | null;
}

const PaymentMethod = ({ setStep, transactionDetails }: PaymentMethodProps) => {
  const [openPaymentFeedbackModal, setOpenPaymentFeedbackModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const { handlePayStackPayment } = usePaymentTransaction(transactionDetails, setPaymentSuccess, setOpenPaymentFeedbackModal);

  return (
    <>
      <Box sx={{ px: 1 }}>
        <Typography
          sx={{
            color: '#000',
            fontSize: { xs: '24px', md: '32px' },
            fontWeight: 600,
            textAlign: 'center',
            maxWidth: '478px',
            mx: 'auto',
          }}
        >
          Choose Payment Method
        </Typography>

        <Typography
          sx={{
            color: '#3B3B3B',
            fontSize: { xs: '16px', md: '20px' },
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '497px',
            mx: 'auto',
            mt: '10px',
          }}
        >
          Choose your preferred payment method
        </Typography>

        <Box
          sx={{
            border: '1.79px solid #ACABABA8',
            mx: 'auto',
            maxWidth: '550px',
            display: 'flex',
            justifyContent: 'space-between',
            py: '8px',
            px: '14px',
            borderRadius: '10px',
            mt: '100px',
            mb: '60px',
          }}
        >
          <img src="/assets/images/paystack.png" alt="Paystack" width={101} height={50} />
          <Radio checked />
        </Box>

        {transactionDetails && (
          <Box
            sx={{
              maxWidth: '200px',
              mx: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button variant="contained" color="primary" onClick={() => handlePayStackPayment()}>
              Pay with Paystack
            </Button>
          </Box>
        )}
      </Box>

      <SmartModal
        open={openPaymentFeedbackModal}
        mainText={paymentSuccess ? 'Payment Successful!' : 'Oh no! Your Payment Failed'}
        subText={paymentSuccess ? 'Your premium access is now unlocked.' : 'Looks like something went wrong. Please try again'}
        onClick={() => {
          setOpenPaymentFeedbackModal(false);
          if (paymentSuccess) {
            setStep();
          }
        }}
        image={<img src={paymentSuccess ? '/assets/images/success.png' : '/assets/icons/payment-failed-character.svg'} alt="payment failed" height={100} width={100} />}
        buttonText={paymentSuccess ? 'Done' : 'Retry Payment'}
      />
    </>
  );
};

export default PaymentMethod;
