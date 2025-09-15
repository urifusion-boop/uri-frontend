import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import Spinner from '@/components/loaders/Spinner';
import { LightThemeColors } from '@/configs/colors.config';
import { Box, Typography } from '@mui/material';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { Suspense, lazy } from 'react';
import { FaCog } from 'react-icons/fa';

const NotificationTab = lazy(() => import('@/components/settings/NotificationTab'));
const ConnectedAccountsTab = lazy(() => import('@/components/settings/ConnectedAccountsTab'));
const SubscriptionTab = lazy(() => import('@/components/settings/SubscriptionTab'));
const ChangePasswordTab = lazy(() => import('@/components/settings/ChangePasswordTab'));
const DeleteAccountTab = lazy(() => import('@/components/settings/DeleteAccountTab'));

const SETTINGS_TABS = ['notification', 'connected-accounts', 'subscription', 'change-password', 'delete-account'] as const;

type SettingsTabType = (typeof SETTINGS_TABS)[number];

const Settings = () => {
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsStringLiteral(SETTINGS_TABS).withDefault('notification'));

  const tabComponents: Record<SettingsTabType, JSX.Element> = {
    notification: <NotificationTab />,
    'connected-accounts': <ConnectedAccountsTab />,
    subscription: <SubscriptionTab />,
    'change-password': <ChangePasswordTab />,
    'delete-account': <DeleteAccountTab />,
  };

  return (
    <>
      <SeoHead title="Settings" />
      <DashboardLayout excludeHeader>
        <Box
          sx={{
            backgroundColor: '#FAFAFA',
            height: '100%',
            minHeight: '100vh',
            // overflow: "auto",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: '#fff',
              pt: '52px',
              pb: '8px',
              px: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                mb: '40px',
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#CD1B78',
                  padding: '8.33px',
                  borderRadius: '6.67px',
                }}
              >
                <FaCog size={25} color="#fff" />
              </Box>
              <Typography
                sx={{
                  fontSize: 'clamp(24px, 1.875vw + 12px, 36px)',
                  color: '#212529',
                  fontWeight: 800,
                  letterSpacing: '0%',
                  lineHeight: '100%',
                }}
              >
                Settings
              </Typography>
            </Box>
            <CustomTabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as any)} tabs={[...SETTINGS_TABS]} />
          </Box>
          {/* Header Ends */}

          {/* Tabs */}
          <Box sx={{ px: 2, mt: '40px', pb: '40px' }}>
            <Suspense
              fallback={
                <Box>
                  <Spinner color={LightThemeColors.uriColor} />
                </Box>
              }
            >
              {tabComponents[activeTab]}
            </Suspense>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Settings;
