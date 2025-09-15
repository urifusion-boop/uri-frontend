import { Box, Grid, Skeleton, Typography } from '@mui/material';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import LockedContent from '@/components/atoms/LockedContent';
import SeoHead from '@/components/atoms/SeoHead';
import TrackerChatbot from '@/components/atoms/chatbot/TrackerChatbot';
import ContentThemesCard from '@/components/cards/ContentThemesCard';
import KeyTrendsCard from '@/components/cards/KeyTrendsCard';
import TextListCard from '@/components/cards/TextListCard';
import AllInsights from '@/components/hashtag-tracking/AllInsights';
import PostTab from '@/components/hashtag-tracking/PostTab';
import SentimentsTab from '@/components/hashtag-tracking/SentimentsTab';
import ChartLoader from '@/components/loaders/ChartLoader';
import CampaignTable from '@/components/tables/CampaignTable';
import { LightThemeColors } from '@/configs/colors.config';
import { TrackerHelper } from '@/helpers/TrackerHelper';
import { useHashtagTrackerOverview } from '@/hooks/tracker/hashtagTracker.hook';
import useResponsiveness from '@/hooks/useResponsiveness';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import TotalMention from '@/utils/icon/TotalMention';
import TotalPost from '@/utils/icon/TotalPost';
import TotalReach from '@/utils/icon/total-reach';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { CgHashtag } from 'react-icons/cg';
import { FaSearch } from 'react-icons/fa';
import HashtagAnalyticsCard from '../../components/hashtag-tracking/HashtagAnalyticsCard';

const HashtagTracking = () => {
  const { isMobile } = useResponsiveness();
  const router = useRouter();

  const {
    activeTab,
    currentTrackerData,
    errorState,
    setActiveTab,
    loadingState,
    hashtagTracker,
    hashtagTrackerLoading,
    aiPostReport,
    aiPostReportLoading,
    aiPostReportError,
    refetchAiPostReport,
    hashtagCampaigns,
    isLoadingHashtagCampaigns,
    hashtagSentiment,
    hashtagSentimentLoading,
  } = useHashtagTrackerOverview();

  const analytics = useMemo(
    () => [
      {
        title: 'Total Posts',
        value: (hashtagTracker?.count ?? 0).toString(),
        icon: <TotalPost />,
      },
      {
        title: 'Total Engagements',
        value: TrackerHelper.calculateTotalReach(hashtagTracker?.media ?? []).totalLikes.toString(),
        icon: <TotalReach />,
      },
      {
        title: 'Total Mention',
        value: aiPostReport?.total_mentions?.toString() ?? '0',
        icon: <TotalMention />,
      },
    ],
    [hashtagTracker, aiPostReport]
  );

  const renderBasedOnStatus = () => {
    if (errorState) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" // This will ensure full viewport height
        >
          <LockedContent
            title="No result(s) found for this hashtag."
            description={(errorState as AxiosError).message || 'We could not find any matching results for this hashtag'}
            icon={<FaSearch size={30} color={LightThemeColors.uriColor} />}
            showBtn
            btnText="Go back"
            btnProps={{
              onClick: () => router.back(),
            }}
          />
        </Box>
      );
    }

    if (loadingState) {
      return <ChartLoader />;
    }

    if (currentTrackerData) {
      return (
        <>
          <Box
            sx={{
              backgroundColor: '#FAFAFA',
              height: '100%',
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '40px 26px' }}>
              {/* Header title */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px' }}>
                    <CgHashtag color="#fff" size={20} />
                  </Box>
                  <Typography variant="h2" sx={{ fontSize: { xs: '24px', md: '36px' }, fontWeight: 600, color: '#4B4B4B' }}>
                    {currentTrackerData?.keywords?.[0]}
                  </Typography>
                </Box>
                <Typography sx={{ ml: '48px', mt: '2px' }}>Top interactions and mentions</Typography>
              </Box>
            </Box>
            <Box>
              {/* Analytics */}
              <Box sx={{ display: 'flex', gap: '36px', padding: '16px', margin: '16px', flexDirection: { xs: 'column', md: 'row' } }}>
                {analytics.map((item, index) => (
                  <HashtagAnalyticsCard key={item.title + index} {...item} isLoading={hashtagTrackerLoading || aiPostReportLoading} />
                ))}
              </Box>

              {/* Tabs */}
              <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={['all-insights', 'posts', 'sentiments', 'ai report']} />

              {/* Tab Content */}
              {activeTab === 'all-insights' && (
                <AllInsights
                  posts={hashtagTracker?.media ?? []}
                  isLoading={hashtagTrackerLoading}
                  relatedHashtags={aiPostReport?.related_hashtags ?? []}
                  trendingHashtags={aiPostReport?.trending_hashtags ?? []}
                  hashtagMentionFrequency={hashtagTracker?.hashtag_mention_frequency?.slice(0, 11) ?? []}
                  aiPostReportLoading={aiPostReportLoading}
                  aiPostReportError={aiPostReportError}
                  refetchAiPostReport={refetchAiPostReport}
                  hashtagReportLoading={isLoadingHashtagCampaigns}
                  postTypeDistribution={hashtagTracker?.post_type_distribution}
                />
              )}

              {activeTab === 'posts' && <PostTab posts={hashtagTracker?.media ?? []} isLoading={hashtagTrackerLoading} />}

              {activeTab === 'sentiments' && <SentimentsTab report={hashtagSentiment} isLoading={hashtagSentimentLoading} hashtagTracker={hashtagTracker} />}

              {activeTab === 'ai report' && (
                <Box>
                  <Box
                    sx={{
                      width: '100%',
                      padding: '20px',
                      display: 'grid',
                      gap: '20px',
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      {isLoadingHashtagCampaigns ? (
                        <Skeleton variant="rectangular" height={400} />
                      ) : (
                        <>
                          {hashtagCampaigns?.weekly_campaign_calendar && (
                            <Grid py={3} borderRadius={2} gap={2}>
                              <CampaignTable campaigns={hashtagCampaigns?.weekly_campaign_calendar ?? []} />
                            </Grid>
                          )}
                          {hashtagCampaigns && (
                            <Grid
                              display={'grid'}
                              //   overflow={'scroll'}
                              gridTemplateColumns="repeat(3, 1fr)"
                              py={3}
                              overflow={'scroll'}
                              borderRadius={2}
                              gap={2}
                            >
                              {/* Recommendations Card */}
                              <TextListCard
                                title="AI-Driven Recommendations"
                                description="These insights focus on enhancing visibility, boosting engagement, and refining your strategy to achieve better results."
                                items={hashtagCampaigns?.recommendations ?? []}
                                variant="recommendations"
                              />

                              {/* Engagement Drivers Card */}
                              <TextListCard
                                title="Engagement Drivers"
                                description="Use these insights to understand what resonates with your audience and drives engagement."
                                items={hashtagCampaigns?.engagement_drivers ?? []}
                                variant="engagementDrivers"
                              />

                              {/* Engagement Opportunities Card */}
                              <TextListCard
                                title="Engagement Opportunities"
                                description="These insights highlight areas to focus on, helping you build stronger audience connections to maximize impact."
                                items={hashtagCampaigns?.engagement_opportunities ?? []}
                                variant="engagementOpportunities"
                              />
                            </Grid>
                          )}
                          <Box>
                            {hashtagCampaigns?.conversation_velocity && (
                              <Grid
                                display={isMobile ? 'block' : 'flex'}
                                //   overflow={'scroll'}
                                gridTemplateColumns={isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'}
                                alignItems={'stretch'}
                                py={2}
                                borderRadius={2}
                                gap={2}
                              >
                                {/* <ConversationVelocityCard
                                  growth_rate={
                                    hashtagCampaigns.conversation_velocity
                                      .growth_rate
                                  }
                                  peak_times={
                                    hashtagCampaigns.conversation_velocity
                                      .peak_times
                                  }
                                /> */}
                                <KeyTrendsCard keyTrends={hashtagCampaigns.key_trends} />
                                <ContentThemesCard contentThemes={hashtagCampaigns.content_themes} />
                              </Grid>
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* ChatBot */}
            {!hashtagTrackerLoading && !aiPostReportLoading && <TrackerChatbot type={AiAssistantThreadTypeEnum.HASHTAG_TRACKING_INSIGHTS} tracker_name={currentTrackerData.name} />}
          </Box>
        </>
      );
    }

    return <ChartLoader />;
  };

  return (
    <>
      <SeoHead title="Hashtag Tracking" />
      <DashboardLayout excludeHeader>{renderBasedOnStatus()}</DashboardLayout>
    </>
  );
};

export default HashtagTracking;
