import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { GoDotFill } from "react-icons/go";
import { LightThemeColors } from "@/configs/colors.config";

interface EngagementBarChartProps {
  data: Array<{
    postNumber: string;
    likes: number;
    comments: number;
    interactions: number;
  }>;
}

const EngagementBarChart: React.FC<EngagementBarChartProps> = ({ data }) => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Legend */}
      <Box display="flex" alignItems="center" justifyContent={"center"} gap={4}>
        <Box display="flex" alignItems="center">
          <GoDotFill size={14} color={LightThemeColors.uriColor} />
          <Typography
            fontSize={14}
            fontWeight={600}
            fontFamily="Plus Jakarta Sans"
            marginLeft={1}
          >
            Likes
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <GoDotFill size={14} color={"#949494"} />
          <Typography
            fontSize={14}
            fontWeight={600}
            fontFamily="Plus Jakarta Sans"
            marginLeft={1}
          >
            Comments
          </Typography>
        </Box>
      </Box>

      {/* Scrollable Chart Wrapper with Thin and Low-Opacity Scrollbar */}
      <Box
        sx={{
          overflowX: "auto",
          paddingBottom: 2,
          scrollbarWidth: "thin", // Firefox support
          "&::-webkit-scrollbar": {
            height: "3px", // **Extremely Thin**
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: `${LightThemeColors.uriColor}80`, // **Reduced Opacity**
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(240, 240, 240, 0.4)", // **Lighter Track**
          },
        }}
      >
        <BarChart
          height={300}
          width={Math.max(800, data.length * 60)} // Ensures chart does not squeeze
          series={[
            { label: "Likes", data: data.map((point) => point.likes) },
            { label: "Comments", data: data.map((point) => point.comments) },
          ]}
          colors={[LightThemeColors.uriColor, "#949494"]}
          slotProps={{ legend: { hidden: true } }}
          xAxis={[
            {
              scaleType: "band",
              data: data.map((point) => point.postNumber), // Using post numbers as x-axis
              tickLabelStyle: {
                fill: "#333",
                fontSize: 12,
                transform: "rotate(45deg)", // Rotate labels for better visibility
                textAnchor: "start", // Align properly after rotation
              },
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default EngagementBarChart;
