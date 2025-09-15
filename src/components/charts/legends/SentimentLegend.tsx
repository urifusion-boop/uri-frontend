import React from "react";
import { Box } from "@mui/material";
import CustomLegend from "./CustomLegend";

const sentimentColorScale = {
  Negative: "#e74c3c",
  Neutral: "#f39c12",
  Positive: "#27ae60",
};

const SentimentLegend: React.FC = () => {
  return (
    <Box>
      <CustomLegend scale={sentimentColorScale} isTablet={false} />
    </Box>
  );
};

export default SentimentLegend;
