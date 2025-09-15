// CustomBarChart.tsx
import * as React from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { useMediaQuery } from "@mui/material";

// Define the structure of the data
interface BarChartData {
  name: string;
  value: number;
  title: string;
  description: string;
}

// Array of colors for dynamic color assignment
const dynamicColors = [
  "#4e79a7", // blue
  "#f28e2c", // orange
  "#e15759", // red
  "#76b7b2", // teal
  "#59a14f", // green
  "#edc949", // yellow
  "#af7aa1", // purple
  "#ff9da7", // pink
  "#9c755f", // brown
  "#bab0ab", // gray
];

const refactorWords = (word: string) =>
  word
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const validNames = new Set([
  "comments",
  "likes",
  "saved",
  "shares",
  "like",
  "reply",
  "quote",
  "impression",
  "retweet",
  "post_impressions",
  "post_impressions_unique",
  "post_video_views",
  "blue_reels_play_count",
  "fb_reels_replay_count",
  "fb_reels_total_plays",
  "post_impressions_unique",
  "post_video_followers",
]);

const CustomBarChart: React.FC<{ data: BarChartData[] }> = ({ data }) => {
  const chartData = data
    .filter((item) => validNames.has(item.name))
    .map((item, index) => ({
      x: refactorWords(item.name),
      y: item.value,
      label: `${item.title}: ${item.value}`,
      color: dynamicColors[index % dynamicColors.length],
    }));

  const isTablet = useMediaQuery("(max-width:1200px)");

  return (
    <VictoryChart
      domainPadding={10}
      style={{
        parent: {
          border: "none",
          marginTop: isTablet ? -20 : -40,
          marginBottom: isTablet ? -20 : -45,
        },
      }}
      height={150}
      padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
        style={{
          tickLabels: {
            fontSize: 5,
            fontFamily: "Plus Jakarta Sans",
            fill: "#000",
            fontWeight: 500,
            angle: -70,
            textAnchor: "end",
          },
          axis: { stroke: "none" },
          grid: { stroke: "none" },
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `${x}`}
        style={{
          tickLabels: {
            fontSize: 5,
            fontFamily: "Plus Jakarta Sans",
            fill: "#000",
            fontWeight: 500,
          },
          axis: { stroke: "none" },
          grid: { stroke: "#E0E0E0", strokeDasharray: 4, strokeWidth: 1 },
        }}
      />
      <VictoryBar
        data={chartData}
        labels={({ datum }) => datum.label}
        labelComponent={<VictoryTooltip flyoutStyle={{ fill: "white" }} />}
        style={{
          data: {
            fill: ({ datum }) => datum.color,
            width: 18,
            borderRadius: 4,
          },
          labels: { fontSize: 8, fill: "#000" },
        }}
        barWidth={20}
        animate={{
          duration: 1000,
          onLoad: { duration: 500 },
        }}
      />
    </VictoryChart>
  );
};

export default CustomBarChart;
