import { Box, Button, FormControlLabel, Grid, Pagination, Switch, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiLogoInstagram, BiLogoTiktok, BiX } from 'react-icons/bi';
import { FaFacebook, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

import GuideTour from '@/components/guide-tour/guide-tour';
import { ACCOUNT_TOUR_STEPS } from '@/components/guide-tour/tour-steps/account-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import FeaturesHeader from '@/components/headers/FeaturesHeader';
import TrackLimit from '@/components/trackers/TrackLimit';
import { isFeatureDisabled } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useGetInfluencersByFilters } from '@/hooks/influcencers-tracking/influencers.hook';
import { useInfluencersTrackingOverview } from '@/hooks/influcencers-tracking/overview.hook';
import { InfluencerDto } from '@/models/dtos/InfluencerDto';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import ChartLine from '@/utils/icon/ChartLine';
import AddIcon from '@mui/icons-material/Add';
import SummaryCard from '../cards/SummaryCard';
import SkeletonLoader from '../loaders/SkeletonLoader';
import AddInfluencerAccountModal from '../modals/AddInfluencerAccountModal';
import CustomModal from '../modals/CustomModal';
import InfluencerTable from '../tables/InfluencerTable';
import CustomButton from './CustomButton';
import { triggerToast } from './CustomToast';

const accountIcons: Record<string, JSX.Element> = {
  instagram: <BiLogoInstagram size={40} color="#CD1B78" />,
  facebook: <FaFacebook size={40} color="#CD1B78" />,
  tikTok: <BiLogoTiktok size={40} color="#CD1B78" />,
  linkedIn: <FaLinkedinIn size={40} color="#CD1B78" />,
  twitter: <FaXTwitter size={40} color="#CD1B78" />,
  x: <FaXTwitter size={40} color="#CD1B78" />,
};

const InfluencerProfiles = () => {
  const { userDetails, subscriptionPlanType } = useAuth();

  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: ACCOUNT_TOUR_STEPS,
    tourKey: 'hasSeenAccountTour',
  });

  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLimitInitialState = useFeatureLimitStore((state) => state.isInitialState);

  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerDto | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [selectedAccounts, setSelectedAccounts] = useState<InfluencerDto[]>([]);

  const {
    connectModalOpen,
    disconnectModalOpen,
    setConnectModalOpen,
    setDisconnectModalOpen,
    getFacebookUrl,
    gettingUrl,
    getTiktokUrl,
    gettingTiktokUrl,
    unbindAccount,
    unbindingAccount,
    getTwitterUrl,
    getLinkedInUrl,
    connectingAccount,
  } = useInfluencersTrackingOverview();

  // State for managing the filters and pagination
  const [filters, setFilters] = useState({
    platforms: [], // Array of platforms for API call
    name: '',
    email: '',
    location: '',
    skip: 0, // Page number
    limit: 5, // Number of items per page
  });

  const { data: influencersResponse, isLoading } = useGetInfluencersByFilters({
    user_id: userDetails?.userId,
    skip: filters.skip,
    limit: filters.limit,
    ...(typeof isAuthenticated === 'boolean' ? { connected: isAuthenticated } : {}),
  });

  const [influencers, setInfluencers] = useState<InfluencerDto[]>([]);

  // Use effect to load the influencers fetched from the API
  useEffect(() => {
    if (influencersResponse?.data) {
      // Replace the entire influencers state with the fetched data on initial load
      setInfluencers(influencersResponse?.data);
    }
  }, [influencersResponse]);

  const total = influencersResponse?.total ?? 0;

  const totalPages = Math.ceil(total / 5);

  // Handle pagination change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      skip: (value - 1) * filters.limit,
    }));
  };

  const isMobile = useMediaQuery('(max-width:800px)');

  const handleAddSubmit = (data: any) => {
    setInfluencers((prev) => [...prev, data]);
    setOpenAccountModal(false);
  };

  const handleEditInfluencer = (influencer: InfluencerDto) => {
    setSelectedInfluencer(influencer); // Set the influencer to edit
    setOpenAccountModal(true); // Open modal for editing
  };

  // Handle toggling between authenticated and unauthenticated accounts
  const handleToggle = () => {
    setIsAuthenticated((prevState) => !prevState);

    setInfluencers((prev) => {
      if (!isAuthenticated) {
        return influencersResponse?.data.filter((item: any) => item.token) ?? []; //
      }
      return influencersResponse?.data ?? [];
    });
  };

  // Handle selecting accounts for comparison, max 2 accounts
  const handleSelect = (influencer: InfluencerDto) => {
    setSelectedAccounts((prev) => {
      if (prev.includes(influencer)) {
        return prev.filter((item) => item !== influencer);
      } else if (prev.length >= 2) {
        triggerToast('error', 'You can only select two accounts for comparison');
        return prev;
      }

      return [...prev, influencer];
    });
  };

  const authenticateAccount = (influencer: InfluencerDto) => {
    setSelectedInfluencer(influencer);
    setConnectModalOpen(true);
  };

  const unAuthenticatedAccount = (influencer: InfluencerDto) => {
    setSelectedInfluencer(influencer);
    setDisconnectModalOpen(true);
  };

  const platform = selectedInfluencer ? selectedInfluencer.social_platform : '';
  const username = selectedInfluencer ? selectedInfluencer.social_username : '';

  const closeConnectModal = () => {
    setConnectModalOpen(false);
    setSelectedInfluencer(undefined);
  };

  const closeUnBindModal = () => {
    setDisconnectModalOpen(false);
    setSelectedInfluencer(undefined);
  };

  return (
    <>
      {connectingAccount && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 10,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <SkeletonLoader background="rgba(0,0,0,0.4)" />
        </Box>
      )}
      <Box px={3} pb={3} bgcolor="#f8f8f8">
        <GuideTour steps={steps} run={run} onFinish={handleTourFinish} onSkip={handleTourFinish} />

        <FeaturesHeader
          startTour={startTour}
          title=" Social Accounts"
          titleIcon={<ChartLine style={{ color: '#fff', width: 20, height: 20 }} />}
          hasBtn
          btnText="Add Accounts"
          tooltipText={isFeatureDisabled(featureLimit, 'accountTracking') ? 'Limit exceeded! Upgrade to add more keyword trackers' : ''}
          btnProps={{
            startIcon: <AddIcon />,
            style: {
              flexBasis: isMobile ? '100%' : 'auto',
            },
            className: 'tour-account-new-btn',
            disabled: isFeatureDisabled(featureLimit, 'accountTracking'),
          }}
          onBtnClick={() => {
            {
              setOpenAccountModal(true);

              setSelectedInfluencer(undefined); // Set to undefined when adding a new account
            }
          }}
          wrapperStyle={{
            marginBottom: 2,
          }}
        />

        {/* Summary Cards */}
        <Grid container spacing={4} mb={4}>
          <Grid item md={4} xs={12} className="tour-account-total">
            <SummaryCard count={total} label="Total Accounts" />
          </Grid>
          <Grid item md={4} xs={12} className="tour-account-authenticated-total">
            <SummaryCard count={influencersResponse?.metaData?.totalConnected ?? 0} label="Authenticated Accounts" />
          </Grid>
          <Grid item md={4} xs={12} className="tour-account-unauthenticated-total">
            <SummaryCard count={influencersResponse?.metaData?.totalDisconnected ?? 0} label="Unauthenticated Accounts" />
          </Grid>
        </Grid>

        {/* Search & Filter Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={2}
          flexDirection={isMobile ? 'column' : 'row'}
          mb={2}
          sx={{
            boxShadow: '-1px -1px 6px 4px #0000000D;',
            bgcolor: '#fff',
            borderRadius: 2,
            p: 2,
          }}
        >
          {!isLimitInitialState && (
            <Box flex={0.5}>
              <TrackLimit
                type="snackbar"
                planName={TextHelper.removeChar(subscriptionPlanType ?? '', '_')}
                planLimit={featureLimit.accountTracking.accounts.limit}
                currentUsage={featureLimit.accountTracking.accounts.count}
                description={`This plan allows you to track ${featureLimit.accountTracking.accounts.limit} social accounts.`}
              />
            </Box>
          )}

          <Box display="flex" justifyContent={{ xs: 'space-between', md: 'flex-end' }} marginLeft={{ auto: 'auto', xs: 0 }} gap={2} flex={1}>
            <Box display="flex" className="tour-account-onOff-btn">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel control={<Switch checked={isAuthenticated} onChange={handleToggle} color="primary" size="medium" />} label={'Authenticated'} />
              </div>
            </Box>

            {/* Reset Button */}
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => {
                setIsAuthenticated(undefined);
              }}
              sx={{
                height: 'auto',
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>

        {/* Accounts Table */}
        <InfluencerTable
          accounts={influencers}
          onEdit={handleEditInfluencer}
          authenticateAccount={authenticateAccount}
          unAuthenticatedAccount={unAuthenticatedAccount}
          isLoading={isLoading}
          onCreate={() => {
            setOpenAccountModal(true);
            setSelectedInfluencer(undefined); // Set to undefined when adding a new account
          }}
          handleSelect={handleSelect}
          selectedAccounts={selectedAccounts}
        />

        {/* Pagination */}
        {influencers.length > 0 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages} // Total number of pages
              page={Math.ceil(filters.skip / filters.limit) + 1} // Calculate the current page
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>

      {/* Add or Edit Modal */}
      <AddInfluencerAccountModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
        onSubmit={handleAddSubmit}
        initialData={selectedInfluencer} // Pass data for edit mode
        authenticateFaceBook={() => {
          getFacebookUrl();
        }}
        gettingUrl={gettingUrl || gettingTiktokUrl}
        authenticateX={() => {
          getTwitterUrl();
        }}
        authenticateLinkedIn={() => {
          getLinkedInUrl();
        }}
      />

      {/* Connect account Modal */}
      <CustomModal open={connectModalOpen} setOpen={setConnectModalOpen} bgColor="#fff" maxWidth="500px" closeOnOverlayClick>
        <Box display="flex" flexDirection="column" gap={2} p={3} position={'relative'}>
          <BiX
            size={24}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              cursor: 'pointer',
            }}
            onClick={closeConnectModal}
          />
          <Box sx={{ mx: 'auto' }}>{accountIcons[platform?.toLowerCase() ?? '']}</Box>
          <Typography variant="h6" fontWeight="bold" sx={{ textAlign: 'center' }}>
            Bind {TextHelper.capitalize(platform ?? '')} Account
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center' }} fontSize={'1rem'}>
            Are you sure you want to connect your {TextHelper.capitalize(platform ?? '')} account? You will be able to track social insights.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomButton
              mode="primary"
              onClick={() =>
                platform?.toLowerCase() === 'facebook' || platform?.toLowerCase() === 'instagram'
                  ? getFacebookUrl()
                  : getTiktokUrl({
                      influencerId: selectedInfluencer?.influencer_id ?? '',
                      influencerName: username ?? '',
                    })
              }
              loading={gettingUrl || gettingTiktokUrl}
            >
              Bind Account
            </CustomButton>
            <CustomButton mode="inverse" onClick={closeConnectModal}>
              Cancel
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>

      {/* Disconnect account Modal */}
      <CustomModal open={disconnectModalOpen} setOpen={setDisconnectModalOpen} bgColor="#fff" maxWidth="500px" closeOnOverlayClick>
        <Box display="flex" flexDirection="column" gap={2} p={3} position={'relative'}>
          <BiX
            size={24}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              cursor: 'pointer',
            }}
            onClick={closeUnBindModal}
          />
          <Box sx={{ mx: 'auto' }}>{accountIcons[platform?.toLowerCase() ?? '']}</Box>
          <Typography variant="h6" fontWeight="bold" sx={{ textAlign: 'center' }}>
            Unbind {TextHelper.capitalize(platform ?? '')} Account
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center' }} fontSize={'1rem'}>
            Are you sure you want to disconnect your {TextHelper.capitalize(platform ?? '')} account? You will no longer be able to track social insights, and all linked insights will be deleted.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomButton mode="primary" onClick={() => selectedInfluencer && unbindAccount(selectedInfluencer)} loading={unbindingAccount}>
              Unbind Account
            </CustomButton>
            <CustomButton mode="inverse" onClick={closeUnBindModal}>
              Cancel
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default InfluencerProfiles;
