import { InsightHelper } from '@/helpers/InsightHelper';
import { AiMediaReportDto } from '@/models/dtos/AiMediaReportDto';
import { BusinessProfileInsight, DemographicInsights, InstagramBusinessProfile, InstagramUserInteractionMetrics } from '@/models/dtos/InstagramInsights';
import { Box, Grid } from '@mui/material';
import Achievements from '../atoms/Achievements';
import Activity from '../atoms/Activity';
import AudienceDemographic from '../atoms/AudienceDemographic';
import AudienceLocation from '../atoms/CountryDataTable';
import LoaderWrapper from '../atoms/LoaderWrapper';
import LatestPost from '../atoms/SocialPlatformAudience';
import AICalendar from '../calendars/AICalendar';
import ContentThemesCard from '../cards/ContentThemesCard';
import KeyTrendsCard from '../cards/KeyTrendsCard';
import PerformanceScoreCard from '../cards/PerformanceScoreCard';
import SuggestionsCard from '../cards/SuggestionsCard';
import LatestMediaEngagement from '../charts/LatestMediaEngagement';
import PostTypePieChart from '../charts/PostTypePieChart';
import ReachImpressionsChart from '../charts/ReachImpressionsChart';
import HashtagTable from '../tables/HashtagTable';

interface AllInsightsProps {
  instagramUserInteractionMetrics: InstagramUserInteractionMetrics[] | undefined;
  demographicData: DemographicInsights[] | null | undefined;
  postMedia: BusinessProfileInsight[];
  userDemographicData: DemographicInsights[] | null | undefined;
  aiMediaReport: AiMediaReportDto | null | undefined;
  data: InstagramBusinessProfile;
  isMobile: boolean;
  isTablet: boolean;
  isLoading?: boolean;
}

const getGridTemplateColumns = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) return '1fr';
  if (isTablet) return 'repeat(2,1fr)';
  return 'repeat(2,1fr)';
};

const AllInsights = ({ aiMediaReport, demographicData, instagramUserInteractionMetrics, postMedia, userDemographicData, data, isMobile, isTablet, isLoading }: AllInsightsProps) => {
  const pieData = InsightHelper.prepareChartData(postMedia)?.pieChartData?.map((data, index) => {
    return {
      x: data.media_type,
      y: data.count,
    };
  });

  const countryData = demographicData?.[0]?.total_value?.breakdowns?.[0]?.results?.map((data) => {
    return {
      country_code: data.dimension_values?.[0],
      value: data.value,
    };
  });

  return (
    <LoaderWrapper isLoading={isLoading} isGrid numberOfSkeletons={3} skeletonHeight="200px">
      {instagramUserInteractionMetrics && instagramUserInteractionMetrics.length > 0 && <ReachImpressionsChart data={instagramUserInteractionMetrics ?? []} removeImpression />}

      <Grid display="grid" gridTemplateColumns={isMobile ? '1fr' : '1fr 1fr'} gap={2} alignItems={'stretch'} mt={2}>
        {/* <ProfileLinksTaps /> */}
        <AudienceLocation data={countryData ?? []} />

        <LatestPost post={data?.media?.data} />

        {/* <AudienceLocation />
  <LatestTags /> */}
      </Grid>

      <Box bgcolor={'white'} my={2} p={2} borderRadius={2} position={'relative'} border="1px solid #ddd" gap={2} mt={2} display={isMobile ? 'block' : 'flex'}>
        <LatestMediaEngagement aggregateTimeSeriesData={InsightHelper.prepareBarChartData(postMedia)?.aggregatedData} />

        <Box
          p={3}
          className="md:mt-0"
          // maxWidth={'30%'}
          border="1px solid #ddd"
          borderRadius={2}
          bgcolor="white"
          alignItems={'center'}
        >
          <PostTypePieChart
            data={pieData} // Pass the pieData here
            xKey="x" // Key for x-axis (mapped to "media_type")
            yKey="y" // Key for y-axis (mapped to "count")
            title="Post Type Distribution"
            subtitle="This chart shows the distribution of post types across different categories."
            // description="This chart shows the distribution of post types across different categories."
            colorSet={['#CD1B78', '#DFDFDF', '#141416']}
          />
        </Box>
      </Box>

      <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, isTablet)} className="md:gap-[1%] gap-4" mt={2} mb={2}>
        <Achievements summary_and_achievements={aiMediaReport?.summary_and_achievements} />
        <Activity activityData={aiMediaReport?.activity_breakdown} />
      </Grid>
      {userDemographicData && userDemographicData.length > 0 && <AudienceDemographic data={userDemographicData} />}

      <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, isTablet)} className="md:gap-[1%] gap-4" mt={2}>
        {aiMediaReport?.hashtag_mention_frequency && <HashtagTable hashtagMentionFrequency={aiMediaReport?.hashtag_mention_frequency} />}

        {aiMediaReport?.weekly_campaign_calendar && <AICalendar weeklyCampaignCalendar={aiMediaReport?.weekly_campaign_calendar} />}
      </Grid>

      <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, isTablet)} className="md:gap-[1%] gap-4" mt={2}>
        {aiMediaReport?.industry_classification && aiMediaReport.performance_score_breakdown && (
          <PerformanceScoreCard industryClassification={aiMediaReport?.industry_classification ?? {}} performanceScoreBreakdown={aiMediaReport?.performance_score_breakdown ?? {}} />
        )}

        <SuggestionsCard improvement_suggestions={aiMediaReport?.improvement_suggestions} />
      </Grid>

      <Grid display="grid" gridTemplateColumns={getGridTemplateColumns(isMobile, isTablet)} className="md:gap-[1%] gap-4" mt={2}>
        {aiMediaReport?.key_trends && <KeyTrendsCard keyTrends={aiMediaReport?.key_trends?.slice(0, 3)} />}
        {aiMediaReport?.content_themes && <ContentThemesCard contentThemes={aiMediaReport?.content_themes?.slice(0, 3)} />}
      </Grid>

      {/* <Grid
        display="grid"
        gridTemplateColumns={getGridTemplateColumns(isMobile, isTablet)}
        gap={"1%"}
      >
        <SuggestionsCard
          improvement_suggestions={aiMediaReport?.improvement_suggestions}
        />

        <PerformanceOverviewCard
          performanceScores={
            aiMediaReport?.performance_score_breakdown?.performance_scores
          }
          averagePerformanceScore={
            aiMediaReport?.performance_score_breakdown
              ?.average_performance_score
          }
        />
      </Grid> */}
    </LoaderWrapper>
  );
};

export default AllInsights;
