import { Box, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';

import BeaconBubble from '@/components/guide-tour/bubble';
import { DateHelper } from '@/helpers/DateHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { useActiveSubscription } from '@/hooks/subscription/activeSubscription.hook';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import CustomButton from '../atoms/CustomButton';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  margin: '0 auto',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Title = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333',
});

const DateText = styled(Typography)({
  fontSize: '0.9rem',
  color: '#555',
});

const DateBox = styled(Box)({
  backgroundColor: 'gray',
  color: '#fff',
  textTransform: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  // "&:hover": {
  //   backgroundColor: "#ff6f00",
  // },
});

interface DashboardCardProps {
  username: string;
  startTour?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = React.memo(({ username, startTour }) => {
  const [currentDateTime, setCurrentDateTime] = useState(dayjs());
  const { userDetails } = useAuth();
  const router = useRouter();
  const { activeSubscription } = useActiveSubscription();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hasActiveSubscription = userDetails?.subscriptionStatus === SubscriptionStatusEnum.ACTIVE || !!activeSubscription;
  const isSocialListeningFree = activeSubscription?.plan?.plan_code === 'SOCIAL_LISTENING_FREE_MONTHLY' || (!activeSubscription && userDetails?.subscriptionStatus === SubscriptionStatusEnum.ACTIVE);

  return (
    <Container>
      {/* Header */}
      <Header>
        <Box>
          <Box display="flex" alignItems="center">
            <Title>Hello, {username} 👋</Title>
            {startTour && <BeaconBubble onClick={startTour} />}
          </Box>
          <DateText>{DateHelper.getCurrentDate()}</DateText>
        </Box>
        <DateBox>
          <AccessTimeIcon />
          <Typography variant="body1" className="text-white">
            {currentDateTime.format('hh:mm A')}
          </Typography>
        </DateBox>
      </Header>

      {/* Main Card Content */}
      <Box className="relative text-white px-8 py-12 overflow-hidden bg-dashboard-card-bg bg-cover bg-center rounded-2xl">
        <Box>
          <Typography className="md:text-[32px] z-[99] relative text-[20px] font-bold max-w-[593px] text-white">
            Supercharge Your Business with Lead Generation, AI-Powered Social and Campaign Insights.
          </Typography>

          {hasActiveSubscription && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                mt: 2,
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                backgroundColor: 'rgba(34,197,94,0.15)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#BBF7D0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mr: 1,
                }}
              >
                {isSocialListeningFree ? 'Social Listening Free' : TextHelper.removeChar(activeSubscription?.plan?.name ?? 'Active Plan', '_')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#DCFCE7',
                }}
              >
                Active
              </Typography>
            </Box>
          )}

          {!hasActiveSubscription && (
            <CustomButton mode="primary" textStyles="font-semibold" className="bg-white mt-4 max-w-fit font-semibold" textColor="#CD1B78" onClick={() => router.push('/dashboard')}>
              `Unlock Premium`
            </CustomButton>
          )}
        </Box>
      </Box>
    </Container>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
