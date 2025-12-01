import { TrialStatus } from '@/api/TrialService';
import SmartModal from '@/components/modals/SmartModal';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';

interface TrialExpiredModalProps {
  open: boolean;
  onClose: () => void;
  trialStatus: TrialStatus;
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ open, onClose, trialStatus }) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/subscription');
    onClose();
  };

  return (
    <SmartModal open={open} onClick={onClose} maxWidth="md" showCloseButton={false}>
      {/* Hero Section */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            backgroundColor: '#FFF0F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: '48px' }}>⏰</Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#141416',
            mb: 1,
          }}
        >
          Your Trial Has Ended
        </Typography>

        <Typography
          sx={{
            color: '#6B6B6B',
            fontSize: '16px',
            maxWidth: '500px',
            mx: 'auto',
          }}
        >
          Upgrade now to continue using premium features
        </Typography>
      </Box>

      {/* Trial Summary */}
      <Box
        sx={{
          backgroundColor: '#FDFDFD',
          borderRadius: '12px',
          p: 3,
          mb: 3,
          boxShadow: '0px 2px 4px 0px #00000010',
        }}
      >
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#131313',
            mb: 2,
          }}
        >
          🎉 What You Accomplished:
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {[
            { label: 'Leads Generated', value: trialStatus.usage.leadsGenerated, icon: '🎯' },
            { label: 'Signals Monitored', value: trialStatus.usage.signalsUsed, icon: '📊' },
            { label: 'Trackers Used', value: trialStatus.usage.accountsTracked + trialStatus.usage.hashtagsTracked + trialStatus.usage.keywordsTracked, icon: '📍' },
            { label: 'Reports Created', value: trialStatus.usage.reportsGenerated, icon: '📈' },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '24px' }}>{item.icon}</Typography>
              <Box>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#CD1B78',
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#8C8C8C',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Upgrade Benefits */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#131313',
            mb: 2,
            textAlign: 'left',
          }}
        >
          Continue With Premium:
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            textAlign: 'left',
          }}
        >
          {['Unlimited lead generation', 'Advanced intent signal analysis', 'Multiple tracker support', 'AI-powered insights', 'Comprehensive reporting', 'Priority support'].map((benefit, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <BsFillPatchCheckFill size={18} color="#CD1B78" />
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#131313',
                }}
              >
                {benefit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* CTA Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="contained"
          onClick={handleUpgrade}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            boxShadow: 'none',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          View Plans & Upgrade
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Maybe Later
        </Button>
      </Box>

      {/* Special Offer Badge */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#FFF0F7',
          borderRadius: '12px',
        }}
      >
        <Typography
          sx={{
            color: '#CD1B78',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          💎 Limited Time: Get 10% off on annual plans
        </Typography>
      </Box>
    </SmartModal>
  );
};

export default TrialExpiredModal;
