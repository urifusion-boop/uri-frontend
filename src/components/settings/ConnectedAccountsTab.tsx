import { useConnectedAccountsHook } from '@/hooks/content-management/connectedAccounts.hook';
import { Box, Button, Chip, Divider, Grid, Typography, lighten } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { BsPlus } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import IosSwitch from '../atoms/IosSwitch';
import LoaderWrapper from '../atoms/LoaderWrapper';
import PlatformIcon from '../atoms/PlatformIcons';
import SkeletonLoader from '../loaders/SkeletonLoader';
import ConnectSocialMediaModal from '../modals/ConnectSocialMediaModal';
import SmartModal from '../modals/SmartModal';

const ConnectedAccountsTab = () => {
  const [openDisconnectModal, setOpenDisconnectModal] = useState(false);
  const [openConnectModal, setOpenConnectModal] = useState(false);

  const { connectedAccounts, gettingConnectedAccounts, setSelectedPlatformForDisConnect, disconnectAccount, connectingAccount, getAuthUrlFunction, isConnecting } = useConnectedAccountsHook(
    undefined,
    process.env.NEXT_PUBLIC_SETTINGS_REDIRECT_URL,
    '/settings'
  );

  return connectingAccount ? (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <SkeletonLoader />
    </Box>
  ) : (
    <>
      <Box
        sx={{
          maxWidth: '930px',
          width: '100%',
          margin: 'auto',
          borderRadius: '12px',
          backgroundColor: '#fff',
          py: '24px',
          boxShadow: '-1px -1px 10px 2px #0000000D',
          px: {
            xs: '14px',
            md: '26px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
                fontWeight: 600,
                color: '#404040',
                mb: '6px',
              }}
            >
              Connected Accounts
            </Typography>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#3B3B3B',
                mb: '16px',
              }}
            >
              View, Add and Modify your social media accounts
            </Typography>
          </Box>

          <Button variant="contained" color="primary" startIcon={<BsPlus />} onClick={() => setOpenConnectModal(true)} disabled={gettingConnectedAccounts || connectingAccount}>
            Add Accounts
          </Button>
        </Box>

        <LoaderWrapper isLoading={gettingConnectedAccounts} numberOfSkeletons={3} isGrid skeletonHeight="200px">
          {connectedAccounts?.length > 0 ? (
            <Grid container spacing={4}>
              {connectedAccounts?.map((account: any) => (
                <Grid item xs={12} sm={6} md={4} key={account.influencer_id}>
                  <Box
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      height: '100%',
                      p: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <img src={account.profile_pic} alt={account.social_name} width={40} height={40} style={{ borderRadius: '50%' }} />
                        <Box
                          sx={{
                            position: 'absolute',
                            right: '-10px',
                            bottom: '-10px',
                          }}
                        >
                          <PlatformIcon platform={account.social_platform ?? ''} size={25} />
                        </Box>
                      </Box>
                      <IosSwitch
                        sx={{ m: 1 }}
                        checked={account.connected ?? false}
                        onChange={() => {
                          setSelectedPlatformForDisConnect({
                            influencerId: account.influencer_id ?? '',
                            platform: account.social_platform ?? '',
                          });
                          setOpenDisconnectModal(true);
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: {
                              xs: '0.8rem',
                              sm: '0.9rem',
                              md: '1rem',
                            },
                            fontWeight: 600,
                          }}
                        >
                          {account.social_username}
                        </Typography>
                        {account.connected && <FaCheckCircle color={lighten('#008000', 0.5)} size={16} />}
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                        {account.social_name}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            display: 'block',
                            fontSize: '0.7rem',
                          }}
                        >
                          Created on
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 500,
                            color: (theme) => theme.palette.text.primary,
                          }}
                        >
                          {dayjs(account.createdAt).format('MMM DD, YYYY')}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={account.connected ? 'Connected' : 'Disconnected'}
                        sx={{
                          fontSize: '0.7rem',
                          backgroundColor: account.connected ? lighten('#4CAF50', 0.9) : lighten('#ff9800', 0.9),
                          color: account.connected ? '#2E7D32' : '#E65100',
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                No Account Connected
              </Typography>
            </Box>
          )}
        </LoaderWrapper>
      </Box>

      <SmartModal
        open={openDisconnectModal}
        mainText="Are You Sure You Want to Disconnect?"
        subText="This will disconnect your account. You can reconnect anytime."
        onClick={() => {
          disconnectAccount.mutate(undefined, {
            onSuccess: () => {
              setOpenDisconnectModal(false);
            },
            onError: () => {
              setOpenDisconnectModal(false);
            },
          });
        }}
        image={
          <Box
            sx={{
              backgroundColor: '#FFC4C442',
              borderRadius: '50%',
              height: '79px',
              width: '79px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BiX color="#A9302D" size={55} />
          </Box>
        }
        buttonText="Disconnect"
        onOutlineButtonClick={() => {
          setOpenDisconnectModal(false);
        }}
        loading={disconnectAccount.isLoading}
        outlineButtonText="Keep"
      />

      <ConnectSocialMediaModal
        connectedAccounts={connectedAccounts ?? []}
        handleClose={() => setOpenConnectModal(false)}
        open={openConnectModal}
        handleConnect={(platform, username) => getAuthUrlFunction(platform, username)}
        isConnecting={isConnecting}
      />
    </>
  );
};

export default ConnectedAccountsTab;
