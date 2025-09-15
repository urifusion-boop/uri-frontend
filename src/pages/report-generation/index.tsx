import { Box, Button, CircularProgress, Grid, InputAdornment, MenuItem, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material';

import DashboardLayout from '@/components/atoms/DashboardLayout';
import DateFilter from '@/components/atoms/DateFilter';
import FeatureLimitLock from '@/components/atoms/FeatureLimitLock';
import HorizontalSlider from '@/components/atoms/HorizontalSlider';
import SeoHead from '@/components/atoms/SeoHead';
import SwitchBox from '@/components/atoms/SwitchBox';
import GuideTour from '@/components/guide-tour/guide-tour';
import { REPORT_TOUR_STEPS } from '@/components/guide-tour/tour-steps/report-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import FeaturesHeader from '@/components/headers/FeaturesHeader';
import MultiSelectDropdown from '@/components/input/MultiSelectDropdown';
import BaseExportModal from '@/components/modals/BaseExportModal';
import FeatureCard from '@/components/settings/FeatureCard';
import TitleCard from '@/components/settings/TitleCard';
import { isFeatureDisabled } from '@/configs/rules.config';
import { reportGenerationData } from '@/data/sentimentOverTimeData';
import { TextHelper } from '@/helpers/TextHelper';
import useFeatureOptions from '@/hooks/report-generation/featuresOptions.hook';
import { useReportGeneration } from '@/hooks/report-generation/generateReports.hook';
import { TrackerTypeEnum } from '@/models/enum-models/TrackerTypeEnum';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import AlertOnFilled from '@/utils/icon/AlertOnFilled';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { AxiosError } from 'axios';
import React from 'react';
import { IconType } from 'react-icons';
import { FaCircleExclamation } from 'react-icons/fa6';
import { GoChecklist } from 'react-icons/go';
import { HiHashtag } from 'react-icons/hi2';
import { IoPerson } from 'react-icons/io5';
import { MdRecordVoiceOver } from 'react-icons/md';

const FEATURES: { title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | IconType; name: string; disabled: boolean }[] = [
  {
    title: 'Account Tracking',
    description: 'Get updates on account changes',
    icon: ChartLine,
    name: 'account',
    disabled: false,
  },
  {
    title: 'Hashtag Tracking',
    description: 'See performance reports on hashtags.',
    icon: HiHashtag,
    name: 'hashtag',
    disabled: false,
  },
  {
    title: 'Keyword Tracking',
    description: 'Get notified on relevant trends and mentions',
    icon: HeartRateSearch,
    name: 'keyword',
    disabled: true,
  },
  {
    title: 'Lead Tracking',
    description: 'Stay informed on potential leads and interactions.',
    icon: MdRecordVoiceOver,
    name: 'lead',
    disabled: true,
  },
  {
    title: 'Alert',
    description: 'Receive important updates and critical notifications',
    icon: AlertOnFilled,
    name: 'alert',
    disabled: true,
  },
];

const ReportGeneration = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { steps, startTour, run, handleTourFinish } = useGuideTour({
    steps: REPORT_TOUR_STEPS,
    initialRun: true,
    tourKey: 'hasSeenReportTour',
  });

  const {
    reportData,
    setReportData,
    selectedFeature,
    setSelectedFeature,
    handleIncludedData,
    generateReport,
    setIsSuccessModal,
    isSuccessModal,
    isGeneratingReport,
    reportGenerationError,
    isErrorModal,
    setIsErrorModal,
    isBtnDisabled,
    btnTooltipText,
  } = useReportGeneration();

  const { data, isLoading } = useFeatureOptions(selectedFeature);

  return (
    <>
      <SeoHead title="Report Generation" />
      <DashboardLayout excludeHeader>
        <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />
        <Box
          sx={{
            pb: '40px',
            px: 3,
            backgroundColor: 'white',
          }}
        >
          {/* Header */}
          <FeaturesHeader startTour={startTour} title="Report Generation" titleIcon={<GoChecklist size={20} color="#fff" />} />
          {/* main area */}
          {!isFeatureDisabled(featureLimit, 'reportGeneration') ? (
            <Box
              sx={{
                boxShadow: '-1px -1px 4px 3px #0000000D',
                width: '100%',
                margin: 'auto',
                borderRadius: '12px',
                backgroundColor: '#fff',
                py: '40px',
                mt: '50px',
              }}
            >
              <Box
                sx={{
                  maxWidth: '1197px',
                  width: '100%',
                  margin: 'auto',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#484848',
                    maxWidth: { xs: '100%', md: '900px', lg: '1140px' },
                    fontSize: { xs: '18px', sm: '24x' },
                    fontWeight: 300,
                    px: { xs: '20px', md: '32px' },
                  }}
                >
                  The PDF report allows you to export tons of data about your projects into a neat, clean, and brand-able PDF document. You’re just a few clicks away!
                </Typography>

                {/* Features Slider */}
                <Box
                  sx={{
                    mt: '40px',
                    px: {
                      xs: '20px',
                      md: '32px',
                    },
                  }}
                  className="tour-report-features"
                >
                  <HorizontalSlider gap="gap-6" variant="square">
                    {FEATURES.map((feature) => {
                      return (
                        <FeatureCard
                          key={feature.name}
                          width="255px"
                          {...feature}
                          isDisabled={feature.disabled}
                          checked={selectedFeature === feature.name}
                          // TODO: add onClick to all features when backend supports them all
                          description={feature.disabled ? 'Coming Soon...' : feature.description}
                          onSelect={() => (feature.disabled ? null : setSelectedFeature(feature.name))}
                        />
                      );
                    })}
                  </HorizontalSlider>
                </Box>

                {/* Recipient and Frequency */}
                <Box
                  sx={{
                    mt: '40px',
                    px: {
                      xs: '20px',
                      md: '32px',
                    },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                  }}
                >
                  {/* Email */}
                  <Box
                    sx={{
                      maxWidth: '447px',
                      width: '100%',
                    }}
                  >
                    <TitleCard title="Select recipient:" icon={IoPerson} />
                    <TextField
                      id="outlined-basic"
                      placeholder="example@email.com"
                      variant="outlined"
                      fullWidth
                      type="email"
                      value={reportData.recipient}
                      onChange={(e) => setReportData({ ...reportData, recipient: e.target.value })}
                      InputProps={{
                        sx: {
                          height: 48,
                          borderRadius: '8px',
                          mt: '8px',
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box
                              component="button"
                              sx={{
                                color: '#CD1B78F2',
                                fontSize: '14px',
                                fontWeight: 300,
                              }}
                              onClick={() => {
                                setReportData({
                                  ...reportData,
                                  recipient: '',
                                });
                              }}
                            >
                              Change
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    borderTop: '1px solid #CBCBCB99',
                    pt: '40px',
                    mt: '40px',
                    px: {
                      xs: '20px',
                      md: '32px',
                    },
                  }}
                >
                  {/* Account/Keyword/Hashtag */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', md: 'center' },
                      pb: '40px',
                      gap: 4,
                      flexDirection: { xs: 'column', md: 'row' },
                    }}
                  >
                    {/* Email */}
                    {Object.values(TrackerTypeEnum)
                      .map((type) => type.toLowerCase())
                      .includes(selectedFeature) && (
                      <Box
                        sx={{
                          maxWidth: '437px',
                          width: '100%',
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#444',
                            fontSize: '24px',
                            fontWeight: 600,
                            mb: 1.5,
                          }}
                        >
                          Choose {TextHelper.capitalize(selectedFeature)}
                        </Typography>

                        {isLoading ? (
                          <MenuItem disabled>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <CircularProgress size={20} />
                              <Typography>Loading...</Typography>
                            </Box>
                          </MenuItem>
                        ) : (
                          <MultiSelectDropdown
                            options={
                              data?.map((item: any) => ({
                                value: item.id ?? '',
                                label: item.name ?? '',
                              })) ?? []
                            }
                            selectedValues={
                              data
                                ?.filter((item: any) => reportData.reportIds?.includes(item.id))
                                ?.map((item: any) => ({
                                  value: item.id ?? '',
                                  label: item.name ?? '',
                                })) ?? []
                            }
                            onChange={(newValues) => {
                              // For account tracking, we need to store the full influencer data with platform info
                              if (selectedFeature === 'account') {
                                const influencerData = data?.filter((item: any) => newValues?.some((selected) => selected.value === item.id)) ?? [];

                                setReportData({
                                  ...reportData,
                                  reportIds: newValues?.map((item) => item.value) ?? [],
                                  reportType: newValues?.map((item) => item.label?.split(' - ')[1]) ?? [],
                                  influencerData: influencerData, // Store full influencer data
                                });
                              } else {
                                setReportData({
                                  ...reportData,
                                  reportIds: newValues?.map((item) => item.value) ?? [],
                                  reportType: newValues?.map((item) => item.label?.split(' - ')[1]) ?? [],
                                });
                              }
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <Box
                      sx={{
                        maxWidth: '447px',
                        width: '100%',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#444',
                          fontSize: '24px',
                          fontWeight: 600,
                        }}
                      >
                        Choose Duration
                      </Typography>
                      <Box sx={{ marginTop: '8px' }}>
                        <DateFilter
                          wrapperStyle={{
                            maxWidth: '447px',
                          }}
                          selectedDate={reportData.period ?? null}
                          setSelectedDate={(value) => {
                            setReportData({
                              ...reportData,
                              period: value,
                            });
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <FeatureContainer
                    dataOptions={reportGenerationData[selectedFeature as keyof typeof reportGenerationData]}
                    includeData={reportData[selectedFeature] ?? []}
                    setIncludeData={handleIncludedData}
                  />

                  {/* Button */}
                  {isMobile && isBtnDisabled && <Typography sx={{ color: 'red' }}>{btnTooltipText}</Typography>}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Tooltip title={btnTooltipText} placement="top" arrow>
                      <Button
                        className="tour-report-generate-btn"
                        sx={{
                          opacity: isBtnDisabled ? 0.5 : 1,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (isBtnDisabled) return;
                          generateReport();
                        }}
                      >
                        Generate Report
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <FeatureLimitLock />
          )}
        </Box>
      </DashboardLayout>

      {/* TODO: merge all three states into 1 component */}
      {/* Success Modal */}
      <BaseExportModal
        title="Report Generated"
        open={isSuccessModal}
        onClose={() => setIsSuccessModal(false)}
        imageSrc="/assets/images/success.png"
        imageSx={{ width: '100px', height: '100px' }}
        description={`Your report has been generated and sent to ${reportData.recipient}`}
        descriptionSx={{ fontWeight: 700, color: '#333' }}
        primaryBtnText="Done"
        onPrimaryClick={() => setIsSuccessModal(false)}
      />
      {/* Loading Modal */}
      <BaseExportModal
        title="Generating Report"
        imageSrc="/assets/images/loader.gif"
        open={isGeneratingReport}
        onClose={() => setIsSuccessModal(false)}
        description={`Generating your report...`}
        descriptionSx={{ fontWeight: 700, color: '#333' }}
      />
      {/* Error Modal */}
      <BaseExportModal
        title="We encountered an error"
        icon={FaCircleExclamation}
        open={isErrorModal}
        onClose={() => setIsErrorModal(false)}
        onPrimaryClick={() => setIsErrorModal(false)}
        primaryBtnText="Close"
        description={(reportGenerationError as AxiosError)?.message || 'An error occurred while generating the report. Please try again.'}
        descriptionSx={{ fontWeight: 700, color: '#333' }}
      />
    </>
  );
};

export default ReportGeneration;

interface IFeatureContainerProps {
  dataOptions: {
    title: string;
    icon: IconType;
  }[];
  includeData: string[];
  setIncludeData: (title: string) => void;
}

const FeatureContainer = React.memo(({ dataOptions, includeData, setIncludeData }: IFeatureContainerProps) => {
  return (
    <Box>
      <Typography sx={{ color: '#444444', fontSize: '20px', fontWeight: 600, mb: 2 }}>Include Data</Typography>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 10 }}>
        {dataOptions.map((item, index) => (
          <Grid item xs={12} md={6} key={item.title + index}>
            <SwitchBox
              title={item.title}
              icon={item.icon}
              checked={includeData.includes(item.title)}
              onChange={() => setIncludeData(item.title)}
              wrapperStyle={{
                marginLeft: { xs: 0, md: index % 2 === 0 ? 0 : 'auto' },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

FeatureContainer.displayName = 'FeatureContainer';
