import { Box, Button, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { FaFacebook, FaPersonWalking } from 'react-icons/fa6';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import FacebookLatestPost from '@/components/atoms/DyanamicSocialPlatformAudience';
import EmptyState from '@/components/atoms/EmptyState';
import InfluencerHeader from '@/components/atoms/InfluencerHeader';
import LockedContent from '@/components/atoms/LockedContent';
import MediaInsight from '@/components/atoms/MediaInsight';
import Sentiments from '@/components/atoms/Sentiments';
import SeoHead from '@/components/atoms/SeoHead';
import TrackerChatbot from '@/components/atoms/chatbot/TrackerChatbot';
import AICalendar from '@/components/calendars/AICalendar';
import ContentThemesCard from '@/components/cards/ContentThemesCard';
import FacebookPostCard from '@/components/cards/FacebookPostCard';
import FacebookReelsCard from '@/components/cards/FacebookReelsCard';
import KeyTrendsCard from '@/components/cards/KeyTrendsCard';
import PerformanceScoreCard from '@/components/cards/PerformanceScoreCard';
import SuggestionsCard from '@/components/cards/SuggestionsCard';
import CustomLineChart from '@/components/charts/CustomLineChart';
import FacebookInsightBarChart from '@/components/charts/FacebookInsightBarChart';
import LatestMediaEngagement from '@/components/charts/LatestMediaEngagement';
import MetricsCards from '@/components/charts/MetricsCards';
import PostTypePieChart from '@/components/charts/PostTypePieChart';
import ReachImpressionsChart from '@/components/charts/ReachImpressionsChart';
import ChartLoader from '@/components/loaders/ChartLoader';
import HashtagTable from '@/components/tables/HashtagTable';
import { InsightHelper } from '@/helpers/InsightHelper';
import { useFacebookInfluencerAnalysis } from '@/hooks/influcencers-tracking/facebook/facebookAccountTracking.hook';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import { MetricVariantEnum } from '@/models/enum-models/MetricEnum';
import PeopleIcon from '@mui/icons-material/People';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useQueryState } from 'nuqs';

const FacebookAccountTracking = () => {
  const isMobile = useMediaQuery('(max-width:800px)');
  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });

  const getGridTemplateColumns = (isMobile: boolean, isTablet: boolean) => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2,1fr)';
    return '50% 50% 1fr';
  };

  const {
    username,
    businessDiscovery,
    errorState,
    isLoading,
    postSentimentData,
    postSentimentLoading,
    selectedPost,
    setSelectedPost,
    facebookReelsData,
    facebookReelsDataLoading,
    selectedReels,
    setSelectedReels,
    facebookPostInsightsData,
    facebookPostInsightsDataLoading,
    facebookVideoInsightsData,
    facebookVideoInsightsDataLoading,
    facebookMentionsData,
    facebookMentionsDataLoading,
    facebookPageInsightsData,
    facebookPageInsightsLoading,
    mentionsSentimentData,
    mentionsSentimentLoading,
    fetchPosts,
    fetchPostsLoading,
    aiMediaReport,
    aiMediaReportLoading,
    facebookPostData,
    facebookPostDataLoading,
  } = useFacebookInfluencerAnalysis();

  if (errorState) {
    return (
      <DashboardLayout excludeHeader={true}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <LockedContent
            title={`No result(s) found for this facebook account: ${username}`}
            description={(errorState as AxiosError).message || 'We could not find any matching results for this username'}
            disclaimer="Ensure you have provided a correct username for the selected platform"
          />
        </Box>
      </DashboardLayout>
    );
  }

  if (isLoading || aiMediaReportLoading) {
    return (
      <DashboardLayout excludeHeader={true}>
        <ChartLoader />
      </DashboardLayout>
    );
  }

  const metricsData = businessDiscovery
    ? [
        {
          title: 'Total Followers',
          value: businessDiscovery?.followers_count?.toString(),
          icon: <PeopleIcon fontSize="large" color="primary" />,
        },
        {
          title: 'Total Fan',
          value: businessDiscovery?.fan_count?.toString(),
          icon: <FaPersonWalking size={28} color="#CD1B78" />,
        },
      ]
    : [];

  /*
  Component rendering logic if the influencer is not valid or it is a locked account
  */

  const tabs = ['all-insights', 'posts', 'reels', 'sentiment'];

  const pageImpressionData = InsightHelper.getInsightsValues(facebookPageInsightsData?.data, 'page_posts_impressions');

  const pageEngagementsData = InsightHelper.getInsightsValues(facebookPageInsightsData?.data, 'page_post_engagements');

  const impressionViewsData = [
    InsightHelper.getInsightsValues(facebookPageInsightsData?.data, 'page_impressions'),
    InsightHelper.getInsightsValues(facebookPageInsightsData?.data, 'page_views_total'),
  ];

  const followsData = InsightHelper.getInsightsValues(facebookPageInsightsData?.data, 'page_follows');

  const combinedData = pageImpressionData?.values.map((impression) => {
    const engagement = pageEngagementsData?.values.find((e) => e?.end_time === impression?.end_time);

    return {
      date: dayjs(impression?.end_time).format('DD-MM-YYYY'),
      page_post_engagements: engagement ? engagement?.value : 0,
      page_posts_impressions: impression?.value,
    };
  });

  const postMedia = facebookPostData?.feed?.data.map((post) => ({
    comments_count: post.comments?.data?.length ?? 0,
    like_count: post?.reactions?.data.length ?? 0,
    media_type: post?.attachments?.data?.[0].media_type ?? 'photo',
    timestamp: post?.created_time ?? '',
  }));

  const pieData = InsightHelper.prepareChartData(postMedia ?? []).pieChartData?.map((data) => ({
    x: data.media_type, // Key for x-axis
    y: data.count, // Key for y-axis
  }));

  const mockSentimentData = {
    totalFeedback: facebookMentionsData?.data?.length ?? 0,
    sentiments: [
      {
        sentiment: 'Positive',
        percentage: 0,
      },
      {
        sentiment: 'Neutral',
        percentage: 0,
      },
      {
        sentiment: 'Negative',
        percentage: 0,
      },
    ],
    pieData: [
      {
        x: 'Positive',
        y: mentionsSentimentData?.sentiment_summary?.positive ?? 0,
      },
      {
        x: 'Neutral',
        y: mentionsSentimentData?.sentiment_summary?.neutral ?? 0,
      },
      {
        x: 'Negative',
        y: mentionsSentimentData?.sentiment_summary?.negative ?? 0,
      },
    ],
  };

  return (
    <>
      <SeoHead title="Account Tracking" />
      <DashboardLayout excludeHeader={true}>
        <Box px={isMobile ? 2 : 3} pb={5}>
          <InfluencerHeader
            name={businessDiscovery?.name ?? 'Influencer'}
            biography={businessDiscovery?.about ?? 'No bio'}
            avatarUrl={businessDiscovery?.picture?.data?.url ?? ''}
            status="Active"
            website={businessDiscovery?.website ?? ''}
          />

          <MetricsCards metricsData={metricsData} />

          <CustomTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'all-insights' &&
            (facebookPageInsightsLoading ? (
              <Skeleton variant="rectangular" height={300} width="100%" />
            ) : (
              <>
                <Box marginTop={3}>
                  <Box bgcolor={'white'} borderRadius={'8px'} paddingLeft={2} pt={2} paddingRight={2} pb={2}>
                    <CustomLineChart
                      data={combinedData}
                      series={[
                        {
                          dataKey: 'page_post_engagements',
                          label: 'Page post engagements',
                          color: 'green',
                        },
                        {
                          dataKey: 'page_posts_impressions',
                          label: 'Page posts impressions',
                          color: 'red',
                        },
                      ]}
                      title="Post Engagement Over Time"
                      description="This graph shows the engagement trend over time, highlighting the highest and lowest touch points for reach and impressions."
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                  }}
                  mt={3}
                  mb={2}
                >
                  <FacebookInsightBarChart
                    series={[
                      {
                        label: 'Follows',
                        data: followsData?.values.map((point) => point?.value),
                      },
                    ]}
                    date={followsData?.values.map((point) => point?.end_time)}
                    header={`Last ${followsData?.values?.length} Page Follows Over Time`}
                    subText="This graph shows the latest page follows trends over time
             of posting"
                    legend={[
                      {
                        name: 'Follows',
                        color: '#f28e2c',
                      },
                    ]}
                    maxWidth={isMobile ? '100%' : '60%'}
                  />
                  <FacebookLatestPost post={facebookPostData?.feed?.data ?? []} maxWidth={isMobile ? '100%' : '40%'} />
                </Box>

                <ReachImpressionsChart data={impressionViewsData} removeFilter reach="page_impressions" impressions="page_views_total" />
                <Box
                  sx={{
                    display: 'flex',
                    my: 3,
                    gap: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                  }}
                >
                  <LatestMediaEngagement
                    aggregateTimeSeriesData={
                      facebookPostData?.feed?.data
                        ? InsightHelper.prepareBarChartData(
                            facebookPostData.feed.data.map((post) => ({
                              comments_count: post.comments?.data?.length ?? 0,
                              like_count: post.reactions?.summary.total_count ?? 0,
                              media_type: 'POST', // Default media type
                              timestamp: String(post.created_time ?? ''), // Ensure timestamp is always a string
                            }))
                          )?.aggregatedData
                        : []
                    }
                  />

                  {/* <Box
                    p={3}
                    border="1px solid #ddd"
                    borderRadius={2}
                    bgcolor="white"
                    maxWidth={isMobile ? "100%" : "40%"}
                  >
                    <Typography
                      fontWeight={500}
                      fontSize={17}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Latest Posts Summary and Distribution
                    </Typography>
                    <Typography
                      mt={1}
                      marginBottom={2}
                      fontSize={16}
                      variant="body2"
                      color="textSecondary"
                    >
                      This chart shows the distribution of latest postings by
                      media types
                    </Typography>

                   
                    <VictoryPie
                      data={pieData}
                      colorScale={colorScale}
                      innerRadius={100} // Adjust for a donut shape
                      labels={({ datum }) => `${datum?.x}: ${datum?.y}`} // Label each slice
                      labelComponent={
                        <VictoryTooltip flyoutStyle={{ fill: "white" }} />
                      }
                      style={{
                        labels: { fontSize: 14, fill: "black" },
                        parent: {
                          // maxWidth: 250,
                          marginRight: "auto",
                          marginLeft: "auto",
                          marginTop: isMobile ? -20 : -80,
                          marginBottom: isMobile ? -30 : -90,
                          height: 600,
                        },
                      }}
                      animate={{ duration: 1000 }}
                    />
                    <Box
                      display={"flex"}
                      flexWrap={"wrap"}
                      gap={2}
                      alignItems={"center"}
                      maxWidth={"fit-content"}
                      marginLeft={"auto"}
                      marginRight={"auto"}
                      mt={2}
                    >
                      {pieData.map((data, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <GoDotFill size={12} color={colorScale[i]} />
                          <Typography fontWeight={600} fontSize={10}>
                            {data.x}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box> */}

                  <Box pt={3} borderRadius={2} gap={2} px={4} width={'100%'} bgcolor="white" alignItems={'center'}>
                    <PostTypePieChart
                      data={pieData} // Pass the pieData here
                      xKey="x" // Key for x-axis (mapped to "media_type")
                      yKey="y" // Key for y-axis (mapped to "count")
                      title="Post Type Distribution"
                      subtitle="A breakdown of post types by count"
                      description="This chart shows the distribution of post types across different categories."
                      colorSet={['#CD1B78', '#DFDFDF', '#141416']}
                      isLoading={isLoading} // Show loading state if no data
                    />
                  </Box>
                </Box>

                <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, false)} gap={'1%'} mt={2}>
                  {aiMediaReport?.hashtag_mention_frequency && <HashtagTable hashtagMentionFrequency={aiMediaReport?.hashtag_mention_frequency} />}

                  {aiMediaReport?.weekly_campaign_calendar && <AICalendar weeklyCampaignCalendar={aiMediaReport?.weekly_campaign_calendar} />}
                </Grid>

                <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, false)} gap={'1%'} mt={2}>
                  {aiMediaReport?.industry_classification && aiMediaReport.performance_score_breakdown && (
                    <PerformanceScoreCard industryClassification={aiMediaReport?.industry_classification ?? {}} performanceScoreBreakdown={aiMediaReport?.performance_score_breakdown ?? {}} />
                  )}

                  <SuggestionsCard improvement_suggestions={aiMediaReport?.improvement_suggestions} />
                </Grid>

                <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, false)} gap={'1%'} mt={2}>
                  {aiMediaReport?.key_trends && <KeyTrendsCard keyTrends={aiMediaReport?.key_trends} />}
                  {aiMediaReport?.content_themes && <ContentThemesCard contentThemes={aiMediaReport.content_themes.slice(0, 3)} />}
                </Grid>
              </>
            ))}

          {activeTab === 'posts' &&
            !selectedPost &&
            (facebookPostData?.feed?.data && facebookPostData?.feed?.data.length > 0 ? (
              <Box>
                <Grid
                  container
                  spacing={3}
                  alignItems="stretch"
                  sx={{
                    height: '100%',
                  }}
                >
                  {facebookPostData?.feed?.data.map((post) => (
                    <Grid item xs={12} sm={6} md={3} key={post.id} sx={{ height: '100%' }} alignItems="stretch">
                      <FacebookPostCard
                        post={post}
                        isDashboard
                        onShowSentiments={(postId, postComment, media_type) => {
                          setSelectedPost({
                            id: postId,
                            comments: postComment,
                            media_type,
                          });
                        }}
                      />
                    </Grid>
                  ))}
                  {facebookPostDataLoading ||
                    (fetchPostsLoading &&
                      Array.from({ length: 4 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} height="100%">
                          <Skeleton variant="rectangular" height={400} width="100%" animation="wave" />
                        </Grid>
                      )))}
                </Grid>

                {facebookPostData?.feed?.paging?.next && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '100%',
                      mt: 3,
                    }}
                  >
                    <Button onClick={() => fetchPosts()} variant="contained">
                      Next
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <EmptyState heading="No Posts" message="No post found for this influencer" actionRequired={false} icon={<FaFacebook size={50} color="#1877F2" />} />
              </Box>
            ))}

          {selectedPost && activeTab === 'posts' && (
            <MediaInsight
              mediaLoading={facebookPostInsightsDataLoading || postSentimentLoading}
              mediaTypeData={{
                insights: facebookPostInsightsData?.data ?? [],
              }}
              sentimentData={postSentimentData ?? null}
              clearSelected={() => setSelectedPost(undefined)}
              variant={MetricVariantEnum.POSTS}
            />
          )}

          {/* Reels */}
          {activeTab === 'reels' && !selectedReels && (
            <Grid container spacing={3}>
              {facebookReelsDataLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index} height="100%">
                    <Skeleton variant="rectangular" height={300} width="100%" />
                  </Grid>
                ))
              ) : facebookReelsData?.data && facebookReelsData?.data.length > 0 ? (
                facebookReelsData?.data.map((reels) => (
                  <Grid item xs={12} sm={6} md={3} key={reels.id} height="100%">
                    <FacebookReelsCard
                      reels={reels}
                      isDashboard
                      onShowSentiments={(id) => {
                        setSelectedReels({
                          id: id,
                        });
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <EmptyState heading="No Reels" message="No reels found for this influencer" actionRequired={false} icon={<FaFacebook size={50} color="#1877F2" />} />
                </Box>
              )}
            </Grid>
          )}
          {selectedReels && activeTab === 'reels' && (
            <MediaInsight
              mediaLoading={facebookVideoInsightsDataLoading || postSentimentLoading}
              mediaTypeData={{
                insights: facebookVideoInsightsData?.data ?? [],
              }}
              sentimentData={postSentimentData ?? null}
              clearSelected={() => setSelectedReels(undefined)}
              variant={MetricVariantEnum.REELS}
            />
          )}

          {/* Mentions */}
          {activeTab === 'sentiment' &&
            (facebookMentionsDataLoading || mentionsSentimentLoading ? (
              <Grid
                container
                spacing={3}
                alignItems="stretch"
                sx={{
                  height: '100%',
                }}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rectangular" height={300} width="100%" />
                  </Grid>
                ))}
              </Grid>
            ) : facebookMentionsData?.data && facebookMentionsData?.data.length > 0 ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Sentiments
                    sentimentData={mockSentimentData}
                    tags={['Platform Distribution', 'Sentiment Distribution']}
                    scatterData={(mentionsSentimentData?.comments_with_sentiment ?? []).map((value, index) => ({
                      id: index.toString(),
                      text: value.text,
                      sentiment: {
                        magnitude: value.sentiment.magnitude,
                        score: value.sentiment.score,
                        sentiment: value.sentiment.sentiment,
                        text: value.sentiment.text,
                      },
                      timestamp: value.timestamp,
                    }))}
                    total={facebookMentionsData?.data.length ?? 0}
                  />
                </Box>
                <Grid
                  container
                  spacing={3}
                  alignItems="stretch"
                  sx={{
                    height: '100%',
                  }}
                >
                  {facebookMentionsData?.data.map((mention) => (
                    <Grid item xs={12} sm={6} md={4} key={mention.id} alignSelf={'stretch'}>
                      <Box
                        sx={{
                          borderTop: '10px solid 	#1877F2',
                          minHeight: 180,
                          bgcolor: '#fff',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          borderRadius: '10px',
                          padding: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                          height: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            flexDirection: 'row',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                          }}
                        >
                          {/* Instagram Icon */}
                          <Box
                            bgcolor={'#1877F2'}
                            sx={{
                              height: 25,
                              width: 25,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '50%',
                            }}
                          >
                            <FaFacebook size={15} color="#fff" />
                          </Box>

                          {/* Post Date */}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: {
                                sm: '0.5rem',
                                md: '0.6rem',
                                lg: '0.7rem',
                              },
                              color: '#888',
                            }}
                          >
                            {dayjs(mention.created_time).format('DD MMM YYYY HH:mm A')}
                          </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" gutterBottom>
                            &quot;{mention.message}&quot;
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <EmptyState heading="No Mentions" message="No mentions found for this influencer" actionRequired={false} icon={<FaFacebook size={50} color="#1877F2" />} />
              </Box>
            ))}
        </Box>
        {!isLoading && !aiMediaReportLoading && <TrackerChatbot tracker_name={username} tracker_platform="facebook" type={AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS} />}
      </DashboardLayout>
    </>
  );
};

export default FacebookAccountTracking;
