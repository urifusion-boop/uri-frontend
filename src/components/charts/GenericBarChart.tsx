import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { GoDotFill } from "react-icons/go";

interface Metric {
  label: string; // Label for the metric (e.g., "Likes", "Retweets")
  color: string; // Color for the metric
  dataKey: string; // Key to extract metric data from each data point
}

interface GenericBarChartProps {
  data: Array<Record<string, number | string>>; // Array of data points
  metrics: Metric[]; // Metrics to be displayed on the chart
  xAxisKey: string; // Key for the x-axis labels
}

const GenericBarChart: React.FC<GenericBarChartProps> = ({
  data,
  metrics,
  xAxisKey,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={4}>
        {metrics.map((metric, index) => (
          <Box display="flex" alignItems="center" key={index}>
            <GoDotFill size={14} color={metric.color} />
            <Typography
              fontSize={14}
              fontWeight={600}
              fontFamily="Plus Jakarta Sans"
              marginLeft={1}
            >
              {metric.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          overflowX: "auto",
          paddingBottom: 2,
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#2980b9",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
        style={{ maxWidth: "100%", overflowX: "auto" }}
      >
        <BarChart
          height={300}
          width={Math.max(800, data.length * 100)} // Adjust width dynamically
          series={metrics.map((metric) => ({
            label: metric.label,
            data: data.map((point) => point[metric.dataKey] as number), // Extract data dynamically
          }))}
          colors={metrics.map((metric) => metric.color)} // Apply dynamic colors
          slotProps={{ legend: { hidden: true } }}
          xAxis={[
            {
              scaleType: "band",
              data: data.map((point) => point[xAxisKey] as string), // Extract x-axis labels dynamically
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default GenericBarChart;
