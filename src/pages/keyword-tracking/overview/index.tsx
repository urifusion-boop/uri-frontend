import { isFeatureDisabled, isFeatureLocked, isFeatureUnlimited } from '@/configs/rules.config';
import { Autocomplete, Box, Button, Dialog, Grid, InputLabel, MenuItem, Modal, Pagination, Select, Stack, TextField, Typography } from '@mui/material';
import { BiPlus, BiX } from 'react-icons/bi';

import CustomButton from '@/components/atoms/CustomButton';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import FeatureLimitLock from '@/components/atoms/FeatureLimitLock';
import InputField from '@/components/atoms/Input';
import SeoHead from '@/components/atoms/SeoHead';
import SummaryCard from '@/components/cards/SummaryCard';
import GuideTour from '@/components/guide-tour/guide-tour';
import { KEYWORD_TOUR_STEPS } from '@/components/guide-tour/tour-steps/keyword-tour';
import { useModuleTour } from '@/hooks/useModuleTour.hook';
import FeaturesHeader from '@/components/headers/FeaturesHeader';
import Spinner from '@/components/loaders/Spinner';
import KeywordTrackerTable from '@/components/tables/KeywordTable';
import TrackLimit from '@/components/trackers/TrackLimit';
import { countries } from '@/data/countries';
import { TextHelper } from '@/helpers/TextHelper';
import { useKeywordTracking } from '@/hooks/keyword-tracking/keywordTracking.hook';
import useResponsiveness from '@/hooks/useResponsiveness';
import { TrackerDto } from '@/models/dtos/TrackerDto';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';

const KeywordTrackingOverview = () => {
  const { isMobile } = useResponsiveness();
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLimitInitialState = useFeatureLimitStore((state) => state.isInitialState);
  const { subscriptionPlanType } = useAuth();

  const { run, startTour, steps, handleTourFinish } = useModuleTour({
    moduleId: 'keyword-tracking',
    steps: KEYWORD_TOUR_STEPS,
  });

  const {
    keywordTrackers,
    isLoadingKeywordTracker,
    selectedTracker,
    setSelectedTracker,
    createTracker,
    isCreatingTracker,
    updateTracker,
    updatingTracker,
    openModal,
    setOpenModal,
    selectedCountries,
    setSelectedCountries,
    disabledBtn,
    deleteTracker,
    isDeleting,
    setIsModalDeleteOpen,
    isModalDeleteOpen,
    page,
    setPage,
  } = useKeywordTracking();

  const confirmDeleteTracker = (selectedTracker: TrackerDto) => {
    setIsModalDeleteOpen(true);
    setSelectedTracker({
      tracker: selectedTracker,
      action: 'delete',
    });
  };

  const [date] = useState({
    label: 'Last 90 days Feeds',
    date: 'd90',
  });

  const filterOptions = [
    {
      label: "Today's Feeds",
      value: 'd1',
    },
    {
      label: 'Last 7 days Feeds',
      value: 'd7',
    },
    {
      label: 'Last 30 days Feeds',
      value: 'd30',
    },
    {
      label: 'Last 90 days Feeds',
      value: 'd90',
    },
    {
      label: 'Last 2 weeks Feeds',
      value: 'w2',
    },
    {
      label: 'Last 3 weeks Feeds',
      value: 'w3',
    },
    {
      label: 'Last 4 weeks Feeds',
      value: 'w4',
    },
    {
      label: 'Last 6 weeks Feeds',
      value: 'w6',
    },
    {
      label: 'Last 8 weeks Feeds',
      value: 'w8',
    },
    {
      label: 'Last 12 weeks Feeds',
      value: 'w12',
    },
    {
      label: 'Last 6 months Feeds',
      value: 'm6',
    },
    {
      label: 'Last 12 months Feeds',
      value: 'm12',
    },
  ];

  const alertOptions = [
    {
      label: 'Yes',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];

  return (
    <>
      <SeoHead title="Keyword Tracking Overview" />
      <DashboardLayout bgColor="#f8f8f8" excludeHeader={true}>
        <GuideTour steps={steps} run={run} onFinish={handleTourFinish} onSkip={handleTourFinish} />

        {!isFeatureLocked(featureLimit, 'keyword') ? (
          <Box px={3} pb={3} bgcolor="#f8f8f8">
            {/* Header section */}
            <FeaturesHeader
              startTour={startTour}
              title="Keyword Trackers"
              titleIcon={<HeartRateSearch style={{ color: '#fff', width: 20, height: 20 }} />}
              hasBtn
              btnText="Add Keyword"
              tooltipText={isFeatureDisabled(featureLimit, 'keyword') ? 'Limit exceeded! Upgrade to add more keywords' : ''}
              btnProps={{
                startIcon: <AddIcon />,
                style: {
                  flexBasis: isMobile ? '100%' : 'auto',
                },
                className: 'tour-keyword-new-btn',
                disabled: isFeatureDisabled(featureLimit, 'keyword'),
              }}
              onBtnClick={() => {
                setOpenModal(true);
                setSelectedTracker({
                  tracker: {
                    name: '',
                    keywords: [],
                    excluded: [],
                    platforms: ['linkedIn', 'facebook', 'twitter', 'instagram', 'youtube', 'web'],
                    locations: [],
                    filter_duration: date.date,
                  },
                  action: 'create',
                });
              }}
              wrapperStyle={{
                marginBottom: 2,
              }}
            />

            <Grid container spacing={4} mb={4}>
              <Grid item md={4} xs={12} className="tour-keyword-total">
                <SummaryCard count={keywordTrackers?.total ?? 0} label="Total Trackers" />
              </Grid>
              {!isLimitInitialState && (
                <Grid item md={8} xs={12} className="tour-keyword-limit">
                  <TrackLimit
                    planName={TextHelper.removeChar(subscriptionPlanType ?? '', '_')}
                    planLimit={featureLimit.keyword.limit}
                    currentUsage={featureLimit.keyword.count ?? 0}
                    description={`This plan allows you to track ${isFeatureUnlimited(featureLimit.keyword.limit) ? 'unlimited' : featureLimit.keyword.limit} keywords.`}
                  />
                </Grid>
              )}
            </Grid>

            <KeywordTrackerTable
              data={keywordTrackers?.data ?? []}
              isLoading={isLoadingKeywordTracker}
              deleteTracker={confirmDeleteTracker}
              setSelectedTracker={(tracker) => {
                setSelectedTracker({
                  tracker,
                  action: 'update',
                });
                setSelectedCountries(
                  tracker?.locations?.map((country) => {
                    return {
                      code: country,
                      label: countries.find((c) => c.code === country)?.label ?? '',
                    };
                  }) ?? []
                );
                setOpenModal(true);
              }}
            />

            {keywordTrackers && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Pagination
                  count={keywordTrackers?.total ? Math.ceil(keywordTrackers.total / 10) : 1}
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
      {/* New Tracker Modal */}
      <Dialog open={openModal} maxWidth="md" fullWidth onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'relative', p: 2 }}>
          {/* Header */}
          <Box
            sx={{
              borderBottom: '1px solid #d5d5d5',
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box />
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.2rem',
                textAlign: 'center',
                color: '#141416',
              }}
              fontWeight={600}
            >
              {selectedTracker?.action === 'create' ? 'Create New Tracker' : 'Update Tracker'}
            </Typography>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setOpenModal(false);
                setSelectedTracker(null);
              }}
            >
              <BiX size={28} color="#141416" />
            </Box>
          </Box>

          {/* Tracker Name */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: '1rem',
                color: '#141416',
              }}
            >
              Tracker name*
            </Typography>
            <Box maxWidth={'400px'}>
              <InputField
                placeholder="Enter Tracker name"
                type="text"
                value={selectedTracker?.tracker?.name ?? ''}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedTracker({
                    ...selectedTracker,
                    tracker: {
                      ...selectedTracker?.tracker,
                      name: selectedTracker?.tracker?.name?.trim().length === 0 ? value.trim() : value,
                    },
                  });
                }}
                noBg
              />
            </Box>
          </Box>

          {/* Keywords */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: '1rem',
                color: '#141416',
              }}
            >
              I&apos;m looking for post that includes:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {selectedTracker?.tracker?.keywords?.map((word, i) => (
                <InputField
                  key={i}
                  placeholder="Enter keyword."
                  type="text"
                  value={word}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(/\s+/g, '');
                    setSelectedTracker({
                      ...selectedTracker,
                      tracker: {
                        ...selectedTracker?.tracker,
                        keywords: selectedTracker?.tracker?.keywords?.map((key, index) => {
                          if (index === i) return trimmedValue;
                          else return key;
                        }),
                      },
                    });
                  }}
                  noBg
                  rightIcon={selectedTracker?.tracker?.keywords && selectedTracker?.tracker?.keywords.length > 1}
                  icon={
                    <BiX
                      color="#141416"
                      onClick={() => {
                        if (selectedTracker?.tracker?.keywords && selectedTracker?.tracker?.keywords.length > 1) {
                          setSelectedTracker({
                            ...selectedTracker,
                            tracker: {
                              ...selectedTracker?.tracker,
                              keywords: selectedTracker?.tracker?.keywords.filter((key) => key !== word),
                            },
                          });
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  }
                />
              ))}
              <Box
                p={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  const newKeywords = selectedTracker?.tracker?.keywords ? selectedTracker?.tracker?.keywords.concat('') : [''];
                  setSelectedTracker({
                    ...selectedTracker,
                    tracker: {
                      ...selectedTracker?.tracker,
                      keywords: newKeywords,
                    },
                  });
                }}
              >
                <BiPlus />
              </Box>
            </Box>
          </Box>

          {/* Excluded Keywords */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 1.2,
                fontSize: '1rem',
                color: '#141416',
              }}
            >
              I don&apos;t want to see:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {selectedTracker?.tracker?.excluded?.map((word, i) => (
                <InputField
                  key={i}
                  placeholder="Enter excluded keyword."
                  type="text"
                  value={word}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(/\s+/g, '');

                    setSelectedTracker({
                      ...selectedTracker,
                      tracker: {
                        ...selectedTracker?.tracker,
                        excluded: selectedTracker?.tracker?.excluded?.map((key, index) => {
                          if (index === i) return trimmedValue;
                          else return key;
                        }),
                      },
                    });
                  }}
                  noBg
                  rightIcon
                  icon={
                    <BiX
                      color="#141416"
                      onClick={() =>
                        setSelectedTracker({
                          ...selectedTracker,
                          tracker: {
                            ...selectedTracker?.tracker,
                            excluded: selectedTracker?.tracker?.excluded?.filter((key) => key !== word),
                          },
                        })
                      }
                      style={{ cursor: 'pointer' }}
                    />
                  }
                />
              ))}
              <Box
                p={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  const newKeywords = selectedTracker?.tracker?.excluded ? selectedTracker?.tracker?.excluded.concat('') : [''];
                  setSelectedTracker({
                    ...selectedTracker,
                    tracker: {
                      ...selectedTracker?.tracker,
                      excluded: newKeywords,
                    },
                  });
                }}
              >
                <BiPlus />
              </Box>
            </Box>
          </Box>

          {/* Location Filter */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                mb: 2.5,
                fontSize: '1rem',
                color: '#141416',
              }}
            >
              Choose countries to filter:
            </Typography>
            <Autocomplete
              id="country-select-demo"
              multiple
              value={selectedCountries}
              sx={{ maxWidth: 300 }}
              options={countries}
              onChange={(event, newValue) => {
                setSelectedCountries(
                  newValue.map((country) => {
                    return {
                      code: country.code,
                      label: country.label,
                    };
                  })
                );

                setSelectedTracker({
                  ...selectedTracker,
                  tracker: {
                    ...selectedTracker?.tracker,
                    locations: newValue.map((country) => country.code),
                  },
                });
              }}
              autoHighlight
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => {
                return (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img loading="lazy" width="20" srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`} src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} alt="" />
                    {option.label}
                  </Box>
                );
              }}
              renderInput={(params) => <TextField {...params} placeholder={selectedCountries.length > 0 ? '' : 'Select country'} />}
            />{' '}
          </Box>

          {/* Date Filter */}
          <Box sx={{ mt: 3 }}>
            <InputLabel id="date-filter-label">Filter by Date</InputLabel>
            <Select
              labelId="date-filter-label"
              id="date-filter"
              value={selectedTracker?.tracker?.filter_duration ?? date.date}
              onChange={(e) => {
                setSelectedTracker({
                  ...selectedTracker,
                  tracker: {
                    ...selectedTracker?.tracker,
                    filter_duration: e.target.value ?? '',
                  },
                });
              }}
            >
              {filterOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Alert */}
          <Box sx={{ mt: 3 }}>
            <InputLabel id="date-filter-label">Get alerts for this tracker</InputLabel>
            <Select
              labelId="date-filter-label"
              id="date-filter"
              value={selectedTracker?.tracker?.is_alert_subscribed ?? false}
              onChange={(e) => {
                setSelectedTracker({
                  ...selectedTracker,
                  tracker: {
                    ...selectedTracker?.tracker,
                    is_alert_subscribed: e.target.value === 'true',
                  },
                });
              }}
            >
              {alertOptions?.map((option, index) => (
                <MenuItem key={index} value={option.value.toString()}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Button  */}
          <Box
            mt={3}
            sx={{
              display: 'flex',
              maxWidth: '150px',
              justifyContent: 'flex-end',
              ml: 'auto',
            }}
          >
            <CustomButton
              mode="primary"
              disabled={disabledBtn || isCreatingTracker || updatingTracker}
              loading={isCreatingTracker || updatingTracker}
              onClick={() => {
                selectedTracker?.action === 'create' ? createTracker() : updateTracker();
              }}
            >
              {selectedTracker?.action === 'create' ? 'Create' : 'Update'}
            </CustomButton>
          </Box>
        </Box>
      </Dialog>
      <Modal open={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)} aria-labelledby="delete-confirmation-modal-title" aria-describedby="delete-confirmation-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: 600,
            width: '90%',
            borderRadius: 2,
          }}
        >
          <Typography id="delete-confirmation-modal-title" variant="h6" component="h2">
            Are you sure you want to delete the tracker?
          </Typography>
          <Typography id="delete-confirmation-modal-description" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningIcon color="error" />
            This action cannot be undone.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setIsModalDeleteOpen(false);
                setSelectedTracker(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={() => deleteTracker()} disabled={isDeleting}>
              {isDeleting ? <Spinner color="#cd1b78" /> : 'Delete'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default KeywordTrackingOverview;
