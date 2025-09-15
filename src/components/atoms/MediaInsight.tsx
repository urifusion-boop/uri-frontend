import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FaUserAlt } from "react-icons/fa";
import {
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdSentimentSatisfiedAlt,
} from "react-icons/md";
import { DateHelper } from "../../helpers/DateHelper";
import {
  CommentSentimentAnalysis,
  MediaInsightResponse,
} from "../../models/dtos/InstagramInsights";
import PostInsights from "./PostInsights";
import React from "react";
import PostMetricsChart from "../charts/PostMetricsChart";
import SentimentScatterChart from "../charts/SentimentScatterChart";
import { MetricVariantEnum } from "@/models/enum-models/MetricEnum";
import { TextHelper } from "@/helpers/TextHelper";

interface IProps {
  sentimentData: CommentSentimentAnalysis | null;
  clearSelected?: () => void;
  mediaTypeData?: MediaInsightResponse;
  mediaLoading: boolean;
  variant?: MetricVariantEnum;
}

const MediaInsight: React.FC<IProps> = ({
  sentimentData,
  clearSelected,
  mediaTypeData,
  mediaLoading,
  variant,
}) => {
  const isTablet = useMediaQuery("(max-width:1200px)");

  const isMobile = useMediaQuery("(max-width:800px)");

  const getSentimentPercentage = (sentiment: string): number => {
    if (!sentimentData?.comments_with_sentiment) return 0;

    const totalComments = sentimentData.comments_with_sentiment
      ? sentimentData.comments_with_sentiment.length
      : 0;

    const sentimentCount = sentimentData.comments_with_sentiment
      ? sentimentData.comments_with_sentiment.filter(
          (comment) => comment?.sentiment?.sentiment === sentiment
        ).length
      : 0;

    const percentage = (sentimentCount / totalComments) * 100;

    return Math.min(Math.floor(percentage * 10) / 10, 100);
  };

  const barChartMediaData = mediaTypeData?.insights?.map((item) => {
    return {
      name: item.name,
      value: item.values.find((a) => a.value)?.value ?? 0,
      title: item.title,
      description: item.description,
    };
  });

  return (
    <>
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <IconButton
          onClick={() => {
            if (clearSelected) clearSelected();
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#333" }} />
        </IconButton>
        <Typography fontSize={isTablet ? 20 : 24} fontWeight={600} variant="h4">
          {TextHelper.capitalize(variant)} Sentiments
        </Typography>
      </Box>
      {mediaLoading ? (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={9}>
            <Skeleton animation="wave" variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Skeleton animation="wave" variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Skeleton animation="wave" variant="rectangular" height={50} />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Skeleton animation="wave" variant="rectangular" height={50} />
          </Grid>

          <Grid item xs={12}>
            <Skeleton animation="wave" variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Skeleton animation="wave" variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Skeleton animation="wave" variant="rectangular" height={300} />
          </Grid>
        </Grid>
      ) : (
        <>
          {variant !== MetricVariantEnum.TAGS ? (
            <>
              <Box
                p={3}
                mt={2}
                mb={2}
                display={"grid"}
                gap={2}
                gridTemplateColumns={isMobile ? "1fr" : "70% 1fr"}
                border="1px solid #ddd"
                borderRadius={2}
                bgcolor="white"
              >
                <PostMetricsChart barChartMediaData={barChartMediaData ?? []} />
              </Box>
              <PostInsights keyInsights={mediaTypeData?.insights ?? []} />
            </>
          ) : null}

          {/* Sentiments */}
          {variant !== MetricVariantEnum.STORIES && (
            <Box
              display={"grid"}
              gap={2}
              alignItems={"stretch"}
              gridTemplateColumns={isMobile ? "1fr" : "repeat(1, 1fr)"}
            >
              <Grid
                display="grid"
                gridTemplateColumns={
                  isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "50% 50% 1fr"
                }
                gap={"1%"}
                mt={2}
              >
                <Box
                  p={3}
                  border="1px solid #ddd"
                  borderRadius={2}
                  bgcolor="white"
                >
                  <Box alignItems={"center"} gap={1}>
                    <Typography fontSize={isMobile ? 16 : 18} variant="h6">
                      Comment Sentiment Summary
                    </Typography>
                  </Box>
                  <Box
                    display={"grid"}
                    gridTemplateColumns={"repeat(1, 1fr)"}
                    padding={1}
                  >
                    <Box>
                      <Typography>
                        Categorizes feedback based on emotional tone, to
                        understand how users feel about the content. This
                        breakdown shows the proportion of comments expressing
                        positive, neutral, or negative sentiments, offering a
                        clear view of overall audience reactions.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {sentimentData?.comments_with_sentiment ? (
                  <Box
                    p={3}
                    border="1px solid #ddd"
                    borderRadius={2}
                    bgcolor="white"
                  >
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      <Typography fontSize={isMobile ? 16 : 18} variant="h6">
                        Sentiment Score Distribution
                      </Typography>
                    </Box>
                    <Box
                      display={"grid"}
                      gridTemplateColumns={"repeat(3, 1fr)"}
                      padding={2}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        borderRight={isMobile ? "none" : "1px solid gray"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <MdSentimentSatisfiedAlt size={24} />
                        <Box>
                          <Typography
                            fontSize={isMobile ? 14 : 16}
                            fontWeight={600}
                            variant="h6"
                          >
                            Positive
                          </Typography>
                          <Typography
                            fontSize={isMobile ? 12 : 16}
                            variant="h6"
                          >
                            {sentimentData?.comments_with_sentiment
                              ? sentimentData?.comments_with_sentiment.filter(
                                  (comment) =>
                                    comment?.sentiment?.sentiment === "positive"
                                ).length
                              : 0}{" "}
                            (
                            {sentimentData
                              ? getSentimentPercentage("positive")
                              : 0}
                            %)
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        borderRight={isMobile ? "none" : "1px solid gray"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <MdSentimentDissatisfied size={24} />
                        <Box>
                          <Typography
                            fontSize={isMobile ? 14 : 16}
                            fontWeight={600}
                            variant="h6"
                          >
                            Negative
                          </Typography>
                          <Typography
                            fontSize={isMobile ? 12 : 16}
                            variant="h6"
                          >
                            {sentimentData?.comments_with_sentiment
                              ? sentimentData?.comments_with_sentiment.filter(
                                  (comment) =>
                                    comment?.sentiment?.sentiment === "negative"
                                ).length
                              : 0}{" "}
                            (
                            {sentimentData
                              ? getSentimentPercentage("negative")
                              : 0}
                            %)
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={1}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <MdSentimentNeutral size={24} />
                        <Box>
                          <Typography
                            fontSize={isMobile ? 14 : 16}
                            fontWeight={600}
                            variant="h6"
                          >
                            Neutral
                          </Typography>
                          <Typography
                            fontSize={isMobile ? 12 : 16}
                            variant="h6"
                          >
                            {sentimentData?.comments_with_sentiment
                              ? sentimentData?.comments_with_sentiment.filter(
                                  (comment) =>
                                    comment?.sentiment?.sentiment === "neutral"
                                ).length
                              : 0}{" "}
                            (
                            {sentimentData
                              ? getSentimentPercentage("neutral")
                              : 0}
                            %)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    p={3}
                    border="1px solid #ddd"
                    borderRadius={2}
                    bgcolor="white"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Typography variant="h6">
                      No sentiment data available
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Box>
          )}
          {sentimentData?.comments_with_sentiment &&
            sentimentData.comments_with_sentiment.length > 0 && (
              <Grid
                display="grid"
                gridTemplateColumns={
                  isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "50% 50% 1fr"
                }
                gap={"1%"}
                mt={2}
              >
                <Box
                  p={3}
                  border="1px solid #ddd"
                  borderRadius={2}
                  bgcolor="white"
                  display={"grid"}
                  gridTemplateRows={"auto 1fr"}
                  marginTop={2}
                >
                  <Typography fontSize={isMobile ? 16 : 18} variant="h6">
                    Comments
                  </Typography>

                  <Box
                    sx={{
                      overflowY: "scroll", // Scroll only on Y-axis
                      maxHeight: "400px",
                      "&::-webkit-scrollbar": {
                        width: "2px", // Set the scrollbar width to be very thin
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#F2F2F2", // Set a custom color for the scrollbar thumb
                        borderRadius: "2px", // Round the scrollbar edges
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f1f1f1", // Light background for the scrollbar track
                      },
                    }}
                  >
                    {sentimentData?.comments_with_sentiment?.map(
                      (item, index) => (
                        <Box
                          key={index}
                          display={"flex"}
                          alignItems={"center"}
                          gap={2}
                          paddingBlock={2}
                        >
                          <FaUserAlt size={24} />
                          <Box>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                              <Typography
                                variant="h6"
                                fontSize={15}
                                color="#CD1B78"
                              >
                                {item.username}
                              </Typography>
                              <Typography fontSize={14}>{item.text}</Typography>
                            </Box>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={1}
                              marginTop={1}
                            >
                              <Typography fontSize={14} color={"gray"}>
                                {item.replies?.data
                                  ? item.replies?.data?.length
                                  : 0}{" "}
                                {(item.replies?.data
                                  ? item.replies?.data.length
                                  : 0) === 1
                                  ? "Reply"
                                  : "Replies"}
                              </Typography>
                              <Box
                                borderLeft={"1px solid gray"}
                                marginLeft={2}
                                paddingLeft={2}
                              >
                                <Typography fontSize={14} color={"gray"}>
                                  {DateHelper.formatDate(item.timestamp)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              gap: "12px",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                              borderRadius: "8px",
                            }}
                          >
                            <MdSentimentSatisfiedAlt
                              style={
                                item.sentiment.sentiment === "positive"
                                  ? {
                                      color: "#fff",
                                      background: "green",
                                    }
                                  : undefined
                              }
                              size={24}
                            />
                            <MdSentimentDissatisfied
                              style={
                                item.sentiment.sentiment === "negative"
                                  ? {
                                      color: "#fff",
                                      background: "red",
                                    }
                                  : undefined
                              }
                              size={24}
                            />
                            <MdSentimentNeutral
                              style={
                                item.sentiment.sentiment === "neutral"
                                  ? {
                                      color: "#fff",
                                      background: "dimgray",
                                    }
                                  : undefined
                              }
                              size={24}
                            />
                          </Box>
                        </Box>
                      )
                    )}
                  </Box>
                </Box>

                <Box
                  p={3}
                  border="1px solid #ddd"
                  borderRadius={2}
                  bgcolor="white"
                  display={"grid"}
                  gridTemplateRows={"auto 1fr"}
                  marginTop={2}
                >
                  <SentimentScatterChart
                    sentimentData={sentimentData?.comments_with_sentiment ?? []}
                  />
                </Box>
              </Grid>
            )}
        </>
      )}
    </>
  );
};

export default MediaInsight;
