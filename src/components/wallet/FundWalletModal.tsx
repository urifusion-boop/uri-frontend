import CustomButton from '@/components/atoms/CustomButton';
import Text, { ErrorText } from '@/components/atoms/CustomText';
import InputField from '@/components/atoms/Input';
import useCustomTheme from '@/hooks/theme.hook';
import { useWallet } from '@/hooks/wallet/useWallet.hook';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Modal } from '@mui/material';
import React, { useState } from 'react';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const FundWalletModal: React.FC<IProps> = ({ open, onClose }) => {
  const { themeColors } = useCustomTheme();
  const { fundWallet, isFundingWallet } = useWallet();
  const { userDetails } = useAuth();
  const [amount, setAmount] = useState<string>('5000');
  const [error, setError] = useState<string>('');

  const handleFund = async () => {
    setError('');
    const numAmount = Number(amount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount < 5000) {
      setError('Minimum funding amount is ₦5,000');
      return;
    }

    if (!userDetails?.userId || !userDetails.email) {
      setError('User details not found');
      return;
    }

    try {
      await fundWallet({
        userId: userDetails.userId,
        email: userDetails.email,
        amount: numAmount,
        currency: 'NGN',
        callbackUrl: `${window.location.origin}/wallet/verify`,
      });
      // Don't close immediately, wait for redirect or user action?
      // The hook opens the window. We can close the modal.
      onClose();
    } catch (e) {
      // Error handled in hook
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: themeColors.background,
          border: `1px solid ${themeColors.borderColor}`,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Text size={24} weight={700} center mode="base" style={{ marginBottom: 16 }}>
          Fund Wallet
        </Text>

        <Text size={14} weight={400} mode="secondary" center style={{ marginBottom: 24 }}>
          Enter the amount you want to add to your wallet. Minimum amount is ₦5,000.
        </Text>

        <InputField label="Amount (₦)" value={amount} onChange={(e) => setAmount(e.target.value)} formatNumber placeholder="5,000" type="text" />

        {error && <ErrorText style={{ marginTop: 8 }}>{error}</ErrorText>}

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <CustomButton mode="secondary" onClick={onClose} style={{ flex: 1 }} disabled={isFundingWallet}>
            Cancel
          </CustomButton>
          <CustomButton mode="primary" onClick={handleFund} loading={isFundingWallet} style={{ flex: 1 }}>
            Pay Now
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default FundWalletModal;
