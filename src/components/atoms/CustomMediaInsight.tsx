import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PostMetricsChart from "../charts/PostMetricsChart";

interface CustomMediaInsightProps {
  onBack?: () => void;
  title: string;
  barChartData: {
    name: string;
    value: number;
    title: string;
    description: string;
  }[];
}

const CustomMediaInsight = ({
  onBack,
  title,
  barChartData,
}: CustomMediaInsightProps) => {
  const isTablet = useMediaQuery("(max-width:1200px)");

  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <IconButton onClick={() => onBack && onBack()}>
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#333" }} />
        </IconButton>
        <Typography fontSize={isTablet ? 20 : 24} fontWeight={600} variant="h4">
          {title}
        </Typography>
      </Box>
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
        <PostMetricsChart barChartMediaData={barChartData ?? []} />
      </Box>
    </Box>
  );
};

export default CustomMediaInsight;
