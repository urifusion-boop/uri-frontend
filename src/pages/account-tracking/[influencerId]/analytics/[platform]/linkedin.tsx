import { Box, useMediaQuery } from '@mui/material';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import InfluencerHeader from '@/components/atoms/InfluencerHeader';
import LockedContent from '@/components/atoms/LockedContent';
import MediaInsight from '@/components/atoms/MediaInsight';
import SeoHead from '@/components/atoms/SeoHead';
import TrackerChatbot from '@/components/atoms/chatbot/TrackerChatbot';
import MetricsCards from '@/components/charts/MetricsCards';
import LinkedinAllInsightsTab from '@/components/influencer-analysis/LinkedinAllInsightsTab';
import LinkedinPostsTab from '@/components/influencer-analysis/LinkedinPostTab';
import ChartLoader from '@/components/loaders/ChartLoader';
import { TextHelper } from '@/helpers/TextHelper';
import { useLinkedinAccountTracking } from '@/hooks/influcencers-tracking/linkedin/linkedinAccountTracking.hook';
import { MediaInsightResponse } from '@/models/dtos/InstagramInsights';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import { MetricVariantEnum } from '@/models/enum-models/MetricEnum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AxiosError } from 'axios';
import { useQueryState } from 'nuqs';

const LinkedinAccountTracking = () => {
  const isMobile = useMediaQuery('(max-width:800px)');

  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });

  const {
    errorState,
    isLoading,
    username,
    businessDiscovery,
    fetchingAiMediaReport,
    linkedinAiMediaReport,
    fetchingLifeTimeStatics,
    lifeTimeStatics,
    fetchingPostStatics,
    postSTatics,
    selectedPost,
    setSelectedPost,
    influencerData,
    postSentimentData,
    postSentimentLoading,
    fetchingFollowersStatistics,
    followersStatistics,
    useGetLinkedinPostsQuery,
  } = useLinkedinAccountTracking();

  if (errorState) {
    return (
      <DashboardLayout excludeHeader={true}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" // This will ensure full viewport height
        >
          <LockedContent
            title={`No result(s) found for this linkedin account: ${username}`}
            description={(errorState as AxiosError).message || 'We could not find any matching results for this username'}
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

  const {
    shareCount = 0,
    shareMentionsCount = 0,
    clickCount = 0,
    likeCount = 0,
    commentCount = 0,
    commentMentionsCount = 0,
    impressionCount = 0,
  } = lifeTimeStatics?.elements?.[0]?.totalShareStatistics || {};

  const totalEngagement = shareCount + clickCount + likeCount + commentCount;

  const totalMentions = shareMentionsCount + commentMentionsCount;

  const metricsData = [
    {
      title: 'Total Followers',
      value: businessDiscovery?.follower_count.firstDegreeSize?.toString(),
      icon: <PeopleIcon fontSize="large" color="primary" />, // People icon for followers
    },
    {
      title: 'Total Impressions',
      value: impressionCount,
      icon: <TimelineIcon fontSize="large" color="primary" />, // Eye icon for visibility
    },
    {
      title: 'Total Engagement',
      value: totalEngagement,
      icon: <FavoriteIcon fontSize="large" color="primary" />, // Heart icon for engagement
      showTooltip: true,
      tooltipText: 'Total likes and comments on your latest 50 posts',
    },
    {
      title: 'Total Mentions',
      value: totalMentions,
      icon: <NotificationsIcon fontSize="large" color="primary" />, // Bell icon for mentions
    },
  ];

  const tabs = ['all-insights', 'posts'];

  const postStat = postSTatics?.elements?.[0]?.totalShareStatistics;

  const mediaTypeData: MediaInsightResponse = {
    insights: [
      {
        values: [{ value: postStat?.commentCount ?? 0 }],
        description: 'The number of comments on your post.',
        id: 'comments',
        name: 'comments',
        period: 'lifetime',
        title: 'Comments',
      },
      {
        values: [{ value: postStat?.clickCount ?? 0 }],
        description: 'The number of clicks on your post.',
        id: 'clicks',
        name: 'clicks',
        period: 'lifetime',
        title: 'Click',
      },
      {
        values: [
          {
            value: (postStat?.commentMentionsCount ?? 0) + (postStat?.shareMentionsCount ?? 0),
          },
        ],
        description: 'The number of mentions on your post.',
        id: 'mentions',
        name: 'mentions',
        period: 'lifetime',
        title: 'Mentions',
      },
      {
        values: [{ value: postStat?.likeCount ?? 0 }],
        description: 'The number of likes on your post.',
        id: 'likes',
        name: 'likes',
        period: 'lifetime',
        title: 'Likes',
      },
      {
        values: [{ value: postStat?.shareCount ?? 0 }],
        description: 'The number of times your post was shared.',
        id: 'shares',
        name: 'shares',
        period: 'lifetime',
        title: 'Shares',
      },
    ],
  };

  const linkedinPosts = useGetLinkedinPostsQuery?.data?.pages.flatMap((page) => page ?? []) ?? [];

  return (
    <>
      <SeoHead title="Account Tracking" />
      <DashboardLayout excludeHeader={true}>
        <Box
          px={isMobile ? 2 : 3}
          pb={5}
          height={'100vh'}
          sx={{
            overflowY: 'auto',
          }}
          onScroll={(e) => {
            if (activeTab !== 'posts') return;

            const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight;

            if (bottom && !useGetLinkedinPostsQuery?.isFetchingNextPage) {
              useGetLinkedinPostsQuery?.hasNextPage && useGetLinkedinPostsQuery?.fetchNextPage();
            }
          }}
        >
          <InfluencerHeader
            name={businessDiscovery?.localizedName ?? 'Influencer'}
            biography={businessDiscovery?.localizedDescription ?? 'No bio'}
            avatarUrl={influencerData?.profile_pic ?? ''}
            status="Active"
            website={TextHelper.formatUrl(businessDiscovery?.localizedWebsite ?? '')}
          />

          <MetricsCards metricsData={metricsData} isLoading={fetchingLifeTimeStatics} />

          <CustomTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'all-insights' && (
            <LinkedinAllInsightsTab
              linkedinAiMediaReport={linkedinAiMediaReport}
              loading={fetchingAiMediaReport || fetchingLifeTimeStatics || fetchingFollowersStatistics}
              followersStatistics={followersStatistics}
            />
          )}

          {activeTab === 'posts' && !selectedPost && (
            <LinkedinPostsTab
              posts={linkedinPosts ?? []}
              onClick={(postId) => {
                setSelectedPost(postId);
              }}
              loading={useGetLinkedinPostsQuery.isLoading}
              isRefetching={useGetLinkedinPostsQuery.isFetchingNextPage}
            />
          )}

          {selectedPost && activeTab === 'posts' && (
            <MediaInsight
              mediaLoading={fetchingPostStatics || postSentimentLoading}
              mediaTypeData={mediaTypeData}
              sentimentData={postSentimentData ?? null}
              clearSelected={() => setSelectedPost(null)}
              variant={MetricVariantEnum.POSTS}
            />
          )}
        </Box>
        {!isLoading && !fetchingAiMediaReport && <TrackerChatbot tracker_name={username} tracker_platform="linkedin" type={AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS} />}
      </DashboardLayout>
    </>
  );
};

export default LinkedinAccountTracking;
