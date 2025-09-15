import { MediaInsightResponse } from "@/models/dtos/InstagramInsights";
import { Box, Typography } from "@mui/material";
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
} from "victory";

export function renderMediaBarChart(
  isMobile: boolean,
  barChartMediaData: { name: string; value: number }[],
  mediaTypeData: MediaInsightResponse
) {
  return (
    <Box
      p={3}
      border="1px solid #ddd"
      gridColumn={"span 2"}
      borderRadius={2}
      marginTop={2}
      marginBottom={2}
      bgcolor="white"
    >
      <VictoryChart
        height={200}
        style={{
          parent: {
            marginTop: isMobile ? -20 : -58,
          },
        }}
        theme={VictoryTheme.material}
        domainPadding={20}
      >
        <VictoryAxis
          style={{
            tickLabels: {
              fontSize: 6,
              fontFamily: "Plus Jakarta Sans",
              fill: "#000",
              fontWeight: 600,
            },

            grid: { stroke: "none" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {
              fontSize: 6,
              fontFamily: "Plus Jakarta Sans",
              fill: "#000",
              fontWeight: 600,
            },

            grid: { stroke: "none" },
          }}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={(x) => `${x}`}
          style={{
            tickLabels: {
              fontSize: 6,
              fontFamily: "Plus Jakarta Sans",
              fill: "#000",
              fontWeight: 600,
            },

            grid: { stroke: "none" },
          }}
        />

        <VictoryBar
          data={barChartMediaData}
          x="name"
          y="value"
          labels={({ datum }) => `${datum.value}`}
          labelComponent={<VictoryTooltip />}
          style={{
            data: { fill: "#CD1B78", width: 20 },
          }}
        />
      </VictoryChart>
      <Typography
        marginTop={isMobile ? -2 : -8}
        fontSize={16}
        fontWeight={400}
        variant="h6"
      >
        {String(mediaTypeData?.ai_report?.summary || "")}
      </Typography>
    </Box>
  );
}
