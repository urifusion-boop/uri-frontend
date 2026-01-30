import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { alpha, Box, Button, Chip, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { FaCheck, FaHeadphones, FaRocket } from 'react-icons/fa';

interface SubscriptionStatusBannerProps {
  hideUpgradeButton?: boolean;
}

const SubscriptionStatusBanner: React.FC<SubscriptionStatusBannerProps> = ({ hideUpgradeButton = false }) => {
  const router = useRouter();
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLoading = useFeatureLimitStore((state) => state.isLoading);

  const subscriptionPlan = featureLimit?.subscriptionPlan;
  const subscriptionStatus = featureLimit?.subscriptionStatus;

  const isSocialListeningFree = subscriptionPlan === SubscriptionTypeEnum.SocialListeningFree && subscriptionStatus === 'ACTIVE';

  if (isLoading || !isSocialListeningFree) {
    return null;
  }

  const accountTracking = featureLimit?.accountTracking;
  const reportGeneration = featureLimit?.reportGeneration;

  const accountsUsed = accountTracking?.accounts?.count ?? 0;
  const accountsLimit = accountTracking?.accounts?.limit ?? 1;
  const reportsUsed = reportGeneration?.count ?? 0;
  const reportsLimit = reportGeneration?.limit ?? 1;

  const accountsProgress = accountsLimit > 0 ? (accountsUsed / accountsLimit) * 100 : 0;
  const reportsProgress = reportsLimit > 0 ? (reportsUsed / reportsLimit) * 100 : 0;

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)',
        borderRadius: '12px',
        p: 2.5,
        mb: 3,
        border: '1px solid #C8E6C9',
        boxShadow: '0px 2px 4px 0px #00000010',
      }}
    >
      {/* Top Section: Plan Status + Upgrade Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaHeadphones size={22} color="white" />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#141416',
                }}
              >
                Social Listening Free
              </Typography>
              <Chip
                icon={<FaCheck size={10} />}
                label="Active"
                size="small"
                sx={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '10px',
                  height: '22px',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6B6B6B',
              }}
            >
              {accountsUsed}/{accountsLimit} account{accountsLimit !== 1 ? 's' : ''} connected • {reportsUsed}/{reportsLimit} report{reportsLimit !== 1 ? 's' : ''} this month
            </Typography>
          </Box>
        </Box>

        {!hideUpgradeButton && (
          <Button
            variant="contained"
            startIcon={<FaRocket size={14} />}
            onClick={() => router.push('/settings?tab=subscription')}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d35400 0%, #c0392b 100%)',
              },
            }}
          >
            Upgrade Plan
          </Button>
        )}
      </Box>

      {/* Progress Bars */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {/* Accounts Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6B6B6B' }}>Social Accounts</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#2980b9' }}>
              {accountsUsed}/{accountsLimit}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(accountsProgress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha('#3498db', 0.15),
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3498db',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Reports Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6B6B6B' }}>Monthly Reports</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#2980b9' }}>
              {reportsUsed}/{reportsLimit}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(reportsProgress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha('#3498db', 0.15),
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3498db',
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Box>

      {/* Features reminder */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: alpha('#3498db', 0.15),
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FaCheck size={10} color="#16a34a" />
          <Typography sx={{ fontSize: '12px', color: '#6B6B6B' }}>Access to Dera AI</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FaCheck size={10} color="#16a34a" />
          <Typography sx={{ fontSize: '12px', color: '#6B6B6B' }}>PAYG Lead Generation</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FaCheck size={10} color="#16a34a" />
          <Typography sx={{ fontSize: '12px', color: '#6B6B6B' }}>Basic Social Monitoring</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionStatusBanner;
