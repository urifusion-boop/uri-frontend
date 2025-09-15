import { Grid, useMediaQuery } from '@mui/material';
import { FaHeart, FaPersonWalking, FaRetweet, FaVideoSlash } from 'react-icons/fa6';

import CustomMediaInsight from '@/components/atoms/CustomMediaInsight';
import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import EmptyState from '@/components/atoms/EmptyState';
import InfluencerHeader from '@/components/atoms/InfluencerHeader';
import LockedContent from '@/components/atoms/LockedContent';
import SeoHead from '@/components/atoms/SeoHead';
import TrackerChatbot from '@/components/atoms/chatbot/TrackerChatbot';
import MetricsCards from '@/components/charts/MetricsCards';
import KeywordTrackerPostCard from '@/components/keyword-tracking/PostCard';
import ChartLoader from '@/components/loaders/ChartLoader';
import { LightThemeColors } from '@/configs/colors.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useTwitterInfluencerAnalysis } from '@/hooks/influcencers-tracking/twitter/twitterInfluencerAnalytics.hook';
import { Tweet } from '@/models/dtos/XInsightsDto';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from '@mui/system';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

const TwitterInfluencerAnalytics = () => {
  const isMobile = useMediaQuery('(max-width:800px)');
  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });

  const [selectedPost, setSelectedPost] = useState<Tweet | null>(null);

  const { businessDiscovery, businessDiscoveryError, error, fetchingDiscovery, fetchingInfluencer, username } = useTwitterInfluencerAnalysis();

  //  Loading state for the influencer and discovery data
  if (fetchingInfluencer || fetchingDiscovery) {
    return (
      <DashboardLayout excludeHeader={true}>
        <ChartLoader />
      </DashboardLayout>
    );
  }

  // Component rendering logic if the influencer is not valid or it is a locked account
  if (error || businessDiscoveryError) {
    return (
      <DashboardLayout excludeHeader={true}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" // This will ensure full viewport height
        >
          <LockedContent
            description={`${username} is not a valid professional account, Please Provide a valid account`}
            disclaimer="Ensure you have provided a correct username for the selected platform"
          />
        </Box>
      </DashboardLayout>
    );
  }

  const metricsData = businessDiscovery
    ? [
        {
          title: 'Total Followers',
          value: businessDiscovery?.public_metrics?.followers_count?.toLocaleString() ?? 0,
          //   change: "4.7%",
          //   changeColor: "green",
          //   description: "Since last week",
          icon: <PeopleIcon fontSize="large" color="primary" />,
          //   changeIcon: <ArrowUpwardIcon sx={{ color: "green" }} />,
        },
        {
          title: 'Total Following',
          value: businessDiscovery?.public_metrics?.following_count?.toLocaleString() ?? 0,
          //   change: "5.1%",
          //   changeColor: "green",
          //   description: "Since last week",
          icon: <FaPersonWalking size={28} color="#CD1B78" />,
          //   changeIcon: <ArrowUpwardIcon sx={{ color: "green" }} />,
        },
        {
          title: 'Total Tweets',
          value: businessDiscovery?.public_metrics?.tweet_count?.toLocaleString() ?? 0,
          //   change: "-7.7%",
          //   changeColor: "red",
          //   description: "Since last week",
          icon: <FaRetweet size={28} color="#CD1B78" />,
          //   changeIcon: <ArrowDownwardIcon sx={{ color: "red" }} />,
          showTooltip: true,
          tooltipText: 'Analysis only covers for your latest 50 tweets',
        },
        {
          title: 'Total Likes',
          value: businessDiscovery?.public_metrics?.like_count?.toLocaleString() ?? 0,
          //   change: "0.4%",
          //   changeColor: "green",
          //   description: "Since last week",
          icon: <FaHeart fontSize="large" color="#CD1B78" />,
          //   changeIcon: <ArrowUpwardIcon sx={{ color: "green" }} />,
          showTooltip: true,
          tooltipText: 'Total likes on your latest 50 posts',
        },
      ]
    : [];

  const postTweetsData = businessDiscovery?.tweets?.data.map((tweet) => ({
    time: tweet?.created_at,
    id: tweet?.id,
    retweets: tweet?.public_metrics?.retweet_count,
    replies: tweet?.public_metrics?.reply_count,
    likes: tweet?.public_metrics?.like_count,
    quotes: tweet?.public_metrics?.quote_count,
    impressions: tweet?.public_metrics?.impression_count,
    hashtags: [],
    mentions: tweet?.entities?.mentions?.map((mention) => mention?.username) ?? [],
    media_urls: [],
    username: businessDiscovery?.username,
    profile_image_url: businessDiscovery?.profile_image_url,
    followers_count: 0,
    ...tweet,
  }));

  const tabs = ['all-insights', 'posts', 'sentiment', 'tags', 'mentions'];

  const barChartData = Object.entries(selectedPost?.public_metrics ?? {}).map(([name, value]) => ({
    name: name.split('_')?.[0],
    value,
    title: TextHelper.removeChar(name, '_'),
    description: `Total number of ${name}s`,
  }));

  return (
    <>
      <SeoHead title="Account Tracking" />
      <DashboardLayout excludeHeader={true}>
        <Box pb={5} px={isMobile ? 2 : 3}>
          <InfluencerHeader
            name={businessDiscovery?.name || 'Influencer'}
            biography={businessDiscovery?.description ?? 'No bio'}
            avatarUrl={businessDiscovery?.profile_image_url ?? ''}
            status="Active"
            website={businessDiscovery?.url ?? ''}
          />

          <MetricsCards metricsData={metricsData} />
          <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

          {activeTab === 'posts' && !selectedPost ? (
            postTweetsData && postTweetsData.length > 0 ? (
              <Grid container spacing={3} mx="auto" width="100%" alignItems="stretch">
                {postTweetsData.map((tweet) => (
                  <Grid item key={tweet.id} xs={12} sm={6} lg={4} xl={3} width={'100%'} px={2}>
                    <KeywordTrackerPostCard tweet={tweet} key={tweet.id} insights handleEngagement={() => setSelectedPost(tweet)} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <EmptyState icon={<FaVideoSlash color={LightThemeColors.uriColor} size={40} />} heading="No Posts Found" subtitle="No posts found for the selected influencer" actionRequired={false} />
            )
          ) : (
            selectedPost && <CustomMediaInsight title="Post Insight" onBack={() => setSelectedPost(null)} barChartData={barChartData ?? []} />
          )}
        </Box>
        {!fetchingInfluencer && !fetchingDiscovery && <TrackerChatbot tracker_name={username} tracker_platform="twitter" type={AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS} />}
      </DashboardLayout>
    </>
  );
};

export default TwitterInfluencerAnalytics;
