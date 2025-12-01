import { TrialStatus } from '@/api/TrialService';
import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';

interface TrialUsageWidgetProps {
  trialStatus: TrialStatus;
}

const TrialUsageWidget: React.FC<TrialUsageWidgetProps> = ({ trialStatus }) => {
  if (trialStatus.status !== 'active') {
    return null;
  }

  const { usage } = trialStatus;

  const usageItems = [
    {
      label: 'Leads Generated',
      current: usage.leadsGenerated,
      max: usage.maxLeads,
      icon: '🎯',
    },
    {
      label: 'Intent Signals',
      current: usage.signalsUsed,
      max: usage.maxSignals,
      icon: '📊',
    },
    {
      label: 'Account Trackers',
      current: usage.accountsTracked,
      max: usage.maxAccountTrackers,
      icon: '👤',
    },
    {
      label: 'Hashtag Trackers',
      current: usage.hashtagsTracked,
      max: usage.maxHashtagTrackers,
      icon: '#️⃣',
    },
    {
      label: 'Keyword Trackers',
      current: usage.keywordsTracked,
      max: usage.maxKeywordTrackers,
      icon: '🔑',
    },
    {
      label: 'Reports Generated',
      current: usage.reportsGenerated,
      max: usage.maxReports > 0 ? usage.maxReports : 5, // Show 5 if maxReports is -1 or invalid
      icon: '📈',
      isUnlimited: false, // No longer unlimited in trial
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#FDFDFD',
        borderRadius: '20px',
        p: 3,
        boxShadow: '0px 2px 4px 0px #00000040',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <BsFillPatchCheckFill size={20} color="#CD1B78" />
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#131313',
            }}
          >
            Trial Usage
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#8C8C8C',
          }}
        >
          Track your free trial progress
        </Typography>
      </Box>

      {/* Usage Items */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {usageItems.map((item, index) => {
          const progress = item.isUnlimited ? 0 : (item.current / item.max) * 100;
          const isLimitReached = !item.isUnlimited && item.current >= item.max;

          return (
            <Box key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '16px' }}>{item.icon}</Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#131313',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isLimitReached ? '#FF6B6B' : '#CD1B78',
                  }}
                >
                  {item.isUnlimited ? `${item.current} (Unlimited)` : `${item.current}/${item.max}`}
                </Typography>
              </Box>

              {!item.isUnlimited && (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#FFE5F3',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: isLimitReached ? '#FF6B6B' : '#CD1B78',
                      borderRadius: 3,
                    },
                  }}
                />
              )}

              {isLimitReached && (
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#FF6B6B',
                    mt: 0.5,
                  }}
                >
                  Limit reached • Upgrade to continue
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Footer Badge */}
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
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          💡 Upgrade to unlock unlimited access
        </Typography>
      </Box>
    </Box>
  );
};

export default TrialUsageWidget;
