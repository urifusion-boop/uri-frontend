import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { FaHeart, FaPersonWalking, FaTiktok } from 'react-icons/fa6';

import DashboardLayout from '@/components/atoms/DashboardLayout';
import EmptyState from '@/components/atoms/EmptyState';
import InfluencerHeader from '@/components/atoms/InfluencerHeader';
import LockedContent from '@/components/atoms/LockedContent';
import MediaInsight from '@/components/atoms/MediaInsight';
import SeoHead from '@/components/atoms/SeoHead';
import TrackerChatbot from '@/components/atoms/chatbot/TrackerChatbot';
import MetricsCards from '@/components/charts/MetricsCards';
import TiktokMediaGallery from '@/components/influencer-analysis/TiktokMediaGallery';
import ChartLoader from '@/components/loaders/ChartLoader';
import { useTiktokInfluencerAnalysis } from '@/hooks/influcencers-tracking/tiktok/tiktokInfluencerAnalysis.hook';
import { TiktokMedia } from '@/models/dtos/TiktokInsightDto';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import { MetricVariantEnum } from '@/models/enum-models/MetricEnum';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PeopleIcon from '@mui/icons-material/People';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { SiBuzzfeed } from 'react-icons/si';

const TiktokInfluencerAnalytics = () => {
  const isMobile = useMediaQuery('(max-width:800px)');
  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });
  const [selectedPost, setSelectedPost] = useState<TiktokMedia | null>(null);

  const { fetchingInfluencer, businessDiscovery, fetchingDiscovery, error, username, businessDiscoveryError } = useTiktokInfluencerAnalysis();

  if (fetchingInfluencer || fetchingDiscovery) {
    return (
      <DashboardLayout excludeHeader={true}>
        <ChartLoader />
      </DashboardLayout>
    );
  }

  /*
  Component rendering logic if the influencer is not valid or it is a locked account
  */
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
          value: businessDiscovery?.follower_count?.toLocaleString(),
          change: '4.7%',
          changeColor: 'green',
          description: 'Since last week',
          icon: <PeopleIcon fontSize="large" color="primary" />,
          changeIcon: <ArrowUpwardIcon sx={{ color: 'green' }} />,
        },
        {
          title: 'Total Following',
          value: businessDiscovery?.following_count?.toLocaleString(),
          change: '5.1%',
          changeColor: 'green',
          description: 'Since last week',
          icon: <FaPersonWalking size={28} color="#CD1B78" />,
          changeIcon: <ArrowUpwardIcon sx={{ color: 'green' }} />,
        },
        {
          title: 'Total Posts',
          value: businessDiscovery?.media ? businessDiscovery?.media?.length.toLocaleString() : 0,
          change: '-7.7%',
          changeColor: 'red',
          description: 'Since last week',
          icon: <SiBuzzfeed size={28} color="#CD1B78" />,
          changeIcon: <ArrowDownwardIcon sx={{ color: 'red' }} />,
          showTooltip: true,
          tooltipText: 'Analysis of your latest 50 posts',
        },
        {
          title: 'Total Likes',
          value: businessDiscovery?.likes_count?.toString(), // You can add real data for engagement if available
          change: '0.4%',
          changeColor: 'green',
          description: 'Since last week',
          icon: <FaHeart fontSize="large" color="#CD1B78" />,
          changeIcon: <ArrowUpwardIcon sx={{ color: 'green' }} />,
          showTooltip: true,
          tooltipText: 'Total likes on your latest 50 posts',
        },
      ]
    : [];

  const tabs = ['all-insights', 'posts', 'sentiment', 'tags', 'stories'];

  return (
    <>
      <SeoHead title="Account Tracking" />
      <DashboardLayout excludeHeader={true}>
        <Box px={isMobile ? 2 : 3} pb={5}>
          <InfluencerHeader
            name={businessDiscovery?.username || 'Influencer'}
            biography={businessDiscovery?.bio_description ?? 'No bio'}
            avatarUrl={businessDiscovery?.avatar_url ?? ''}
            status="Active"
            website={businessDiscovery?.profile_deep_link ?? ''}
          />
          <MetricsCards metricsData={metricsData} />

          {/* Tabs */}
          <Box display="flex" borderBottom="1px solid #E0E0E0" justifyContent="flex-start" mt={3} sx={{ overflow: 'auto' }} mb={3}>
            {tabs.map((tab) => (
              <Box
                key={tab}
                px={3}
                py={1}
                sx={{
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? '3px solid #CD1B78' : 'none',
                  transition: 'border-bottom 0.3s ease',
                }}
                onClick={() => setActiveTab(tab)}
              >
                <Typography
                  style={{
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                  }}
                  fontSize={14}
                  fontWeight={activeTab === tab ? 600 : 400}
                  color={activeTab === tab ? '#CD1B78' : '#6F6F6F'}
                >
                  {tab === 'all-insights' ? 'All Insights' : tab}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Post Tab */}
          {activeTab === 'posts' && !selectedPost ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2 }}>
                Post Gallery
              </Typography>
              {businessDiscovery?.media ? (
                <Grid container spacing={2}>
                  {businessDiscovery.media?.map((media) => <TiktokMediaGallery key={media.id} media={media} setSelectedPost={setSelectedPost} />)}
                </Grid>
              ) : (
                <EmptyState message="No posts found." icon={<FaTiktok size={60} color="#000" />} />
              )}
            </Box>
          ) : selectedPost && activeTab === 'posts' ? (
            <MediaInsight mediaLoading={false} mediaTypeData={undefined} sentimentData={null} clearSelected={() => setSelectedPost(null)} variant={MetricVariantEnum.POSTS} />
          ) : null}
        </Box>
        {!fetchingInfluencer && !fetchingDiscovery && <TrackerChatbot tracker_name={username} tracker_platform="tiktok" type={AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS} />}
      </DashboardLayout>
    </>
  );
};

export default TiktokInfluencerAnalytics;
