/* eslint-disable no-unused-vars */
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { CommentSentimentAnalysis } from "@/models/dtos/InstagramInsights";
import { DateHelper } from "@/helpers/DateHelper";
import { FaUserAlt } from "react-icons/fa";
import {
  MdSentimentSatisfiedAlt,
  MdSentimentDissatisfied,
  MdSentimentNeutral,
} from "react-icons/md";
import SentimentScatterChart from "../charts/SentimentScatterChart";

export default function CommentSentiment(
  sentimentData: Readonly<CommentSentimentAnalysis>
) {
  const isTablet = useMediaQuery("(max-width:1200px)");

  const isMobile = useMediaQuery("(max-width:800px)");
  return (
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
          {sentimentData.comments_with_sentiment.map((item, index) => (
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
                  <Typography variant="h6" fontSize={15} color="#CD1B78">
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
                    {item.replies?.data?.length ?? 0}{" "}
                    {(item.replies?.data?.length ?? 0) === 1
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
          ))}
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
  );
}
