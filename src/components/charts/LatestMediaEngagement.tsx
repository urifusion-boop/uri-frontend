import { Box, Typography, useMediaQuery } from "@mui/material";
import EngagementBarChart from "./EngagementBarChart";

interface LatestMediaEngagementProps {
  aggregateTimeSeriesData: Array<{
    postNumber: string;
    likes: number;
    comments: number;
    interactions: number;
  }>;
}

const LatestMediaEngagement: React.FC<LatestMediaEngagementProps> = ({
  aggregateTimeSeriesData,
}) => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <Box
      p={3}
      border="1px solid #ddd"
      borderRadius={2}
      maxWidth={isMobile ? "100%" : "68%"}
      bgcolor="white"
    >
      <Typography fontSize={isMobile ? 16 : 18} variant="h6" mb={2}>
        Last {aggregateTimeSeriesData?.length} Posts Engagement
      </Typography>
      <Typography
        marginBottom={2}
        fontSize={16}
        variant="body2"
        color="textSecondary"
      >
        This graph shows engagement metrics for the last 50 posts in order of
        posting.
      </Typography>
      <Box>
        <EngagementBarChart data={aggregateTimeSeriesData} />
      </Box>
    </Box>
  );
};

export default LatestMediaEngagement;
