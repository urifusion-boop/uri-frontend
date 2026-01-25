import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import GlobalServices from '@/components/dashboard/GlobalServices';
import GuideTour from '@/components/guide-tour/guide-tour';
import { DASHBOARD_TOUR_STEPS } from '@/components/guide-tour/tour-steps/dashboard-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import CustomModal from '@/components/modals/CustomModal';
import SubscriptionStatusBanner from '@/components/subscription/SubscriptionStatusBanner';
import TrialCountdownBanner from '@/components/trial/TrialCountdownBanner';
import TrialExpiredModal from '@/components/trial/TrialExpiredModal';
import { useClientsDashHook } from '@/hooks/clients/dashboard.hook';
import { useTrialStatus } from '@/hooks/trial/useTrial.hook';
import { useModal } from '@/hooks/utils.hook';
import { useAuth } from '@/providers/AuthProvider';
import SeoHead from '../../components/atoms/SeoHead';

const ClientsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const { userDetails, tabButtons } = useClientsDashHook();
  const { userDetails: authUser } = useAuth();
  const { open, openModal, closeModal, setOpen } = useModal();
  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: DASHBOARD_TOUR_STEPS,
    tourKey: 'hasSeenDashboardTour',
  });

  // Fetch trial status with automatic polling
  const { data: trialStatus } = useTrialStatus(authUser?.userId);

  // Show expired modal if trial expired
  useEffect(() => {
    if (trialStatus?.status === 'expired') {
      setShowExpiredModal(true);
    }
  }, [trialStatus?.status]);

  useEffect(() => {
    const showWelcome = localStorage.getItem('URI_WELCOME');
    if (!showWelcome) {
      localStorage.setItem('URI_WELCOME', 'true');
      openModal();
    }

    // Check if user just completed onboarding
    const newUserModules = localStorage.getItem('newUserModules');
    if (newUserModules) {
      // Show welcome modal for new users
      openModal();

      // Mark that we've shown the intro
      localStorage.removeItem('newUserModules');
      localStorage.setItem('showModuleTours', 'true');
    }
  }, [openModal]);

  return (
    <DashboardLayout>
      <SeoHead title="Dashboard" />
      <GuideTour steps={steps} run={run} onFinish={handleTourFinish} onSkip={handleTourFinish} />

      <Box sx={{ px: { xs: 1, md: 4 }, py: 2 }}>
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, padding: { xs: 2, md: 4 } }}>
          <DashboardCard startTour={startTour} username={userDetails?.firstName ?? ''} />

          {/* Trial Countdown Banner */}
          {trialStatus && trialStatus.status === 'active' && (
            <Box sx={{ mt: 3 }}>
              <TrialCountdownBanner trialStatus={trialStatus} />
            </Box>
          )}

          {/* Subscription Status Banner (for Free Social Listening users) */}
          <Box sx={{ mt: 3 }}>
            <SubscriptionStatusBanner />
          </Box>

          <Box display="flex" borderBottom="1px solid #E0E0E0" justifyContent="flex-start" width={'100%'} overflow="auto" mt={3} mb={3}>
            {tabButtons.map((tab) => (
              <Box
                key={tab.value}
                px={3}
                py={1}
                sx={{ cursor: 'pointer', borderBottom: activeTab === tab.value ? '3px solid #CD1B78' : 'none', transition: 'border-bottom 0.3s ease' }}
                onClick={() => setActiveTab(tab.value)}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  style={{ textTransform: 'capitalize' }}
                  fontSize={14}
                  fontWeight={activeTab === tab.value ? 600 : 400}
                  color={activeTab === tab.value ? '#CD1B78' : '#6F6F6F'}
                >
                  <tab.icon color={activeTab === tab.value ? '#CD1B78' : '#6F6F6F'} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'inherit' }}>{tab.value === 'navigation' ? 'Navigation' : tab.label}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box my={3} width={'100%'}>
            {activeTab === 'overview' && (
              <GlobalServices />
              // <>
              //   <div className="row g-20"></div>
              // </>
            )}
          </Box>
        </Box>

        <CustomModal width="556px" open={open} setOpen={setOpen} closeOnOverlayClick={false}>
          <Box
            sx={{
              height: '300px',
              backgroundImage: `url(/assets/images/welcome.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
            }}
          ></Box>
          <Box sx={{ padding: '20px 50px' }}>
            <Text size={32} weight={700} center>
              Welcome to Uri
            </Text>
            <Text size={16} weight={500} center>
              {`We're glad to have you onboard. Here are some quick tips to get you up and running.`}
            </Text>
            <CustomButton mode="primary" style={{ marginTop: '20px', border: '0px' }} type="submit" loading={false} data-testid="continue-button" onClick={() => closeModal()}>
              Continue
            </CustomButton>
          </Box>
        </CustomModal>

        {/* Trial Expired Modal */}
        {trialStatus && <TrialExpiredModal open={showExpiredModal} onClose={() => setShowExpiredModal(false)} trialStatus={trialStatus} />}
      </Box>
    </DashboardLayout>
  );
};

export default ClientsDashboard;
