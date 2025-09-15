import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryGroup,
} from "victory";

const InfluencerGraph = () => {
  return (
    <VictoryChart domainPadding={20}>
      {/* Bar chart for likes, comments, shares */}
      <VictoryGroup offset={20} colorScale={"qualitative"}>
        <VictoryBar
          data={[
            { x: "2024-10-09", y: 31, label: "Likes" },
            { x: "2024-10-10", y: 2, label: "Likes" },
          ]}
        />
      </VictoryGroup>

      <VictoryAxis
        tickFormat={["2024-10-09", "2024-10-10"]} // Time-based tick labels
      />
      <VictoryAxis
        dependentAxis
        orientation="left"
        tickFormat={(t) => `${t}`}
      />
      <VictoryAxis
        dependentAxis
        // offsetX={350}
        orientation="right"
        tickFormat={(t) => `${t}`}
      />

      <VictoryLine
        data={[
          { x: "2024-10-09", y: 215 }, // Impressions
          { x: "2024-10-10", y: 35 },
        ]}
        style={{ data: { stroke: "#4caf50" } }}
      />

      <VictoryLine
        data={[
          { x: "2024-10-09", y: 127 }, // Reach
          { x: "2024-10-10", y: 34 },
        ]}
        style={{ data: { stroke: "#2196f3" } }}
      />
    </VictoryChart>
  );
};

export default InfluencerGraph;
