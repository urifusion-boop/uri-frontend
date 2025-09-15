import { useGetInstagramDemographics, useGetMediaPostInsights } from '@/hooks/influcencers-tracking/allInsight.hook';
import { Box, useMediaQuery } from '@mui/material';
import { Suspense, useMemo } from 'react';
import { FaPersonWalking, FaVideoSlash } from 'react-icons/fa6';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import EmptyState from '@/components/atoms/EmptyState';
import InfluencerHeader from '@/components/atoms/InfluencerHeader';
import LockedContent from '@/components/atoms/LockedContent';
import SeoHead from '@/components/atoms/SeoHead';
import TrackerChatbot from '@/components/atoms/chatbot/TrackerChatbot';
import MetricsCards from '@/components/charts/MetricsCards';
import ChartLoader from '@/components/loaders/ChartLoader';
import SkeletonLoader from '@/components/loaders/SkeletonLoader';
import Spinner from '@/components/loaders/Spinner';
import { LightThemeColors } from '@/configs/colors.config';
import { DateHelper } from '@/helpers/DateHelper';
import { MetricsHelper } from '@/helpers/MetricsHelper';
import { useInstagramAnalytics } from '@/hooks/influcencers-tracking/instagramAnalytics.hook';
import { useInstagramUserInteractionMetrics } from '@/hooks/influcencers-tracking/interactionMetrics.hook';
import { useInstagramStories } from '@/hooks/influcencers-tracking/useInstagramStories.hook';
import { useInstagramTags } from '@/hooks/influcencers-tracking/useInstagramTags.hook';
import { GetInstagramUserInteractionMetricsDto } from '@/models/dtos/InstagramInsights';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import PeopleIcon from '@mui/icons-material/People';
import { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useQueryState } from 'nuqs';
import { BsBarChartFill } from 'react-icons/bs';
import { SiBuzzfeed } from 'react-icons/si';

// Lazy-loaded components
const PostTab = dynamic(() => import('@/components/influencer-analysis/PostTab'));
const TagsTab = dynamic(() => import('@/components/influencer-analysis/TagsTab'));
const AllInsightsTab = dynamic(() => import('@/components/influencer-analysis/AllInsights'));
const StoryTab = dynamic(() => import('@/components/influencer-analysis/StoryTab'));

const InfluencerAnalytics = () => {
  const router = useRouter();
  let { username } = router.query;

  const isMobile = useMediaQuery('(max-width:800px)');
  const isTablet = useMediaQuery('(max-width:1200px)');
  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });

  const [mediaType] = useQueryState('mediaType');
  const [postId] = useQueryState('post');

  const {
    data,
    isLoading,
    error,
    selectedPost,
    setSelectedPost,
    selectedTag,
    setSelectedTag,
    postSentimentData,
    tagSentimentData,
    demographicData,
    demographicDataLoading,
    tagSentimentLoading,
    fetchPosts,
    fetchPostsLoading,
    postSentimentLoading,
    aiMediaReport,
    aiMediaReportLoading,
    influencerData,
  } = useInstagramAnalytics({
    username: username as string,
  });

  const igUserId = data?.id;

  const { tagsMedia, tagsAfterPagination, fetchTags, fetchTagsLoading } = useInstagramTags({
    facebookToken: (influencerData?.token ?? '') as string,
    data,
  });

  const { stories, selectedStory, setSelectedStory, storySentimentData, storySentimentLoading, storiesLoading } = useInstagramStories({
    igUserId: igUserId ?? '',
    facebookToken: (influencerData?.token ?? '') as string,
  });

  const { instagramUserInteractionMetrics, userInteractionMetricsLoading } = useInstagramUserInteractionMetrics(
    {
      ig_user_id: data?.id,
      ...DateHelper.generateUnixTimestampRange(new Date(), 28),
    } as GetInstagramUserInteractionMetricsDto,
    (influencerData?.token ?? '') as string
  );

  const { userDemographicData, userDemographicLoading } = useGetInstagramDemographics({
    access_token: (influencerData?.token ?? '') as string,
    instagramData: {
      ig_user_id: igUserId ?? '',
      period: 'lifetime',
      breakdowns: 'age,gender',
      metric_type: 'total_value',
      metrics: 'reached_audience_demographics,follower_demographics',
      timeframe: 'this_month',
      ...DateHelper.generateUnixTimestampRange(new Date(), 700),
    },
    influencerData: data,
  });

  const { mediaPostData, mediaPostLoading } = useGetMediaPostInsights({
    access_token: (influencerData?.token ?? '') as string,
    data: {
      media_id: postId!,
      metrics: MetricsHelper.getMediaMetrics(mediaType, activeTab ?? ''),
    },
    mediaPostType: mediaType!,
  });

  const metricsData = useMemo(() => {
    if (!data) return [];

    return [
      {
        title: 'Total Followers',
        value: data?.followers_count?.toLocaleString() ?? 0,
        icon: <PeopleIcon fontSize="large" color="primary" />,
      },
      {
        title: 'Total Following',
        value: data?.follows_count?.toLocaleString() ?? 0,
        icon: <FaPersonWalking size={28} color="#CD1B78" />,
      },
      {
        title: 'Total Posts',
        value: data?.media_count?.toLocaleString() ?? 0,
        icon: <SiBuzzfeed size={28} color="#CD1B78" />,
        showTooltip: true,
        tooltipText: 'Analysis of your latest 50 posts',
      },
      {
        title: 'Total Engagements',
        value: (data?.media?.data ?? []).reduce((total: number, post: any) => {
          return total + (post.like_count ?? 0) + (post.comments_count ?? 0);
        }, 0),
        icon: <BsBarChartFill fontSize="large" color="#CD1B78" />,
        showTooltip: true,
        tooltipText: 'Total likes and comments on your latest 50 posts',
      },
    ];
  }, [data]);

  const tabs = useMemo(() => ['all-insights', 'posts', 'tags', 'stories'], []);

  if (error) {
    return (
      <DashboardLayout excludeHeader={true}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <LockedContent
            title={`No result(s) found for this instagram account: ${username}`}
            description={(error as AxiosError).message || 'We could not find any matching results for this username'}
            disclaimer="Ensure you have provided a correct username for the selected platform"
          />
        </Box>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout excludeHeader={true}>
        <ChartLoader />
      </DashboardLayout>
    );
  }

  return (
    <>
      <SeoHead title="Account Tracking" />
      <DashboardLayout excludeHeader={false}>
        {isLoading ? (
          <SkeletonLoader />
        ) : data ? (
          <Box px={isMobile ? 2 : 3} pb={5}>
            {/* Header: Influencer Profile */}
            <InfluencerHeader
              name={data?.username || 'Influencer'}
              biography={data?.biography}
              avatarUrl={data?.profile_picture_url || '/path/to/avatar.jpg'}
              status="Active"
              website={data?.website}
            />
            {/* Metrics Cards */}
            <MetricsCards metricsData={metricsData} /> {/* Passing dynamic data */}
            {/* Tabs for switching content */}
            <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            {/* Post Tab */}
            <Suspense
              fallback={
                <Box>
                  <Spinner color={LightThemeColors.uriColor} />
                </Box>
              }
            >
              <PostTab
                activeTab={activeTab}
                data={data}
                fetchPosts={fetchPosts}
                fetchPostsLoading={fetchPostsLoading}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                postSentimentData={postSentimentData}
                postSentimentLoading={postSentimentLoading}
                mediaPostData={mediaPostData}
                mediaPostLoading={mediaPostLoading}
                authenticated={typeof influencerData?.token === 'string'}
              />
            </Suspense>
            {/* Tags Tab */}
            <Suspense
              fallback={
                <Box>
                  <Spinner color={LightThemeColors.uriColor} />
                </Box>
              }
            >
              <TagsTab
                activeTab={activeTab}
                fetchTags={fetchTags}
                fetchTagsLoading={fetchTagsLoading}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                tagsMedia={tagsMedia}
                tagSentimentLoading={tagSentimentLoading}
                tagSentimentData={tagSentimentData}
                tagsAfterPagination={tagsAfterPagination}
                authenticated={typeof influencerData?.token === 'string'}
              />
            </Suspense>
            <Suspense
              fallback={
                <Box>
                  <Spinner color={LightThemeColors.uriColor} />
                </Box>
              }
            >
              <StoryTab
                activeTab={activeTab}
                selectedStory={selectedStory}
                storiesLoading={storiesLoading}
                mediaPostData={mediaPostData}
                setSelectedStory={setSelectedStory}
                stories={stories}
                storySentimentData={storySentimentData}
                storySentimentLoading={storySentimentLoading}
                authenticated={typeof influencerData?.token === 'string'}
              />
            </Suspense>
            <Suspense
              fallback={
                <Box>
                  <Spinner color={LightThemeColors.uriColor} />
                </Box>
              }
            >
              {activeTab === 'all-insights' && (
                <AllInsightsTab
                  aiMediaReport={aiMediaReport}
                  data={data}
                  demographicData={demographicData}
                  instagramUserInteractionMetrics={instagramUserInteractionMetrics}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  postMedia={data?.media?.data}
                  userDemographicData={userDemographicData}
                  // userDemographicData={[]}
                  isLoading={aiMediaReportLoading || userInteractionMetricsLoading || userDemographicLoading || demographicDataLoading}
                />
              )}
            </Suspense>
          </Box>
        ) : (
          <DashboardLayout excludeHeader={true}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
              }}
            >
              <EmptyState message="No data about this influencer was found." actionRequired={false} icon={<FaVideoSlash size={60} color="#000" />} />
            </Box>
          </DashboardLayout>
        )}

        {!isLoading && !aiMediaReportLoading && <TrackerChatbot tracker_platform={'instagram'} tracker_name={data?.username} type={AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS} />}
      </DashboardLayout>
    </>
  );
};

export default InfluencerAnalytics;
