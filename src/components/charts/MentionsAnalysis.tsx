import React from "react";
import { Box, Typography } from "@mui/material";
import {
  VictoryPie,
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryLegend,
} from "victory";

// Mock data for the mentions
const mentionData = [
  { x: "Spotify", y: 60.7, label: "Spotify 60.7%" },
  { x: "Apple Music", y: 36.7, label: "Apple Music 36.7%" },
  { x: "Google Play Music", y: 2.6, label: "Google Play Music 2.6%" },
];

// Mock data for mentions over time
const lineData = {
  spotify: [10000, 15000, 20000, 18000, 16000],
  appleMusic: [9000, 12000, 15000, 14000, 13000],
  googlePlayMusic: [1000, 1500, 2000, 2500, 3000],
  dates: ["Mar 10", "Mar 11", "Mar 12", "Mar 13", "Mar 14"],
};

const MentionsAnalysis = () => {
  return (
    <Box p={2} border="1px solid #ddd" borderRadius="8px" bgcolor="white">
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Mentions
      </Typography>

      <Box display="flex" justifyContent="space-between">
        {/* Pie Chart */}
        <VictoryPie
          data={mentionData}
          colorScale={["#4f94f7", "#66BB6A", "#FFA726"]}
          innerRadius={60}
          labelRadius={({ innerRadius }) =>
            typeof innerRadius === "number" ? innerRadius + 14 : 74
          }
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
          style={{ labels: { fontSize: 10, fill: "#555" } }}
        />

        {/* Line Chart for Mentions Over Time */}
        <VictoryChart height={200} width={300}>
          <VictoryLegend
            x={30}
            y={10}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Spotify", symbol: { fill: "#4f94f7" } },
              { name: "Apple Music", symbol: { fill: "#66BB6A" } },
              { name: "Google Play Music", symbol: { fill: "#FFA726" } },
            ]}
          />
          <VictoryAxis tickValues={lineData.dates} />
          <VictoryAxis dependentAxis />
          <VictoryLine
            data={lineData.dates.map((date, i) => ({
              x: date,
              y: lineData.spotify[i],
            }))}
            style={{ data: { stroke: "#4f94f7" } }}
          />
          <VictoryLine
            data={lineData.dates.map((date, i) => ({
              x: date,
              y: lineData.appleMusic[i],
            }))}
            style={{ data: { stroke: "#66BB6A" } }}
          />
          <VictoryLine
            data={lineData.dates.map((date, i) => ({
              x: date,
              y: lineData.googlePlayMusic[i],
            }))}
            style={{ data: { stroke: "#FFA726" } }}
          />
        </VictoryChart>
      </Box>
    </Box>
  );
};

export default MentionsAnalysis;
