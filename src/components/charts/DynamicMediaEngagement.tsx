import { Box, Skeleton, Typography, useMediaQuery } from "@mui/material";
import GenericBarChart from "./GenericBarChart";
import { Tweet } from "@/models/dtos/TrackerDto";

interface DynamicMediaEngagementProps {
  postsData?: Tweet[]; // Accept undefined and optional properties
  title?: string; // Chart title
  subtitle?: string; // Chart subtitle
  loading?: boolean;
}

const DynamicMediaEngagement: React.FC<DynamicMediaEngagementProps> = ({
  postsData,
  title = "Engagement Metrics by Post", // Default title
  subtitle = "This graph shows the engagement metrics (retweets, likes, replies, and quotes) for each post.", // Default subtitle
  loading,
}) => {
  const isMobile = useMediaQuery("(max-width:800px)");

  // Safely transform the data, using post indices instead of dates
  const transformedData =
    postsData?.map((post, index) => ({
      index: `Post ${index + 1}`, // Use 1-based index as label
      likes: post.likes || 0,
      retweets: post.retweets || 0,
      replies: post.replies || 0,
      quotes: post.quotes || 0,
    })) || []; // Default to an empty array if postsData is undefined

  // Define metrics for GenericBarChart
  const metrics = [
    { label: "Likes", color: "#f28e2c", dataKey: "likes" },
    { label: "Retweets", color: "#59a14f", dataKey: "retweets" },
    { label: "Replies", color: "#4e79a7", dataKey: "replies" },
    { label: "Quotes", color: "#e15759", dataKey: "quotes" },
  ];

  return (
    <Box
      p={3}
      border="1px solid #ddd"
      borderRadius={2}
      maxWidth={isMobile ? "100%" : "70%"}
      bgcolor="white"
      width={isMobile ? "100%" : "auto"}
    >
      <Typography
        fontSize={isMobile ? 16 : 18}
        variant="h6"
        mb={2}
        fontWeight="bold"
        align="center" // Center the title
      >
        {title}
      </Typography>
      <Typography
        marginBottom={2}
        fontSize={16}
        variant="body2"
        color="textSecondary"
        align="center" // Center the subtitle
      >
        {subtitle}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Pass the transformed data and metrics to GenericBarChart */}
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="300px" />
        ) : (
          <GenericBarChart
            data={transformedData}
            metrics={metrics}
            xAxisKey="index"
          />
        )}
      </Box>
    </Box>
  );
};

export default DynamicMediaEngagement;
