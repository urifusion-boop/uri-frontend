import React, { ReactNode, useState } from 'react';

import useCustomTheme from '@/hooks/theme.hook';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import styles from '@/styles/Dashboard.module.css';
import { Box } from '@mui/material';
import { UserRoleEnum } from '../../models/enum-models/UserRoleEnums';
import { useAuth } from '../../providers/AuthProvider';
import AdminDashSideNav from '../admin/AdminDashSideNav';
import AdminPageHeader from '../admin/AdminPageHeader';
import PageHeader from '../headers/PageHeader';
import NewSubscription from '../subscription/NewSubscription';
import DashSideNav from './DashSideNav';
import SeoHead from './SeoHead';

interface IProps {
  children: ReactNode;
  bgColor?: string;
  sideNavColor?: string;
  excludeHeader?: boolean;
}

const DashboardLayout: React.FC<IProps> = ({ children, bgColor, sideNavColor, excludeHeader = false }) => {
  const { themeColors } = useCustomTheme();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const { userDetails } = useAuth();

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <>
      {userDetails?.role === UserRoleEnum.ADMIN ? (
        <AdminDashSideNav open={sideNavOpen} setOpen={setSideNavOpen} bgColor={sideNavColor} />
      ) : (
        <DashSideNav open={sideNavOpen} setOpen={setSideNavOpen} bgColor={sideNavColor} />
      )}
      <div
        className={styles.container}
        style={{
          height: '100vh',
          width: sideNavOpen ? 'calc(100% - 300px)' : 'calc(100% - 80px)',
          marginLeft: sideNavOpen ? '300px' : '80px',
          backgroundColor: bgColor ?? themeColors.background,
        }}
      >
        {/* {userDetails?.subscriptionStatus !== SubscriptionStatusEnum.ACTIVE ? (
          <>
            <PageHeader toggleSideNav={toggleSideNav} />
            <Box
              sx={{
                backgroundColor: bgColor ?? themeColors.background,
                px: '20px',
                pb: '40px',
              }}
            >
              <SeoHead />
              <NewSubscription />
            </Box>
          </>
        ) : ( */}
          <>
            {!excludeHeader && (userDetails?.role === UserRoleEnum.ADMIN ? <AdminPageHeader toggleSideNav={toggleSideNav} /> : <PageHeader toggleSideNav={toggleSideNav} />)}
            <div
              style={{
                backgroundColor: bgColor ?? themeColors.background,
                maxWidth: '1800px',
                marginRight: 'auto',
                marginLeft: 'auto',
              }}
            >
              {children}
            </div>
          </>
        {/* )} */}
      </div>
    </>
  );
};

export default DashboardLayout;
