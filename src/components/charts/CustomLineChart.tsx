import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography } from "@mui/material";
import CustomLegend from "./legends/CustomLegend";

// Define the type for the chart data
type LineChartData = {
  date: string; // Date for the x-axis
  [key: string]: number | string; // Other data series
};

type CustomLineChartProps = {
  data: LineChartData[]; // Array of data objects
  series: { dataKey: string; label: string; color: string }[]; // Configuration for data series
  title?: string; // Chart title
  subtitle?: string; // Chart subtitle
  description?: string; // Optional description of the chart
  width?: number; // Width of the chart
  height?: number; // Height of the chart
};

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  series,
  title = "Line Chart",
  subtitle,
  description,
  width = 700,
  height = 400,
}) => {
  const legendData = series.reduce<Record<string, string>>(
    (acc, { label, color }) => {
      acc[label] = color;
      return acc;
    },
    {}
  );

  // Extract x-axis labels
  const xLabels = data?.map((item) => item.date);

  return data ? (
    <Box sx={{ mx: "auto", textAlign: "center", mt: 4 }}>
      {/* Chart Title */}
      {title && (
        <Typography variant="h5" fontWeight="bold" mt={2} gutterBottom>
          {title}
        </Typography>
      )}
      {/* Chart Subtitle */}
      {subtitle && (
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {subtitle}
        </Typography>
      )}

      {/* Chart Description */}
      {description && (
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {description}
        </Typography>
      )}
      {/* Custom Legend */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CustomLegend scale={legendData} />
      </Box>
      {/* Line Chart */}
      <LineChart
        height={height}
        series={series.map(({ dataKey, label, color }) => ({
          data: data?.map((item) => item[dataKey] as number),
          color,
        }))}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            tickLabelStyle: {
              fontSize: 12,
              fontFamily: "Plus Jakarta Sans",
              fill: "#000",
              fontWeight: 600,
            },
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: {
              fontSize: 12,
              fontFamily: "Plus Jakarta Sans",
              fill: "#000",
              fontWeight: 600,
            },
            valueFormatter: (value) => Math.round(value).toString(),
          },
        ]}
      />
    </Box>
  ) : (
    <></>
  );
};

export default CustomLineChart;
