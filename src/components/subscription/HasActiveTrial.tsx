import { TrialService, TrialStatus } from '@/api/TrialService';
import Spinner from '@/components/loaders/Spinner';
import TrialUsageWidget from '@/components/trial/TrialUsageWidget';
import { LightThemeColors } from '@/configs/colors.config';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Button, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';

const HasActiveTrial = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (!userDetails?.userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          setTrialStatus(response.responseData);
        }
      } catch (error) {
        console.error('Error fetching trial status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialStatus();
  }, [userDetails?.userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Spinner color={LightThemeColors.uriColor} />
      </Box>
    );
  }

  if (!trialStatus) {
    return null;
  }

  const isExpired = trialStatus.status === 'expired';
  const isActive = trialStatus.status === 'active';

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        width: '100%',
        margin: 'auto',
      }}
    >
      {/* Active Trial View */}
      {isActive && (
        <>
          {/* Header Section */}
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              p: 4,
              mb: 3,
              boxShadow: '-1px -1px 10px 2px #0000000D',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  backgroundColor: '#FFF0F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '32px' }}>🎉</Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
                    fontWeight: 700,
                    color: '#141416',
                  }}
                >
                  Free Trial Active
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#6C727F',
                  }}
                >
                  {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''} remaining
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#3B3B3B',
                mb: 3,
              }}
            >
              You're currently enjoying full access to all premium features.{' '}
              <Typography
                component="span"
                onClick={() => router.push('/pricing')}
                sx={{
                  color: '#CD1B78',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#A01560',
                  },
                }}
              >
                Upgrade anytime
              </Typography>{' '}
              to continue after your trial ends.
            </Typography>

            {/* Trial Details Card */}
            <Box
              sx={{
                backgroundColor: '#FDFDFD',
                borderRadius: '12px',
                p: 3,
                boxShadow: '0px 2px 4px 0px #00000010',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#6C727F',
                      mb: 0.5,
                    }}
                  >
                    Trial Started
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#141416',
                    }}
                  >
                    {dayjs(trialStatus.startDate).format('MMM DD, YYYY')}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#6C727F',
                      mb: 0.5,
                    }}
                  >
                    Trial Expires
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#CD1B78',
                    }}
                  >
                    {dayjs(trialStatus.endDate).format('MMM DD, YYYY')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Upgrade CTA */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                onClick={() => router.push('/pricing')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  boxShadow: 'none',
                }}
              >
                Upgrade to Premium
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/dashboard')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>

          {/* Usage Widget */}
          <TrialUsageWidget trialStatus={trialStatus} />
        </>
      )}

      {/* Expired Trial View */}
      {isExpired && (
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            p: 4,
            boxShadow: '-1px -1px 10px 2px #0000000D',
          }}
        >
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Upgrade now to continue using premium features and keep building your business
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Trial Summary */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#131313',
                mb: 3,
                textAlign: 'center',
              }}
            >
              🎉 What You Accomplished During Your Trial:
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 3,
                maxWidth: '900px',
                mx: 'auto',
              }}
            >
              {[
                { label: 'Leads Generated', value: trialStatus.usage.leadsGenerated, icon: '🎯' },
                { label: 'Signals Monitored', value: trialStatus.usage.signalsUsed, icon: '📊' },
                {
                  label: 'Trackers Used',
                  value: trialStatus.usage.accountsTracked + trialStatus.usage.hashtagsTracked + trialStatus.usage.keywordsTracked,
                  icon: '📍',
                },
                { label: 'Reports Created', value: trialStatus.usage.reportsGenerated, icon: '📈' },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    backgroundColor: '#FDFDFD',
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    boxShadow: '0px 2px 4px 0px #00000010',
                  }}
                >
                  <Typography sx={{ fontSize: '32px', mb: 1 }}>{item.icon}</Typography>
                  <Typography
                    sx={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#CD1B78',
                      mb: 0.5,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#8C8C8C',
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Premium Benefits */}
          <Box sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#131313',
                mb: 3,
              }}
            >
              Continue With Premium:
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
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
              mb: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.push('/pricing')}
              sx={{
                borderRadius: '12px',
                px: 5,
                py: 1.75,
                boxShadow: 'none',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              View Plans & Upgrade
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/dashboard')}
              sx={{
                borderRadius: '12px',
                px: 5,
                py: 1.75,
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          {/* Special Offer Badge */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: '#FFF0F7',
              borderRadius: '12px',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            <Typography
              sx={{
                color: '#CD1B78',
                fontSize: '15px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              💎 Limited Time: Get 10% off on annual plans
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HasActiveTrial;
