import { TrialService } from '@/api/TrialService';
import { useAuth } from '@/providers/AuthProvider';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const SubscriptionModal: React.FC = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();

  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [activatingTrial, setActivatingTrial] = useState(false);

  useEffect(() => {
    const checkTrialEligibility = async () => {
      if (!userDetails?.userId) {
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await TrialService.getTrialStatus(userDetails.userId);
        if (response.status && response.responseData) {
          const { hasUsedFreeTrial, status } = response.responseData;
          // User is eligible if they haven't used trial and it's not started
          const eligible = !hasUsedFreeTrial && status === 'not_started';
          setIsTrialEligible(eligible);
        } else {
          // If status check fails, assume eligible (new users should see trial offer)
          setIsTrialEligible(true);
        }
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
        // On error (403, 404, etc), assume eligible for new users
        setIsTrialEligible(true);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkTrialEligibility();
  }, [userDetails]);

  const handleGoBack = () => {
    setOpen(false);
    window.location.href = '/dashboard';
  };

  const handleStartTrial = async () => {
    if (!userDetails?.userId) {
      toast.error('User not found. Please login again.');
      return;
    }

    try {
      setActivatingTrial(true);
      const response = await TrialService.activateTrial(userDetails.userId);

      if (response.status) {
        toast.success('🎉 Your 7-day free trial has started!');

        // Save new JWT token with updated trialStatus claim
        if (response.responseData?.accessToken) {
          localStorage.setItem('token', response.responseData.accessToken);
        }
        if (response.responseData?.refreshToken) {
          localStorage.setItem('refreshToken', response.responseData.refreshToken);
        }

        // Invalidate feature limit query to refetch with new trial access
        await queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

        // Close modal - user can now access features
        setOpen(false);
      } else {
        toast.error(response.responseMessage || 'Failed to activate trial');
      }
    } catch (error: any) {
      console.error('Trial activation error:', error);
      toast.error(error?.response?.data?.responseMessage || 'Something went wrong');
    } finally {
      setActivatingTrial(false);
    }
  };

  const handleViewPaidPlans = () => {
    setOpen(false);
    router.push('/pricing');
  };

  // Trial features
  const trialFeatures = ['100 Lead Credits', '150 Intent Signals', '1 Account Tracker', '1 Hashtag Tracker', '1 Keyword Tracker', 'Unlimited Reports'];

  // Paid subscription features
  const paidFeatures = ['Monitor Keyword Trends', 'Setup Alerts', 'Track Sentiment', 'Generate Leads'];

  if (checkingEligibility) {
    return (
      <Modal open={open} onClose={() => {}} disableEscapeKeyDown>
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 9,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              borderRadius: '12px',
              p: 4,
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            <CircularProgress sx={{ color: '#CD1B78' }} />
            <Typography sx={{ mt: 2, color: '#8C8C8C' }}>Checking eligibility...</Typography>
          </Box>
        </>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={() => {}} disableEscapeKeyDown>
      <>
        {/* Black overlay */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9,
          }}
        />

        {/* Modal content */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '95vh',
            overflow: 'auto',
            zIndex: 10,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
          }}
        >
          {isTrialEligible ? (
            // TRIAL OFFER UI - Compact version
            <>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  backgroundColor: '#FFF0F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <Typography sx={{ fontSize: '36px' }}>🎉</Typography>
              </Box>

              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: '#141416',
                  mb: 0.5,
                  fontSize: '22px',
                }}
              >
                Start Your 7-Day Free Trial
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#6B6B6B',
                  fontSize: '14px',
                  mb: 2,
                  px: 2,
                }}
              >
                Get full access to all premium features with no credit card required
              </Typography>

              <List sx={{ width: '100%', mb: 1.5, py: 0 }}>
                {trialFeatures.map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.3, px: 2 }}>
                    <ListItemIcon
                      sx={{
                        minWidth: '28px',
                        color: '#CD1B78',
                      }}
                    >
                      <CheckIcon sx={{ fontSize: '18px' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#131313',
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box
                sx={{
                  backgroundColor: '#FFF0F7',
                  borderRadius: '10px',
                  p: 1.5,
                  mb: 2,
                  width: '100%',
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
                  ⏰ Trial expires in 7 days • No credit card required
                </Typography>
              </Box>

              {/* Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  width: '100%',
                  px: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={activatingTrial}
                  sx={{
                    py: 1.25,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                  onClick={handleStartTrial}
                >
                  {activatingTrial ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Start Free Trial Now'}
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  disabled={activatingTrial}
                  sx={{
                    py: 0.5,
                    color: '#8C8C8C',
                    fontSize: '13px',
                    textDecoration: 'underline',
                  }}
                  onClick={handleViewPaidPlans}
                >
                  View Paid Plans Instead
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled={activatingTrial}
                  sx={{
                    py: 1.25,
                    borderRadius: '12px',
                    fontSize: '14px',
                  }}
                  onClick={handleGoBack}
                >
                  Go Back
                </Button>
              </Box>
            </>
          ) : (
            // PAID SUBSCRIPTION UI (for users who already used trial)
            <>
              <img src="/assets/images/premium-img.png" width="204px" height="204px" alt="Premium Feature" style={{ margin: '0 auto', objectFit: 'contain' }} />

              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{
                  textAlign: 'left',
                  px: '16px',
                }}
              >
                Subscribe to Premium
              </Typography>

              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: 'left',
                  px: '16px',
                }}
              >
                Please subscribe to our Premium Plan to get access to premium features
              </Typography>

              <List>
                {paidFeatures.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon
                      sx={{
                        minWidth: '28px',
                        color: 'primary.main',
                      }}
                    >
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>

              {/* Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: '180px',
                    py: 1.5,
                    borderRadius: '8px',
                  }}
                  onClick={handleViewPaidPlans}
                >
                  Get Access Now
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleGoBack}
                  sx={{
                    width: '130px',
                    py: 1.5,
                    borderRadius: '8px',
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </>
          )}
        </Box>
      </>
    </Modal>
  );
};

export default SubscriptionModal;
