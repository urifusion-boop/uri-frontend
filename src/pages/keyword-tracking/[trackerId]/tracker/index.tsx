import { Box, Grid, Typography } from '@mui/material';

import CustomTabs from '@/components/atoms/CustomTabs';
import LockedContent from '@/components/atoms/LockedContent';
import SeoHead from '@/components/atoms/SeoHead';
import { KeywordSentiments } from '@/components/atoms/keyword_tracking/KeywordSentiments';
import MetricsCards from '@/components/charts/MetricsCards';
import AllInsightTab from '@/components/keyword-tracking/AllInsightTab';
import FeedTab from '@/components/keyword-tracking/Feeds';
import ChartLoader from '@/components/loaders/ChartLoader';
import { LightThemeColors } from '@/configs/colors.config';
import { TextHelper } from '@/helpers/TextHelper';
import useResponsiveness from '@/hooks/useResponsiveness';
import { KeywordTrackerSentimentsDto } from '@/models/dtos/TrackerDto';
import TotalPost from '@/utils/icon/TotalPost';
import { useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import { IoMdTime } from 'react-icons/io';
import DashboardLayout from '../../../../components/atoms/DashboardLayout';
import { useTrackerOverview } from '../../../../hooks/tracker/trackerOverview.hook';

const Overview = () => {
  const { isMobile } = useResponsiveness();
  const {
    currentTrackerData,
    currentTrackerDataLoading,
    keywordTrack,
    keywordTrackLoading,
    activeTab,
    setActiveTab,
    sentimentData,
    sentimentDataLoading,
    postTypeData,
    dailyFrequencyData,
    dailyFrequencyLoading,
    topWordsData,
    topWordsLoading,
    error,
    keywordTrackerError,
    sentimentOverTime,
    isLoadingSentimentOverTime,
    postTypeDataLoading,
    topPlatformsData,
    topPlatformsLoading,
  } = useTrackerOverview();

  const { like_count = 0, quote_count = 0, reply_count = 0, retweet_count = 0 } = keywordTrack?.metadata?.total_engagements ?? {};

  const engagements = like_count + quote_count + reply_count + retweet_count;

  const analytics = useMemo(
    () => [
      {
        title: 'Total Posts',
        value: (keywordTrack?.posts?.length ?? []).toString(),
        icon: <TotalPost />,
      },
      // {
      //   title: 'Total Engagements',
      //   value: engagements.toString(),
      //   icon: <TotalReach />,
      // },
      {
        title: 'Total Search Time',
        value: (keywordTrack?.searchInformation?.formattedSearchTime ?? 0).toString(),
        icon: <IoMdTime size={30} color="#CD1B78" />,
      },
      {
        title: 'Total Influencers',
        value: (keywordTrack?.influencers?.length ?? 0).toString(),
        icon: <FaUsers size={30} color="#CD1B78" />,
      },
    ],
    [keywordTrack]
  );

  const newSentiment: KeywordTrackerSentimentsDto = useMemo(() => {
    return {
      ...sentimentData,
      sentiment: [...(sentimentData?.sentiment ?? [])],
    };
  }, [sentimentData]);

  if (error || keywordTrackerError) {
    return (
      <DashboardLayout excludeHeader>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <LockedContent
            title="No result(s) found for Keyword Tracker"
            description="We could not find any matching results for your current tracker"
            icon={<FaSearch size={30} color={LightThemeColors.uriColor} />}
          />
        </Box>
      </DashboardLayout>
    );
  }

  if (currentTrackerDataLoading || keywordTrackLoading) {
    return (
      <DashboardLayout excludeHeader>
        <ChartLoader />
      </DashboardLayout>
    );
  }

  return (
    <>
      <SeoHead title={`${currentTrackerData?.name} Tracker`} />
      <DashboardLayout>
        {/* Keyword details */}
        <Box px={3}>
          <Typography
            variant="h1"
            className="no-print"
            sx={{
              fontSize: {
                xs: '1.2rem',
                sm: '1.8rem',
                md: '2rem',
                lg: '2.5rem',
              },
              color: '#141416',
              my: 3,
            }}
            fontWeight={600}
          >
            {currentTrackerData?.name}
          </Typography>
          <Typography
            className="no-print"
            variant="subtitle1"
            sx={{
              color: '#141416',
              my: 3,
            }}
            fontWeight={400}
          >
            {TextHelper.formatTrackerDescriptionText(currentTrackerData?.name, currentTrackerData?.keywords, currentTrackerData?.excluded)}
          </Typography>
        </Box>

        {/* Insights Section */}
        <Box px={isMobile ? 2 : 3}>
          <MetricsCards metricsData={analytics} />
          {/* {analytics.map((item, index) => (
            <HashtagAnalyticsCard key={index + item.title} {...item} isLoading={keywordTrackLoading} />
          ))} */}
        </Box>

        <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={['all-insights', 'posts', 'sentiment']} />

        {/* All Insights */}
        {activeTab === 'all-insights' && (
          <AllInsightTab
            postTypeData={postTypeData}
            currentTrackerData={currentTrackerData}
            postTypeDataLoading={postTypeDataLoading}
            dailyFrequencyLoading={dailyFrequencyLoading}
            keywordTrack={keywordTrack}
            keywordTrackLoading={keywordTrackLoading}
            engagements={engagements}
            setActiveTab={setActiveTab}
            topWordsLoading={topWordsLoading}
            dailyFrequencyData={dailyFrequencyData}
            topPlatformsData={topPlatformsData}
            topPlatformsLoading={topPlatformsLoading}
            topWordsData={topWordsData}
          />
        )}

        {activeTab === 'sentiment' && (
          <Grid>
            <KeywordSentiments
              sentimentData={newSentiment}
              keywords={currentTrackerData?.keywords ?? ['']}
              loading={sentimentDataLoading || isLoadingSentimentOverTime}
              total={sentimentData?.total_results ?? 0}
              sentimentOverTimeData={sentimentOverTime ?? []}
            />
          </Grid>
        )}

        {activeTab === 'posts' && <FeedTab keywordTrack={keywordTrack} keywords={currentTrackerData?.keywords?.filter((keyword) => keyword !== '') ?? ['']} loading={keywordTrackLoading} />}
      </DashboardLayout>
    </>
  );
};

export default Overview;
