import { TrialStatus } from '@/api/TrialService';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

interface TrialCountdownBannerProps {
  trialStatus: TrialStatus;
  hideUpgradeButton?: boolean;
}

const TrialCountdownBanner: React.FC<TrialCountdownBannerProps> = ({ trialStatus, hideUpgradeButton = false }) => {
  const router = useRouter();
  const { subscriptionPlanType } = useAuth();
  const { creditsAvailable, totalCredits } = useCreditBundle();

  if (subscriptionPlanType && subscriptionPlanType !== SubscriptionTypeEnum.FreeTrial) {
    return null;
  }

  if (trialStatus.status !== 'active') {
    return null;
  }

  const { daysRemaining, usage } = trialStatus;
  const displayMaxReports = usage.maxReports > 0 ? usage.maxReports : 5;
  const leadsProgress = (usage.leadsGenerated / usage.maxLeads) * 100;
  const creditsUsed = totalCredits - creditsAvailable;
  const signalsProgress = totalCredits > 0 ? (creditsUsed / totalCredits) * 100 : 0;
  const reportsProgress = (usage.reportsGenerated / displayMaxReports) * 100;

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FFF0F7 0%, #FFFFFF 100%)',
        borderRadius: '12px',
        p: 2.5,
        mb: 3,
        border: '1px solid #FFD6EC',
        boxShadow: '0px 2px 4px 0px #00000010',
      }}
    >
      {/* Top Section: Days Remaining + Upgrade Button */}
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
              backgroundColor: '#CD1B78',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '24px' }}>⏰</Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '16px',
                color: '#141416',
              }}
            >
              {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left in your trial
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#8C8C8C',
              }}
            >
              {usage.leadsGenerated}/{usage.maxLeads} leads • {creditsUsed.toLocaleString()}/{totalCredits.toLocaleString()} credits • {usage.reportsGenerated}/{displayMaxReports} reports
            </Typography>
          </Box>
        </Box>

        {!hideUpgradeButton && (
          <Button
            variant="contained"
            onClick={() => router.push('/pricing')}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Upgrade Now
          </Button>
        )}
      </Box>

      {/* Progress Bars */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {/* Leads Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6B6B6B' }}>Leads</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#CD1B78' }}>
              {usage.leadsGenerated}/{usage.maxLeads}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(leadsProgress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFE5F3',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#CD1B78',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Credits Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6B6B6B' }}>Credits</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#CD1B78' }}>
              {creditsUsed.toLocaleString()}/{totalCredits.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(signalsProgress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFE5F3',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#CD1B78',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Reports Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6B6B6B' }}>Reports</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#CD1B78' }}>
              {usage.reportsGenerated}/{displayMaxReports}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(reportsProgress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFE5F3',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#CD1B78',
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TrialCountdownBanner;
