import { Box, Button, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface LimitExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureType: 'lead' | 'report' | 'ai_message' | 'hashtag' | 'keyword' | 'account';
  currentUsage?: number;
  limit?: number;
  planName?: string;
}

const featureDisplayNames = {
  lead: 'Lead Generation',
  report: 'Report Generation',
  ai_message: 'AI Assistant Messages',
  hashtag: 'Hashtag Tracking',
  keyword: 'Keyword Tracking',
  account: 'Account Tracking',
};

const featureDescriptions = {
  lead: 'generate new leads',
  report: 'generate analytics reports',
  ai_message: 'send AI assistant messages',
  hashtag: 'track hashtags',
  keyword: 'track keywords',
  account: 'track social media accounts',
};

export const LimitExceededModal: React.FC<LimitExceededModalProps> = ({ isOpen, onClose, featureType, currentUsage = 0, limit = 0, planName = 'your current plan' }) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
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
            backgroundColor: '#CD1B78',
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
              <FaExclamationTriangle size={28} color="#fff" />
            </Box>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#fff',
                mb: 0.5,
              }}
            >
              Limit Reached
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              You've reached your {featureDisplayNames[featureType]} limit
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ padding: '20px 20px' }}>
          {/* Usage Stats */}
          <Box
            sx={{
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              padding: '16px',
              mb: 2.5,
              border: '1px solid #e5e7eb',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Current Usage</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#CD1B78' }}>
                {currentUsage} / {limit === -1 ? '∞' : limit}
              </Typography>
            </Box>

            {/* Progress Bar */}
            <Box
              sx={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: limit === -1 ? '100%' : `${Math.min((currentUsage / limit) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: '#CD1B78',
                  transition: 'width 0.3s ease',
                }}
              />
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
            You've used all your allocated {featureDisplayNames[featureType].toLowerCase()} credits in {planName}. To continue to {featureDescriptions[featureType]}, please upgrade to a higher plan.
          </Typography>

          {/* Benefits List */}
          <Box
            sx={{
              backgroundColor: '#fef3f8',
              borderRadius: '10px',
              padding: '14px',
              mb: 2.5,
              border: '1px solid #fce4f0',
            }}
          >
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#CD1B78', mb: 1.5 }}>✨ Upgrade Benefits:</Typography>
            <Box component="ul" sx={{ margin: 0, paddingLeft: '18px' }}>
              <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.75 }}>
                Unlimited or higher limits for all features
              </Typography>
              <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.75 }}>
                Advanced analytics and insights
              </Typography>
              <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280', mb: 0.75 }}>
                Priority customer support
              </Typography>
              <Typography component="li" sx={{ fontSize: '12px', color: '#6b7280' }}>
                Access to premium features
              </Typography>
            </Box>
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
              Maybe Later
            </Button>
            <Button
              fullWidth
              onClick={handleUpgrade}
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
              <FaRocket size={14} />
              Upgrade Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
