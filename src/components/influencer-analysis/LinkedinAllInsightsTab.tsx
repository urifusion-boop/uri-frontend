import { Box, Grid, Skeleton, useMediaQuery } from "@mui/material";
import KeyTrendsCard from "@/components/cards/KeyTrendsCard";
import ContentThemesCard from "@/components/cards/ContentThemesCard";
import AICalendar from "@/components/calendars/AICalendar";
import HashtagTable from "@/components/tables/HashtagTable";
import Achievements from "@/components/atoms/Achievements";
import Activity from "@/components/atoms/Activity";
import SuggestionsCard from "@/components/cards/SuggestionsCard";
import PerformanceScoreCard from "@/components/cards/PerformanceScoreCard";
import {
  LinkedinAiMediaReportDto,
  LinkedinFollowersStatisticsResponserDto,
} from "@/models/dtos/LinkedinInsightsDto";
import CustomLineChart from "../charts/CustomLineChart";
import dayjs from "dayjs";

interface LinkedinInsightsProps {
  linkedinAiMediaReport: LinkedinAiMediaReportDto | null | undefined;
  loading?: boolean;
  followersStatistics:
    | LinkedinFollowersStatisticsResponserDto
    | null
    | undefined;
}

const LinkedinAllInsightsTab = ({
  linkedinAiMediaReport,
  loading,
  followersStatistics,
}: LinkedinInsightsProps) => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const isTablet = useMediaQuery("(max-width:1200px)");

  const getGridTemplateColumns = (isMobile: boolean, isTablet: boolean) => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2,1fr)";
    return "50% 50% 1fr";
  };

  const lineChartData = followersStatistics?.elements
    ? followersStatistics.elements.slice(0, 61).map((item) => ({
        date: dayjs(item.timeRange.start).format("MMM DD"),
        page_follower_count: Math.max(
          item.followerGains.organicFollowerGain,
          0
        ),
      }))
    : [];

  if (loading)
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={200}
            animation="wave"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={200}
            animation="wave"
          />
        </Grid>
        <Grid item xs={12}>
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={200}
            animation="wave"
          />
        </Grid>
      </Grid>
    );

  return (
    <>
      <Box
        bgcolor={"white"}
        borderRadius={"8px"}
        paddingLeft={2}
        pt={2}
        paddingRight={2}
        pb={2}
      >
        <CustomLineChart
          data={lineChartData}
          series={[
            {
              dataKey: "page_follower_count",
              label: "Page Followers",
              color: "green",
            },
          ]}
          title="Page Followers over time"
          description="This graph shows the number of followers on the page over time."
        />
      </Box>
      {!!linkedinAiMediaReport && (
        <Box>
          <Grid
            display="grid"
            gridTemplateColumns={getGridTemplateColumns(isMobile, isTablet)}
            className="md:gap-[1%] gap-4"
            mt={2}
            mb={2}
          >
            <Achievements
              summary_and_achievements={
                linkedinAiMediaReport?.summary_and_achievements
              }
            />
            <Activity
              activityData={linkedinAiMediaReport?.activity_breakdown}
            />
          </Grid>

          <Grid
            display="grid"
            gridTemplateColumns={getGridTemplateColumns(isMobile, false)}
            gap={"1%"}
            mt={2}
          >
            {linkedinAiMediaReport?.industry_classification &&
              linkedinAiMediaReport.performance_score_breakdown && (
                <PerformanceScoreCard
                  industryClassification={
                    linkedinAiMediaReport?.industry_classification ?? {}
                  }
                  performanceScoreBreakdown={
                    linkedinAiMediaReport?.performance_score_breakdown ?? {}
                  }
                />
              )}

            <SuggestionsCard
              improvement_suggestions={
                linkedinAiMediaReport?.improvement_suggestions
              }
            />
          </Grid>

          <Grid
            display="grid"
            gridTemplateColumns={getGridTemplateColumns(isMobile, false)}
            gap={"1%"}
            mt={2}
          >
            {linkedinAiMediaReport?.hashtag_mention_frequency && (
              <HashtagTable
                hashtagMentionFrequency={
                  linkedinAiMediaReport?.hashtag_mention_frequency
                }
              />
            )}

            {linkedinAiMediaReport?.weekly_campaign_calendar && (
              <AICalendar
                weeklyCampaignCalendar={
                  linkedinAiMediaReport?.weekly_campaign_calendar
                }
              />
            )}
          </Grid>
          <Grid
            display="grid"
            gridTemplateColumns={getGridTemplateColumns(isMobile, false)}
            gap={"1%"}
            mt={2}
          >
            {linkedinAiMediaReport?.key_trends && (
              <KeyTrendsCard keyTrends={linkedinAiMediaReport?.key_trends} />
            )}
            {linkedinAiMediaReport?.content_themes && (
              <ContentThemesCard
                contentThemes={linkedinAiMediaReport.content_themes.slice(0, 3)}
              />
            )}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default LinkedinAllInsightsTab;
