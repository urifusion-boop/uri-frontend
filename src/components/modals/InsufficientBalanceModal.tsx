import { Box, Button, Modal, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMode: 'WALLET' | 'CREDITS';
  requiredAmount: number;
  availableBalance: number;
  actionType?: 'SCAN' | 'LEAD' | 'ENRICHMENT';
  onPaymentModeChange?: (mode: 'WALLET' | 'CREDITS') => void;
  onRetry?: () => void;
}

export const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
  isOpen,
  onClose,
  paymentMode,
  requiredAmount,
  availableBalance,
  actionType = 'SCAN',
  onPaymentModeChange,
  onRetry,
}) => {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<'WALLET' | 'CREDITS'>(paymentMode);

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'WALLET' | 'CREDITS' | null) => {
    if (newMode) {
      setSelectedMode(newMode);
      onPaymentModeChange?.(newMode);
    }
  };

  const handleFundWallet = () => {
    router.push('/wallet');
    onClose();
  };

  const handleBuyCredits = () => {
    router.push('/wallet?tab=credits');
    onClose();
  };

  const isWallet = selectedMode === 'WALLET';
  const shortfall = requiredAmount - availableBalance;

  const actionDescriptions = {
    SCAN: 'lead generation scan',
    LEAD: 'lead capture',
    ENRICHMENT: 'lead enrichment',
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          backgroundColor: '#fff',
          maxWidth: '480px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#f59e0b',
            padding: '20px 20px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
            onClick={onClose}
          >
            <MdClose size={18} color="#fff" />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {isWallet ? <FaWallet size={28} color="#fff" /> : <FaCoins size={28} color="#fff" />}
            </Box>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#fff',
                mb: 0.5,
              }}
            >
              Insufficient {isWallet ? 'Wallet Balance' : 'Credits'}
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              You need more {isWallet ? 'funds' : 'credits'} for this {actionDescriptions[actionType]}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ padding: '20px 20px' }}>
          {/* Payment Mode Toggle */}
          <Box sx={{ mb: 2.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: '#6b7280', mb: 1 }}>Payment Method</Typography>
            <ToggleButtonGroup value={selectedMode} exclusive onChange={handleModeChange} sx={{ width: '100%' }}>
              <ToggleButton
                value="WALLET"
                sx={{
                  flex: 1,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: '#CD1B78',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#a01560',
                    },
                  },
                }}
              >
                <FaWallet style={{ marginRight: 8 }} />
                Wallet (PAYG)
              </ToggleButton>
              <ToggleButton
                value="CREDITS"
                sx={{
                  flex: 1,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: '#CD1B78',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#a01560',
                    },
                  },
                }}
              >
                <FaCoins style={{ marginRight: 8 }} />
                Credits
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Balance Stats */}
          <Box
            sx={{
              backgroundColor: '#fef3c7',
              borderRadius: '10px',
              padding: '16px',
              mb: 2.5,
              border: '1px solid #fcd34d',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '13px', color: '#92400e', fontWeight: 500 }}>Available</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#92400e' }}>{isWallet ? `₦${availableBalance.toLocaleString()}` : `${availableBalance} credits`}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '13px', color: '#92400e', fontWeight: 500 }}>Required</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#b45309' }}>{isWallet ? `₦${requiredAmount.toLocaleString()}` : `${requiredAmount} credits`}</Typography>
            </Box>
            <Box
              sx={{
                borderTop: '1px dashed #fcd34d',
                pt: 1,
                mt: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>Shortfall</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#dc2626' }}>{isWallet ? `₦${shortfall.toLocaleString()}` : `${shortfall} credits`}</Typography>
            </Box>
          </Box>

          {/* Message */}
          <Typography
            sx={{
              fontSize: '14px',
              color: '#4b5563',
              lineHeight: 1.6,
              mb: 2.5,
              textAlign: 'center',
            }}
          >
            {isWallet ? 'Fund your wallet to continue with Pay-As-You-Go pricing.' : 'Purchase a credit bundle for discounted rates on lead generation.'}
          </Typography>

          {/* Pricing Info */}
          <Box
            sx={{
              backgroundColor: '#f0fdf4',
              borderRadius: '10px',
              padding: '14px',
              mb: 2.5,
              border: '1px solid #bbf7d0',
            }}
          >
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#15803d', mb: 1 }}>{isWallet ? '💰 PAYG Pricing:' : '🎁 Credit Bundle Savings:'}</Typography>
            {isWallet ? (
              <Box component="ul" sx={{ margin: 0, paddingLeft: '18px' }}>
                <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.5 }}>
                  Scan: ₦750 per search
                </Typography>
                <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.5 }}>
                  Lead: ₦225 per lead
                </Typography>
                <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280' }}>
                  Minimum funding: ₦5,000
                </Typography>
              </Box>
            ) : (
              <Box component="ul" sx={{ margin: 0, paddingLeft: '18px' }}>
                <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.5 }}>
                  Small Bundle: 10 credits for ₦7,500
                </Typography>
                <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.5 }}>
                  Medium Bundle: 30 credits for ₦20,500
                </Typography>
                <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280' }}>
                  Enterprise: 150 credits for ₦112,500
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6b7280',
                borderColor: '#e5e7eb',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#CD1B78',
                  backgroundColor: 'rgba(205, 27, 120, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={isWallet ? handleFundWallet : handleBuyCredits}
              sx={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                backgroundColor: '#CD1B78',
                borderRadius: '8px',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  backgroundColor: '#a01560',
                  boxShadow: '0 4px 12px rgba(205, 27, 120, 0.3)',
                },
                transition: 'all 0.2s',
              }}
            >
              {isWallet ? (
                <>
                  <FaWallet size={14} />
                  Fund Wallet
                </>
              ) : (
                <>
                  <FaCoins size={14} />
                  Buy Credits
                </>
              )}
            </Button>
          </Box>

          {/* Retry with different mode hint */}
          {onRetry && (
            <Typography
              sx={{
                fontSize: '12px',
                color: '#9ca3af',
                textAlign: 'center',
                mt: 2,
              }}
            >
              Switch payment method above and click retry if you have balance in the other option
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
