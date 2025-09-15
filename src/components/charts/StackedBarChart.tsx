import React from "react";
import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
} from "victory";

// Sample data (you can modify it as per your actual data)
const data = [
  { date: "06/06", positive: 600, neutral: 300, negative: 200 },
  { date: "10/06", positive: 500, neutral: 250, negative: 150 },
  { date: "12/06", positive: 700, neutral: 350, negative: 250 },
  { date: "16/06", positive: 800, neutral: 400, negative: 200 },
  { date: "20/06", positive: 900, neutral: 450, negative: 300 },
  { date: "24/06", positive: 1100, neutral: 500, negative: 350 },
  { date: "28/06", positive: 1000, neutral: 550, negative: 400 },
];

// Format the data for each sentiment
const getFormattedData = (key: "positive" | "neutral" | "negative") =>
  data.map((item) => ({ x: item.date, y: item[key] }));

const legendData = [
  { name: "Positive", symbol: { fill: "#5cb85c" } },
  { name: "Neutral", symbol: { fill: "#f0ad4e" } },
  { name: "Negative", symbol: { fill: "#d9534f" } },
];

const axisStyles = {
  tickLabels: { fontSize: 10, angle: -45, textAnchor: "end" },
};

const dependentAxisStyles = {
  axisLabel: { padding: 30 },
  tickLabels: { fontSize: 10 },
};

const StackedBarChart: React.FC = () => (
  <VictoryChart
    theme={VictoryTheme.material}
    domainPadding={20}
    padding={{ top: 50, bottom: 60, left: 70, right: 30 }} // Adjust for proper padding
  >
    <VictoryLegend
      x={50}
      y={10}
      orientation="horizontal"
      gutter={20}
      style={{ labels: { fontSize: 12 } }}
      data={legendData}
    />

    <VictoryStack colorScale={["#5cb85c", "#f0ad4e", "#d9534f"]}>
      <VictoryBar data={getFormattedData("positive")} />
      <VictoryBar data={getFormattedData("neutral")} />
      <VictoryBar data={getFormattedData("negative")} />
    </VictoryStack>

    <VictoryAxis
      tickValues={data.map((item) => item.date)}
      tickFormat={data.map((item) => item.date)}
      style={{ ...axisStyles, grid: { stroke: "none" } }} // Remove inner grid lines
    />

    <VictoryAxis
      dependentAxis
      tickFormat={(x) => `${x}`}
      style={{ ...dependentAxisStyles, grid: { stroke: "none" } }}
    />
  </VictoryChart>
);

export default StackedBarChart;
