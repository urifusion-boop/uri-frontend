import React from "react";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Box, Typography, Stack } from "@mui/material";
import { SingleSentimentData } from "@/models/dtos/TrackerDto";

type SentimentScatterChartProps = {
  sentimentData?: (SingleSentimentData | undefined)[];
};

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#ffeb3b",
  negative: "#f44336",
};

const SentimentScatterChart: React.FC<SentimentScatterChartProps> = ({
  sentimentData,
}) => {
  const seriesData = {
    positive: sentimentData
      ?.filter((item) => item?.sentiment?.sentiment === "positive")
      .map((item, index) => ({
        x: index + 1,
        y: item?.sentiment.score ?? 0,
        id: item?.id ?? 0,
        comment: item?.text,
        sentiment: "Positive",
      })),

    neutral: sentimentData
      ?.filter((item) => item?.sentiment?.sentiment === "neutral")
      .map((item, index) => ({
        x: index + 1,
        y: item?.sentiment.score ?? 0,
        id: item?.id ?? 1,
        comment: item?.text,
        sentiment: "Neutral",
      })),

    negative: sentimentData
      ?.filter((item) => item?.sentiment?.sentiment === "negative")
      .map((item, index) => ({
        x: index + 1,
        y: item?.sentiment.score ?? 0,
        id: item?.id ?? 2,
        comment: item?.text,
        sentiment: "Negative",
      })),
  };

  const scatterSeries = [
    {
      label: "Positive",
      data: seriesData.positive,
      color: sentimentColors.positive,
      markerSize: 6, // Increase dot size
      valueFormatter: (point: any) =>
        `Comment: ${point.comment}\nSentiment: ${point.sentiment}`,
    },
    {
      label: "Neutral",
      data: seriesData.neutral,
      color: sentimentColors.neutral,
      markerSize: 6,
      valueFormatter: (point: any) =>
        `Comment: ${point.comment}\nSentiment: ${point.sentiment}`,
    },
    {
      label: "Negative",
      data: seriesData.negative,
      color: sentimentColors.negative,
      markerSize: 6,
      valueFormatter: (point: any) =>
        `Comment: ${point.comment}\nSentiment: ${point.sentiment}`,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
        Comment(s) Sentiment
      </Typography>

      <ScatterChart
        height={400}
        series={scatterSeries}
        yAxis={[{ min: -1, max: 1 }]}
        colors={[
          sentimentColors.positive,
          sentimentColors.neutral,
          sentimentColors.negative,
        ]}
        margin={{
          top: 20,
          right: 20,
          left: 50,
        }}
        tooltip={{
          trigger: "item",
        }}
        slotProps={{
          legend: { hidden: true },
        }}
      />

      {/* Display Custom Legends Below the Chart */}
      <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
        {Object.keys(seriesData).map((key) => (
          <Box key={key} display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor:
                  sentimentColors[key as keyof typeof sentimentColors],
                marginRight: 1,
              }}
            />
            <Typography fontSize={12} variant="body2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SentimentScatterChart;
