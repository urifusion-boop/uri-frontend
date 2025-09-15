import React from "react";
import { Box, Typography } from "@mui/material";
import PostMetricsCard from "../cards/PostMetricsCard";
import { Insight } from "@/models/dtos/InstagramInsights";

function refactorWords(word: string) {
  return word
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const PostInsights: React.FC<{
  keyInsights: Insight[] | [];
}> = ({ keyInsights }) => {
  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2} bgcolor="white">
      {keyInsights?.length > 0 ? (
        <PostMetricsCard
          metrics={keyInsights.map((metric) => ({
            ...metric,
            value:
              typeof metric.values?.[0]?.value === "number"
                ? metric.values?.[0]?.value
                : 0,
            name: refactorWords(metric.name),
            description: metric.description,
          }))}
        />
      ) : (
        <Box>
          <Typography>No post metric available</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostInsights;
