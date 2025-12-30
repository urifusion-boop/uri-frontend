import { PaymentModeSelector } from '@/components/payment/PaymentModeSelector';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { useLeadTrackingHook } from '@/hooks/leads-tracking/leadsTracking.hook';
import { usePaymentGating } from '@/hooks/payment/usePaymentGating';
import { useWallet } from '@/hooks/wallet/useWallet';
import { LeadActionTypeEnum, PaymentModeEnum } from '@/models/dtos/PaymentGatingDto';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../loaders/Spinner';

interface RevealBoxWithPaymentProps {
  type: 'email' | 'phone';
  value?: string;
  leadIds?: string[];
  showPaymentSelector?: boolean;
}

const RevealBoxWithPayment = ({ type, value, leadIds, showPaymentSelector = false }: RevealBoxWithPaymentProps) => {
  const [revealed, setRevealed] = useState<boolean>(!!value);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { enrichLead, isEnrichingLead } = useLeadTrackingHook('leads');
  const { creditsAvailable } = useCreditBundle();
  const { balance: walletBalance } = useWallet();
  const { getActionCost, deductPayment, isDeducting } = usePaymentGating();

  const actionType = type === 'email' ? LeadActionTypeEnum.ENRICHMENT_EMAIL : LeadActionTypeEnum.ENRICHMENT_PHONE;
  const { walletCost, creditCost } = getActionCost(actionType);

  useEffect(() => {
    if (value) setRevealed(true);
  }, [value]);

  const handleClick = () => {
    if (revealed || !leadIds || leadIds.length === 0) return;

    if (showPaymentSelector) {
      setShowPaymentModal(true);
    } else {
      // Use credits directly (existing behavior)
      performEnrichment();
    }
  };

  const performEnrichment = () => {
    enrichLead({
      lead_ids: leadIds!,
      reveal_email: type === 'email',
      reveal_phone: type === 'phone',
      webhook_url: '',
    });
  };

  const handlePaymentConfirm = async (paymentMode: PaymentModeEnum) => {
    // If using wallet, deduct from wallet first
    if (paymentMode === PaymentModeEnum.WALLET) {
      const result = await deductPayment(paymentMode, actionType, 1, `${type === 'email' ? 'Email' : 'Phone'} reveal`);

      if (!result?.success) {
        toast.error('Payment failed. Please try again.');
        return;
      }
    }

    // Perform enrichment (credits are handled by backend if using credits mode)
    performEnrichment();
    setShowPaymentModal(false);
  };

  const isLoading = isEnrichingLead || isDeducting;

  if (isLoading) return <Spinner color="primary" />;

  const costTooltip = `Cost: ${creditCost} credit${creditCost > 1 ? 's' : ''} or NGN ${walletCost}`;

  return (
    <>
      <Tooltip title={!revealed ? costTooltip : ''} arrow>
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: revealed ? 'default' : 'pointer',
            backgroundColor: '#f8f8f8',
            transition: 'all 150ms ease',
            '&:hover': revealed
              ? {}
              : {
                  borderColor: '#CD1B78',
                  backgroundColor: 'rgba(205, 27, 120, 0.04)',
                },
          }}
          onClick={handleClick}
        >
          {type === 'email' ? <EmailIcon fontSize="small" /> : <PhoneIcon fontSize="small" />}

          <Typography fontWeight={400}>{revealed ? value || 'N/A' : `Access ${type === 'email' ? 'email' : 'mobile'}`}</Typography>

          {revealed && value && <VerifiedIcon fontSize="small" color="success" />}
        </Box>
      </Tooltip>

      {showPaymentSelector && (
        <PaymentModeSelector
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          actionType={actionType}
          actionLabel={type === 'email' ? 'Reveal Email' : 'Reveal Phone'}
          walletBalance={walletBalance}
          creditsAvailable={creditsAvailable}
          walletCost={walletCost}
          creditCost={creditCost}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default RevealBoxWithPayment;
