import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  FaPlay,
  FaRedo,
  FaClock,
  FaRegEye,
  FaThumbsUp,
  FaBookmark,
  FaPaperPlane,
} from "react-icons/fa"; // Added FaThumbsUp for Likes
import { FaChartBar, FaComment, FaPersonWalking } from "react-icons/fa6";
import { MdOutlineAutoGraph } from "react-icons/md";
import { PiFilmReelFill } from "react-icons/pi";

// Interface for the metric data
interface Metric {
  name: string;
  value: number;
  description: string;
}

interface PostMetricsProps {
  metrics: Metric[];
}

// Helper function to format numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

const PostMetricsCard: React.FC<PostMetricsProps> = ({ metrics }) => {
  const isMobile = useMediaQuery("(max-width:800px)");

  const getMetricIcon = (metricName: string) => {
    const lowerCaseMetric = metricName.toLowerCase();

    switch (true) {
      case lowerCaseMetric.includes("video"):
        return <PiFilmReelFill size={20} color="#8A2BE2" />;
      case lowerCaseMetric.includes("replay"):
        return <FaRedo size={20} color="#f39c12" />;
      case lowerCaseMetric.includes("play"):
        return <FaPlay size={20} color="#32CD32" />;
      case lowerCaseMetric.includes("follows"):
        return <FaPersonWalking size={20} color="#f39c12" />;
      case lowerCaseMetric.includes("watch"):
        return lowerCaseMetric === "average watch time (ms)" ? (
          <FaClock size={20} color="#9b59b6" />
        ) : (
          <FaClock size={20} color="#3498db" />
        );
      case lowerCaseMetric.includes("comments"):
        return <FaComment size={20} color="#f39c12" />;
      case lowerCaseMetric.includes("share"):
        return <FaPaperPlane size={20} color="#3498db" />;
      case lowerCaseMetric.includes("engagement"):
        return <FaChartBar size={20} color="#3498db" />;
      case lowerCaseMetric.includes("interactions"):
        return <FaChartBar size={20} color="#3498db" />;
      case lowerCaseMetric.includes("like"):
        return <FaThumbsUp size={20} color="#e67e22" />;
      case lowerCaseMetric.includes("reach"):
        return <MdOutlineAutoGraph size={24} color="#008080" />;
      case lowerCaseMetric.includes("saved"):
        return <FaBookmark size={22} color="#cd1b78" />;

      default:
        return <FaRegEye size={20} color="#e74c3c" />;
    }
  };

  return (
    <Box mt={5}>
      <Typography fontSize={isMobile ? 14 : 18} fontWeight={600}>
        Post Metrics
      </Typography>

      <Box display="flex" flexWrap="wrap" mt={2}>
        {metrics.map((metric, index) => (
          <Box
            key={index}
            p={2}
            m={1}
            borderRadius={2}
            border="1px solid #f0f0f0"
            bgcolor="#fafafa"
            width={isMobile ? "100%" : "48%"}
            display="flex"
            alignItems="center"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.05)" // Reduced box-shadow
            sx={{
              backgroundColor: "#fff",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Slightly increased on hover
              },
            }}
          >
            {/* Icon */}
            <Box mr={2}>{getMetricIcon(metric.name)}</Box>

            {/* Metric Information */}
            <Box>
              <Typography variant="h6" fontSize={16} color="primary">
                {metric.name}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Value: {formatNumber(metric.value)}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                fontSize={"0.8rem"}
              >
                {metric.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PostMetricsCard;
