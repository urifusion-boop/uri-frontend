import { triggerToast } from '@/components/atoms/CustomToast';
import Spinner from '@/components/loaders/Spinner';
import { TextHelper } from '@/helpers/TextHelper';
import { useSubscription } from '@/hooks/subscription/subscription.hook';
import { DiscountResponseDto } from '@/models/dtos/DiscountResponseDto';
import { SubscriptionPlan, SubscriptionResponseDto } from '@/models/dtos/SubscriptionDto';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';

interface MakePaymentProps {
  setStep: () => void;
  selectedPlan: SubscriptionPlan | null;
  setTransactionDetails: Dispatch<SetStateAction<SubscriptionResponseDto | null>>;
  onSubscriptionSuccessful?: () => void;
}

const MakePayment = ({ setStep, selectedPlan, setTransactionDetails }: MakePaymentProps) => {
  const { initializeSubscription, getUserDetails, applyDiscount } = useSubscription();

  const [discountCode, setDiscountCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const planAmount = Number(selectedPlan?.amount ?? 0);

  const [totalAmount, setTotalAmount] = useState(planAmount);

  const handleDiscountValidation = (discountCode: string) => {
    applyDiscount.mutate(
      { discountCode },
      {
        onSuccess: (data: DiscountResponseDto | null | undefined) => {
          if (data && data.discountedAmount && data.isExpired != true) {
            setIsCodeValid(true);
            setDiscountAmount(data.discountedAmount);
            setTotalAmount(data.newTotalAmount);
            return;
          }
          setIsCodeValid(false);
          setDiscountAmount(0);
          setTotalAmount(planAmount);
        },
        onError: (err: any) => {
          setIsCodeValid(false);
          setDiscountAmount(0);
          setTotalAmount(planAmount);
        },
      }
    );
  };

  const handleProceed = () => {
    initializeSubscription.mutate(
      {
        amount: totalAmount,
        plan: selectedPlan?.plan_code ?? '',
      },
      {
        onSuccess: (data) => {
          if (data) {
            setTransactionDetails(data);
            setStep();
          }
        },
        onError: (err: any) => {
          if (err.code === HttpStatusCode.Conflict) {
            getUserDetails.mutate();
          }

          triggerToast('error', err.message ?? 'Something went wrong');
        },
      }
    );
  };

  return (
    <Box sx={{ px: 2 }}>
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
        Subscription Summary
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

      {/* Summary card */}
      <Box
        sx={{
          boxShadow: '2.23px -1.12px 11.16px 4.46px #0000000D',
          borderRadius: '11.16px',
          p: { xs: '20px', md: '36.18px' },
          maxWidth: '569px',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          mt: '63px',
          mb: '32px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Typography
              sx={{
                bgcolor: '#CD1B78',
                color: '#fff',
                fontSize: '17px',
                fontWeight: 500,
                px: 0.1,
              }}
            >
              PREMIUM
            </Typography>
            <Typography sx={{ color: '#141416', fontSize: '17px', fontWeight: 600 }}>Plan</Typography>
          </Box>
          <Typography sx={{ color: '#6C727F', fontSize: '15px', fontWeight: 500 }}>{TextHelper.capitalize(selectedPlan?.interval)} Subscription</Typography>
        </Box>

        <Typography sx={{ fontSize: '29px', fontWeight: 800, color: '#141416' }}>
          {TextHelper.formatAmount(planAmount)} /{selectedPlan?.interval}
        </Typography>
      </Box>

      {/* Discount */}
      <Box sx={{ maxWidth: '550px', mx: 'auto', width: '100%' }}>
        <Typography
          sx={{
            color: '#6B6B6B',
            fontSize: { xs: '20px', md: '25px' },
            fontWeight: 600,
            mb: '7px',
          }}
        >
          Discount Code
        </Typography>

        <Box
          sx={{
            border: '1px solid #ACABABA8',
            display: 'flex',
            borderRadius: '10px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            variant="outlined"
            value={discountCode}
            onChange={(e) => {
              setDiscountCode(e.target.value);
              setIsCodeValid(null);
            }}
            sx={{ '& fieldset': { border: 'none' } }}
            placeholder="Enter discount code"
          />

          <Box component="button" sx={{ pr: '14px' }} onClick={() => handleDiscountValidation(discountCode)}>
            {applyDiscount.isLoading ? (
              <Spinner color="#666" />
            ) : (
              <Typography
                sx={{
                  color: isCodeValid || applyDiscount.isLoading ? '#666' : '#CD1B78',
                  fontSize: '17px',
                  fontWeight: 600,
                }}
              >
                {isCodeValid ? 'Applied' : 'Apply'}
              </Typography>
            )}
          </Box>
        </Box>

        {typeof isCodeValid === 'boolean' && (
          <Typography
            sx={{
              color: isCodeValid ? '#308242' : '#CD1B78',
              fontSize: { xs: '18px', md: '20px' },
              fontWeight: 600,
              mt: '7px',
            }}
          >
            {isCodeValid ? 'Discount has been applied' : 'Invalid discount code'}
          </Typography>
        )}

        {/* Amount Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
          <Typography sx={{ color: '#6B6B6B', fontSize: '20px', fontWeight: 600 }}>Amount</Typography>
          <Typography sx={{ color: '#1D1D1D', fontSize: '20px', fontWeight: 600 }}>{TextHelper.formatAmount(planAmount)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '20px' }}>
          <Typography sx={{ color: '#6B6B6B', fontSize: '20px', fontWeight: 600 }}>Discount</Typography>
          <Typography sx={{ color: '#1D1D1D', fontSize: '20px', fontWeight: 600 }}>{TextHelper.formatAmount(discountAmount)}</Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '20px' }}>
          <Typography sx={{ color: '#6B6B6B', fontSize: '20px', fontWeight: 600 }}>Total</Typography>
          <Typography sx={{ color: '#1D1D1D', fontSize: '20px', fontWeight: 600 }}>{TextHelper.formatAmount(totalAmount)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '30px' }}>
          <Button disabled={initializeSubscription.isLoading} onClick={handleProceed} variant="contained" sx={{ maxWidth: '200px', width: '100%', py: '12px' }}>
            {initializeSubscription.isLoading || getUserDetails.isLoading ? <Spinner color="#fff" /> : 'Proceed'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MakePayment;
