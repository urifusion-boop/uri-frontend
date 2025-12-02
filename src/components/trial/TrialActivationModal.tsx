import { TrialService } from '@/api/TrialService';
import { UserService } from '@/api/UserService';
import SmartModal from '@/components/modals/SmartModal';
import { SecurityHelper } from '@/helpers/SecurityHelper';
import { UserDto } from '@/models/dtos/UserDto';
import { useAuth } from '@/providers/AuthProvider';
import CheckIcon from '@mui/icons-material/Check';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface TrialActivationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const TrialActivationModal: React.FC<TrialActivationModalProps> = ({ open, onClose, onSuccess, userId }) => {
  const [isActivating, setIsActivating] = useState(false);
  const { saveUserTokens, saveUserDetails } = useAuth();

  const handleActivate = async () => {
    try {
      setIsActivating(true);
      const response = await TrialService.activateTrial(userId);

      if (response.status && response.responseData) {
        toast.success('🎉 Your 7-day free trial has started!');

        // Save new JWT tokens using AuthProvider (correct storage)
        if (response.responseData.accessToken && response.responseData.refreshToken) {
          saveUserTokens({
            accessToken: response.responseData.accessToken,
            refreshToken: response.responseData.refreshToken,
          });

          // Fetch fresh user data from backend with updated trial status
          const userClaims = SecurityHelper.parseJwt(response.responseData.accessToken);
          const userData = await UserService.getByUserIdApi(userClaims?.userId);

          if (userData.status && userData.responseData) {
            saveUserDetails(userData.responseData as unknown as UserDto);
          }
        }

        onSuccess();
        onClose();
      } else {
        toast.error(response.responseMessage || 'Failed to activate trial');
      }
    } catch (error: any) {
      console.error('Trial activation error:', error);
      toast.error(error?.response?.data?.responseMessage || 'Something went wrong');
    } finally {
      setIsActivating(false);
    }
  };

  const trialFeatures = ['100 Lead Credits', '150 Intent Signals', '1 Account Tracker', '1 Hashtag Tracker', '1 Keyword Tracker', '5 AI-Powered Reports'];

  return (
    <SmartModal open={open} onClick={handleActivate} onClose={onClose} maxWidth="sm" showCloseButton={true} buttonText="Start Your Free Trial" loading={isActivating}>
      {/* Hero Section */}
      <Box sx={{ mt: 1, mb: 2 }}>
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
          sx={{
            color: '#6B6B6B',
            fontSize: '14px',
            mb: 2,
            px: 2,
          }}
        >
          Get full access to all premium features with no credit card required
        </Typography>
      </Box>

      {/* Features List */}
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

      {/* Bottom Badge */}
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
    </SmartModal>
  );
};

export default TrialActivationModal;
