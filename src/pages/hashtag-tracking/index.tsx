import { isFeatureDisabled, isFeatureLocked, isFeatureUnlimited } from '@/configs/rules.config';
import { Box, Grid, Pagination } from '@mui/material';

import DashboardLayout from '@/components/atoms/DashboardLayout';
import FeatureLimitLock from '@/components/atoms/FeatureLimitLock';
import SeoHead from '@/components/atoms/SeoHead';
import SummaryCard from '@/components/cards/SummaryCard';
import GuideTour from '@/components/guide-tour/guide-tour';
import { HASHTAG_TOUR_STEPS } from '@/components/guide-tour/tour-steps/hashtag-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import AddHashtagModal from '@/components/hashtag-tracking/AddHashtagModal';
import FeaturesHeader from '@/components/headers/FeaturesHeader';
import DeleteModal from '@/components/modals/DeleteModal';
import KeywordTrackerTable from '@/components/tables/KeywordTable';
import TrackLimit from '@/components/trackers/TrackLimit';
import { TextHelper } from '@/helpers/TextHelper';
import { useHashtagTracking } from '@/hooks/hashtag-tracking/hashtagTracking.hook';
import useResponsiveness from '@/hooks/useResponsiveness';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import AddIcon from '@mui/icons-material/Add';
import { HiHashtag } from 'react-icons/hi';

const HashtagTrackingOverview = () => {
  const { isMobile } = useResponsiveness();
  const { subscriptionPlanType } = useAuth();

  const { steps, startTour, run, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: HASHTAG_TOUR_STEPS,
    tourKey: 'hasSeenHashtagTour',
  });

  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLimitInitialState = useFeatureLimitStore((state) => state.isInitialState);
  const {
    hashtagTrackers,
    isLoadingHashtagTracker,
    selectedTracker,
    setSelectedTracker,
    createTracker,
    isCreatingTracker,
    updateTracker,
    updatingTracker,
    openModal,
    setOpenModal,
    disabledBtn,
    deleteTracker,
    isDeleting,
    setIsModalDeleteOpen,
    isModalDeleteOpen,
    page,
    setPage,
    trackerError,
  } = useHashtagTracking();

  return (
    <>
      <SeoHead title="Hashtag Tracking Overview" />
      <DashboardLayout bgColor="#f8f8f8" excludeHeader={true}>
        <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />
        {!isFeatureLocked(featureLimit, 'hashtag') ? (
          <Box px={3} pb={3} bgcolor="#f8f8f8">
            {/* Header Section */}
            <FeaturesHeader
              startTour={startTour}
              title="Hashtag Tracking"
              titleIcon={<HiHashtag color="#fff" size={20} />}
              hasBtn
              btnText="Add Hashtag"
              tooltipText={isFeatureDisabled(featureLimit, 'keyword') ? 'Limit exceeded! Upgrade to add more hashtags' : ''}
              btnProps={{
                startIcon: <AddIcon />,
                style: {
                  flexBasis: isMobile ? '100%' : 'auto',
                },
                className: 'tour-hashtag-new-btn',
                disabled: isFeatureDisabled(featureLimit, 'hashtag'),
              }}
              onBtnClick={() => {
                setOpenModal(true);
                setSelectedTracker({
                  tracker: {
                    name: '',
                    keywords: [''], // Single keyword for hashtag
                    excluded: [''],
                    platforms: ['linkedIn', 'facebook', 'twitter', 'instagram', 'youtube', 'web'],
                    locations: ['web'],
                    filter_duration: 'd90', // Default duration
                  },
                  action: 'create',
                });
              }}
              wrapperStyle={{
                marginBottom: 2,
              }}
            />
            {/* Summary Section */}
            <Grid container spacing={4} mb={4}>
              <Grid item md={4} xs={12} className="tour-hashtag-total">
                <SummaryCard count={hashtagTrackers?.total ?? 0} label="Total Hashtags" />
              </Grid>
              {!isLimitInitialState && (
                <Grid item md={8} xs={12} className="tour-keyword-limit">
                  <TrackLimit
                    planName={TextHelper.removeChar(subscriptionPlanType ?? '', '_')}
                    planLimit={featureLimit.hashtag.limit}
                    currentUsage={featureLimit.hashtag.count}
                    description={`This plan allows you to track ${isFeatureUnlimited(featureLimit.hashtag.limit) ? 'unlimited' : featureLimit.keyword.limit} hashtags.`}
                  />
                </Grid>
              )}
            </Grid>

            {/* Table Section */}
            <KeywordTrackerTable
              data={hashtagTrackers?.data ?? []}
              isLoading={isLoadingHashtagTracker}
              error={trackerError}
              deleteTracker={(tracker) => {
                setIsModalDeleteOpen(true);
                setSelectedTracker({
                  tracker,
                  action: 'delete',
                });
              }}
              setSelectedTracker={(tracker) => {
                setSelectedTracker({
                  tracker,
                  action: 'update',
                });
                setOpenModal(true);
              }}
              trackerType="hashtag" // Pass "hashtag" as tracker type
              visibleColumns={[
                'Tracker Name',
                'Keywords', // Will map to "Hashtag" dynamically
                'Actions',
              ]}
              customHeaders={{
                Keywords: 'Hashtag', // Rename column to "Hashtag"
              }}
            />

            {/* Pagination */}
            {hashtagTrackers && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Pagination
                  count={hashtagTrackers?.total ? Math.ceil(hashtagTrackers.total / 10) : 1}
                  shape="rounded"
                  color="primary"
                  size="small"
                  page={page}
                  siblingCount={0}
                  boundaryCount={1}
                  onChange={(e, page) => setPage(page)}
                />
              </Box>
            )}
          </Box>
        ) : (
          <FeatureLimitLock />
        )}
      </DashboardLayout>

      {/* Modal Section */}
      <AddHashtagModal
        openModal={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedTracker(null);
        }}
        inputValue={selectedTracker?.tracker?.keywords?.[0] ?? ''}
        onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const trimmedValue = e.target.value.replace(/\s+/g, '').replace(/#/g, '');

          setSelectedTracker({
            ...selectedTracker,
            tracker: {
              ...selectedTracker?.tracker,
              keywords: [trimmedValue],
              name: trimmedValue,
            },
          });
        }}
        onClearInput={() => {
          setSelectedTracker({
            ...selectedTracker,
            tracker: {
              ...selectedTracker?.tracker,
              keywords: [''],
            },
          });
        }}
        isBtnDisabled={disabledBtn || isCreatingTracker || updatingTracker}
        isLoading={isCreatingTracker || updatingTracker}
        onSubmit={() => {
          selectedTracker?.action === 'create' ? createTracker() : updateTracker();
        }}
        btnText={selectedTracker?.action === 'create' ? 'Start Tracking' : 'Update Tracker'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={isModalDeleteOpen}
        handleClose={() => {
          setIsModalDeleteOpen(false);
          setSelectedTracker(null);
        }}
        handleDelete={() => deleteTracker()}
        message="Are you sure you want to delete this hashtag?"
        isLoading={isDeleting}
      />
    </>
  );
};

export default HashtagTrackingOverview;
