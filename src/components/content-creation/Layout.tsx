import { Box, Button, Typography, lighten, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';

import { useConnectedAccountsHook } from '@/hooks/content-management/connectedAccounts.hook';
import { triggerToast } from '../atoms/CustomToast';
import DashboardLayout from '../atoms/DashboardLayout';
import SeoHead from '../atoms/SeoHead';
import SkeletonLoader from '../loaders/SkeletonLoader';
import ConnectSocialMediaModal from '../modals/ConnectSocialMediaModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { connectedAccounts, getAuthUrlFunction, gettingConnectedAccounts, connectingAccount, isConnecting } = useConnectedAccountsHook(
    undefined,
    process.env.NEXT_PUBLIC_CONTENT_MANAGEMENT_REDIRECT_URL
  );

  const isSmallScreen = useMediaQuery('(max-width:800px)');
  const [openModal, setOpenModal] = useState(false);

  const handleWatchDemo = () => {
    triggerToast('success', 'Demo not available yet');
  };

  const handleGetStarted = () => {
    setOpenModal(true);
  };

  return (
    <>
      <SeoHead title="Content Management" />
      <DashboardLayout bgColor="#fff" excludeHeader={true}>
        {/* <SubscriptionModal /> */}
        {connectingAccount || gettingConnectedAccounts ? (
          <SkeletonLoader />
        ) : (
          <>
            {connectedAccounts && connectedAccounts.length > 0 ? (
              children
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  color: '#fff',
                  textAlign: 'center',
                  background: lighten('#cd1b78', 0.2),
                }}
              >
                {/* Abstract Shapes */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: isSmallScreen ? '150px' : '300px',
                    height: isSmallScreen ? '150px' : '300px',
                    backgroundColor: '#ffffff20',
                    borderRadius: '50%',
                    top: '10%',
                    left: '-10%',
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: isSmallScreen ? '100px' : '200px',
                    height: isSmallScreen ? '100px' : '200px',
                    backgroundColor: '#ffffff10',
                    borderRadius: '50%',
                    bottom: '15%',
                    right: '-5%',
                    zIndex: 1,
                  }}
                />

                {/* Content */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant={isSmallScreen ? 'h4' : 'h3'}
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: '#f9f9f9',
                    }}
                  >
                    Post Smarter, Not Harder
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      maxWidth: isSmallScreen ? '90%' : '600px',
                      color: '#f9f9f9',
                      mx: 'auto',
                    }}
                  >
                    Organize, optimize, and distribute your content across social media platforms.
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleWatchDemo}
                      sx={{
                        padding: isSmallScreen ? '8px 16px' : '10px 20px',
                        textTransform: 'none',
                        fontSize: isSmallScreen ? '14px' : '16px',
                        backgroundColor: '#fff',
                        color: '#cd1b78',
                        '&:hover': {
                          backgroundColor: '#f2f2f2',
                        },
                      }}
                    >
                      Watch a Demo
                    </Button>
                    <Box
                      onClick={handleGetStarted}
                      component="button"
                      sx={{
                        padding: isSmallScreen ? '8px 16px' : '10px 20px',
                        textTransform: 'none',
                        fontSize: isSmallScreen ? '14px' : '16px',
                        border: '1px solid #ffffff80',
                        borderRadius: '5px',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#ffffff10',
                        },
                      }}
                    >
                      Get Started
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </DashboardLayout>

      <ConnectSocialMediaModal
        handleClose={() => setOpenModal(false)}
        open={openModal}
        connectedAccounts={connectedAccounts ?? []}
        isConnecting={isConnecting}
        handleConnect={(platform, username) => getAuthUrlFunction(platform, username)}
      />
    </>
  );
};

export default Layout;
