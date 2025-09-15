import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

const ScrollableBarChart = () => {
  const data = [
    { x: 1, y: 5 },
    { x: 2, y: 10 },
    { x: 3, y: 7 },
    { x: 4, y: 12 },
    { x: 5, y: 15 },
    { x: 6, y: 9 },
    { x: 7, y: 11 },
    { x: 8, y: 8 },
    { x: 9, y: 14 },
    { x: 10, y: 6 },
    { x: 11, y: 13 },
    { x: 1, y: 5 },
    { x: 2, y: 10 },
    { x: 3, y: 7 },
    { x: 4, y: 12 },
    { x: 5, y: 15 },
    { x: 6, y: 9 },
    { x: 7, y: 11 },
    { x: 8, y: 8 },
    { x: 9, y: 14 },
    { x: 10, y: 6 },
    { x: 11, y: 13 },
    { x: 1, y: 5 },
    { x: 2, y: 10 },
    { x: 3, y: 7 },
    { x: 4, y: 12 },
    { x: 5, y: 15 },
    { x: 6, y: 9 },
    { x: 7, y: 11 },
    { x: 8, y: 8 },
    { x: 9, y: 14 },
    { x: 10, y: 6 },
    { x: 11, y: 13 },
    { x: 12, y: 5 },
    { x: 13, y: 7 },
    { x: 14, y: 12 },
    { x: 15, y: 15 },
    { x: 16, y: 9 },
    { x: 17, y: 11 },
    { x: 18, y: 8 },
    { x: 19, y: 14 },
    { x: 20, y: 6 },
    { x: 21, y: 13 },
  ];

  return (
    <div style={{ width: "100%", overflowX: "scroll" }}>
      <div style={{height: "500px" }}>
        {" "}
        {/* Adjust width based on data */}
        <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={data}
            style={{ data: { fill: "#CD1B78" } }} // Custom color
            alignment="start"
            barRatio={0.8}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default ScrollableBarChart;
