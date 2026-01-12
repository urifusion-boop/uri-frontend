import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import { TextHelper } from '@/helpers/TextHelper';
import useCustomTheme from '@/hooks/theme.hook';
import { useWallet } from '@/hooks/wallet/useWallet.hook';
import { Box, Card, Skeleton } from '@mui/material';
import React, { useState } from 'react';
import FundWalletModal from './FundWalletModal';
import WalletHistoryModal from './WalletHistoryModal';

const WalletWidget: React.FC = () => {
  const { themeColors } = useCustomTheme();
  const { wallet, isLoadingWallet } = useWallet();
  const [showFundModal, setShowFundModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  if (isLoadingWallet) {
    return <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2 }} />;
  }

  const balance = wallet?.balance ?? 0;

  return (
    <>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: themeColors.background,
          border: `1px solid ${themeColors.borderColor}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'none',
        }}
      >
        <Box>
          <Text size={14} weight={500} mode="secondary" style={{ marginBottom: 4 }}>
            Wallet Balance
          </Text>
          <Text size={24} weight={700} mode="base">
            ₦{TextHelper.formatNumberWithCommas(balance.toString())}
          </Text>
        </Box>
        <Box display="flex" gap={2}>
          <CustomButton mode="secondary" onClick={() => setShowHistoryModal(true)} small>
            History
          </CustomButton>
          <CustomButton mode="primary" onClick={() => setShowFundModal(true)} small>
            Fund Wallet
          </CustomButton>
        </Box>
      </Card>

      <FundWalletModal open={showFundModal} onClose={() => setShowFundModal(false)} />
      <WalletHistoryModal open={showHistoryModal} onClose={() => setShowHistoryModal(false)} transactions={wallet?.transactions || []} />
    </>
  );
};

export default WalletWidget;
