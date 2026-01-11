import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { LeadActionTypeEnum, PaymentModeEnum } from '@/models/dtos/PaymentGatingDto';
import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, Radio, RadioGroup, Stack, Typography, alpha } from '@mui/material';
import { useState } from 'react';
import { FaCoins, FaExclamationTriangle, FaTimes, FaWallet } from 'react-icons/fa';

interface PaymentModeSelectorProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMode: PaymentModeEnum) => void;
  actionType: LeadActionTypeEnum;
  actionLabel: string;
  walletBalance: number;
  creditsAvailable: number;
  walletCost: number;
  creditCost: number;
  isLoading?: boolean;
  quantity?: number;
}

export const PaymentModeSelector = ({
  open,
  onClose,
  onConfirm,
  actionType,
  actionLabel,
  walletBalance,
  creditsAvailable,
  walletCost,
  creditCost,
  isLoading,
  quantity = 1,
}: PaymentModeSelectorProps) => {
  const [selectedMode, setSelectedMode] = useState<PaymentModeEnum>(PaymentModeEnum.CREDITS);

  const totalWalletCost = walletCost * quantity;
  const totalCreditCost = creditCost * quantity;

  const hasEnoughWallet = walletBalance >= totalWalletCost;
  const hasEnoughCredits = creditsAvailable >= totalCreditCost;

  const canProceed = selectedMode === PaymentModeEnum.WALLET ? hasEnoughWallet : hasEnoughCredits;

  const handleConfirm = () => {
    if (canProceed) {
      onConfirm(selectedMode);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={900} sx={{ color: '#141414' }}>
              Choose Payment Method
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.25 }}>
              Select how to pay for {actionLabel.toLowerCase()}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isLoading}>
            <FaTimes />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box py={2}>
          <RadioGroup value={selectedMode} onChange={(e) => setSelectedMode(e.target.value as PaymentModeEnum)}>
            {/* Credits Option */}
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                border: `2px solid ${selectedMode === PaymentModeEnum.CREDITS ? LightThemeColors.uriColor : '#e0e0e0'}`,
                backgroundColor: selectedMode === PaymentModeEnum.CREDITS ? alpha(LightThemeColors.uriColor, 0.04) : 'transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onClick={() => setSelectedMode(PaymentModeEnum.CREDITS)}
            >
              <FormControlLabel
                value={PaymentModeEnum.CREDITS}
                control={<Radio sx={{ color: LightThemeColors.uriColor, '&.Mui-checked': { color: LightThemeColors.uriColor } }} />}
                label={
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha('#9b59b6', 0.12),
                          color: '#9b59b6',
                        }}
                      >
                        <FaCoins size={16} />
                      </Box>
                      <Box>
                        <Typography fontWeight={700} sx={{ color: '#141414' }}>
                          Pay with Credits
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                          Available: {NumberHelper.formatNumber(creditsAvailable)} credits
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography fontWeight={800} sx={{ color: hasEnoughCredits ? '#9b59b6' : '#e74c3c' }}>
                      {totalCreditCost} credits
                    </Typography>
                  </Stack>
                }
                sx={{ width: '100%', m: 0 }}
              />
              {!hasEnoughCredits && selectedMode === PaymentModeEnum.CREDITS && (
                <Alert severity="warning" icon={<FaExclamationTriangle />} sx={{ mt: 2, borderRadius: 2 }}>
                  Insufficient credits. Please purchase more credits.
                </Alert>
              )}
            </Box>

            {/* Wallet Option */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                border: `2px solid ${selectedMode === PaymentModeEnum.WALLET ? LightThemeColors.uriColor : '#e0e0e0'}`,
                backgroundColor: selectedMode === PaymentModeEnum.WALLET ? alpha(LightThemeColors.uriColor, 0.04) : 'transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onClick={() => setSelectedMode(PaymentModeEnum.WALLET)}
            >
              <FormControlLabel
                value={PaymentModeEnum.WALLET}
                control={<Radio sx={{ color: LightThemeColors.uriColor, '&.Mui-checked': { color: LightThemeColors.uriColor } }} />}
                label={
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(LightThemeColors.uriColor, 0.12),
                          color: LightThemeColors.uriColor,
                        }}
                      >
                        <FaWallet size={16} />
                      </Box>
                      <Box>
                        <Typography fontWeight={700} sx={{ color: '#141414' }}>
                          Pay with Wallet
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                          Balance: NGN {NumberHelper.formatNumber(walletBalance)}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography fontWeight={800} sx={{ color: hasEnoughWallet ? LightThemeColors.uriColor : '#e74c3c' }}>
                      NGN {NumberHelper.formatNumber(totalWalletCost)}
                    </Typography>
                  </Stack>
                }
                sx={{ width: '100%', m: 0 }}
              />
              {!hasEnoughWallet && selectedMode === PaymentModeEnum.WALLET && (
                <Alert severity="warning" icon={<FaExclamationTriangle />} sx={{ mt: 2, borderRadius: 2 }}>
                  Insufficient wallet balance. Please fund your wallet.
                </Alert>
              )}
            </Box>
          </RadioGroup>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
              sx={{
                borderRadius: 3,
                py: 1.25,
                fontWeight: 800,
                borderColor: '#e0e0e0',
                color: '#6B6B6B',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirm}
              disabled={!canProceed || isLoading}
              sx={{
                borderRadius: 3,
                py: 1.25,
                fontWeight: 800,
                backgroundColor: LightThemeColors.uriColor,
                '&:hover': { backgroundColor: '#B8186A' },
                '&:disabled': { backgroundColor: '#e0e0e0' },
              }}
            >
              {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : `Confirm & ${actionLabel}`}
            </Button>
          </Stack>

          {!canProceed && (
            <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', mt: 2, textAlign: 'center' }}>
              {selectedMode === PaymentModeEnum.WALLET ? 'Fund your wallet to proceed' : 'Purchase credits to proceed'}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
