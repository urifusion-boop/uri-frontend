import InsightToolTipBox from "@/components/atoms/InsightToolTipBox";
import Text from "@/components/atoms/CustomText";
import TopPost from "@/components/atoms/TopPost";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { FaComments } from "react-icons/fa6";
import WordCloudChart from "@/components/charts/WordCloudChart";
import DynamicEngagementBarChart from "@/components/charts/DynamicEngagementsBarChart";
import { LightThemeColors } from "@/configs/colors.config";
import Spinner from "@/components/loaders/Spinner";
import { TextHelper } from "@/helpers/TextHelper";
import PostTypePieChart from "@/components/charts/PostTypePieChart";
import HashtagCard from "@/components/hashtag-tracking/HashtagCard";
import { HiUsers } from "react-icons/hi2";
import { useMemo } from "react";
import {
  KeywordTrackerDailyFrequencyDto,
  KeywordTrackerPostTypeDto,
  KeywordTrackerTopPlatformsDto,
  KeywordTrackerTopWordsDto,
  KeywordTrackResponseDto,
  TrackerDto,
} from "@/models/dtos/TrackerDto";

interface AllInsightTabProps {
  postTypeData: KeywordTrackerPostTypeDto[] | null | undefined;
  postTypeDataLoading: boolean;

  dailyFrequencyLoading: boolean;
  keywordTrack: KeywordTrackResponseDto | null | undefined;
  keywordTrackLoading: boolean;
  engagements: number;

  currentTrackerData: TrackerDto | null | undefined;
  setActiveTab: (tab: string) => void;
  topWordsLoading: boolean;

  topPlatformsData: KeywordTrackerTopPlatformsDto[] | null | undefined;
  topPlatformsLoading: boolean;
  dailyFrequencyData: KeywordTrackerDailyFrequencyDto[] | null | undefined;
  topWordsData: KeywordTrackerTopWordsDto[] | null | undefined;
}

const AllInsightTab = ({
  postTypeData,
  postTypeDataLoading,
  dailyFrequencyLoading,
  keywordTrack,
  keywordTrackLoading,
  engagements,
  currentTrackerData,
  setActiveTab,
  topWordsLoading,
  topPlatformsData,
  topPlatformsLoading,
  dailyFrequencyData,
  topWordsData,
}: AllInsightTabProps) => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const dailyFrequency = useMemo(() => {
    return dailyFrequencyData?.map((data) => {
      return {
        date: data.date ?? "",
        value: data.count ?? 0,
      };
    });
  }, [dailyFrequencyData]);

  const topWords = useMemo(() => {
    return topWordsData?.map((data) => {
      return {
        text: data.word ?? "",
        value: (data.count ?? 0) * 15,
      };
    });
  }, [topWordsData]);

  const topPost = useMemo(() => {
    return (keywordTrack?.posts || []).slice(0, 4).map((post) => ({
      text: post?.text ?? "",
      date: post?.timestamp ?? "",
      image: post?.pagemap?.cse_image?.[0]?.src ?? "",
      username: TextHelper.getDomainName(post.platform),
    }));
  }, [keywordTrack]);

  return (
    <Box px={4} id="all-insights-tab" pb={10}>
      {/*  */}
      <Grid
        display={"grid"}
        gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "1fr 2.5fr"}
        gap={2}
        mt={4}
        container
      >
        <Box pt={3} borderRadius={2} gap={2} px={4} pb={3} bgcolor="white">
          <PostTypePieChart
            data={postTypeData as any}
            xKey="post_type"
            yKey="count"
            title="Post Distribution"
            subtitle="Distribution of post types"
            colorSet={[LightThemeColors.uriColor, "gray", "#333", "#fff"]}
            isLoading={postTypeDataLoading}
          />
        </Box>
        <Box
          py={5}
          borderRadius={2}
          gap={2}
          flexGrow={1}
          px={3}
          maxWidth={"full"}
          overflow={"auto"}
          bgcolor={"white"}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text weight={600} size={22} sx={{ textAlign: "center" }}>
              Daily Engagement Frequency
            </Text>
          </Box>
          <DynamicEngagementBarChart
            data={dailyFrequency ?? []}
            loading={dailyFrequencyLoading}
            loadingType="placeholder"
            gridHorizontal
            gridVertical
          />

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            paddingX={3}
            sx={{
              maxWidth: "440px",
              mx: "auto",
            }}
          >
            <InsightToolTipBox
              Icon={<FaComments size={24} color={LightThemeColors.uriColor} />}
              toolTipTitle="Total Results"
              value={(keywordTrack?.posts?.length ?? 0).toString()}
              label="Results"
            />
            <InsightToolTipBox
              Icon={<HiUsers size={24} color={LightThemeColors.uriColor} />}
              toolTipTitle="Total Users"
              value={(keywordTrack?.influencers?.length ?? 0).toString()}
              label="Users"
            />
            <InsightToolTipBox
              Icon={<FaHeart size={24} color={LightThemeColors.uriColor} />}
              toolTipTitle="Total Engagements"
              value={engagements.toString()}
              label="Engagements"
            />
          </Box>
        </Box>
      </Grid>

      {/* Top post and Hot Topics */}
      <Grid container py={3} spacing={2} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <TopPost
            posts={topPost}
            tabs={["Most Recent"]}
            seeAllBtn={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setActiveTab("posts");
            }}
            keywords={currentTrackerData?.keywords?.filter(
              (keyword) => keyword !== ""
            )}
            maxHeight="400px"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            py={3}
            borderRadius={2}
            gap={2}
            px={4}
            bgcolor={"white"}
            minHeight={"250px"}
            width={"100%"}
            height={"100%"}
          >
            <Text weight={600} size={22} sx={{ mb: 2 }}>
              Hot Topics
            </Text>

            {topWordsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Spinner
                  color={LightThemeColors.uriColor}
                  size={25}
                  text="Just a sec...."
                />
              </Box>
            ) : (
              <WordCloudChart
                words={topWords ?? []}
                height="300px"
                width="auto"
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Locations and top platform */}
      <Grid
        display={"grid"}
        gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(2, 1fr)"}
        py={3}
        borderRadius={2}
        gap={2}
        maxHeight={"400px"}
        mb={2}
      >
        <Box
          py={3}
          borderRadius="10px"
          gap={2}
          px={4}
          bgcolor={"white"}
          minHeight={"250px"}
          maxHeight="400px"
          width={"100%"}
          overflow={"auto"}
          className="scroll"
        >
          <HashtagCard
            data={(topPlatformsData ?? []).map((value) => ({
              platform: TextHelper.capitalize(value.platform ?? ""),
              count: value?.count ?? 0,
            }))}
            title="Platforms"
            headers={["Platform", "Count"]}
            isLoading={topPlatformsLoading}
            maxHeight="400px"
          />
        </Box>

        <Box
          py={3}
          borderRadius="10px"
          gap={2}
          px={4}
          bgcolor={"white"}
          minHeight={"250px"}
          maxHeight="400px"
          width={"100%"}
          overflow={"auto"}
          className="scroll"
        >
          <HashtagCard
            data={(keywordTrack?.influencers ?? []).map((value) => ({
              name: TextHelper.getLastItemOfUrl(value.name),
              type: value.type,
            }))}
            title="Influencers"
            headers={["Name", "Type"]}
            isLoading={keywordTrackLoading}
            maxHeight="400px"
          />
        </Box>
      </Grid>

      {/* Campaigns */}
      {/* {campaigns?.ai_insights && (
    <Grid
      display={isMobile ? "block" : "flex"}
      //   overflow={'scroll'}
      gridTemplateColumns={
        isMobile ? "repeat(1, 1fr)" : "repeat(2, 1fr)"
      }
      alignItems={"stretch"}
      py={3}
      borderRadius={2}
      gap={2}
    >
      <ContentThemesCard
        contentThemes={campaigns?.ai_insights?.content_themes ?? []}
      />
      <KeyTrendsCard keyTrends={campaigns?.ai_insights?.key_trends} />
    </Grid>
  )} */}
      {/* 
  {campaigns?.ai_insights && (
    <Grid
      display={"grid"}
      gridTemplateColumns={
        isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)"
      }
      py={3}
      overflow={"auto"}
      borderRadius={2}
      gap={2}
    >
      <TextListCard
        title="AI-Driven Recommendations"
        description="Leverage expert insights generated by AI to refine your campaigns. These recommendations are designed to help you increase audience engagement, improve visibility, and make informed decisions to optimize your strategy."
        items={campaigns?.ai_insights?.recommendations ?? []}
        variant="recommendations"
      />
      <TextListCard
        title="Engagement Drivers"
        description="Understand the key factors that are encouraging users to interact with your content. These insights reveal what resonates most with your audience, helping you create content that aligns with their preferences."
        items={campaigns?.ai_insights?.engagement_drivers ?? []}
        variant="engagementDrivers"
      />

      <TextListCard
        title="Engagement Opportunities"
        description="Discover untapped opportunities to enhance user engagement. These suggestions highlight areas where you can improve interactions, build stronger connections, and boost campaign success."
        items={campaigns?.ai_insights?.engagement_opportunities ?? []}
        variant="engagementOpportunities"
      />
    </Grid>
  )} */}

      {/* {campaigns?.ai_insights?.weekly_campaign_calendar && (
    <Grid py={3} borderRadius={2} gap={2}>
      <CampaignTable
        campaigns={
          campaigns?.ai_insights?.weekly_campaign_calendar ?? []
        }
      />
    </Grid>
  )} */}
    </Box>
  );
};

export default AllInsightTab;
