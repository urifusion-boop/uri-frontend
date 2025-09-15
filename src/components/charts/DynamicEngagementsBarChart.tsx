import * as React from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";
import { LightThemeColors } from "@/configs/colors.config";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { chartsGridClasses } from "@mui/x-charts/ChartsGrid";
import { useDrawingArea, useXScale, useYScale } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

interface DynamicEngagementBarChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  loading?: boolean;
  loadingType?: "skeleton" | "placeholder";
  noYLabel?: boolean;
  colors?: string[];
  gridVertical?: boolean;
  gridHorizontal?: boolean;
  width?: number;
  height?: number;
  tickPlacement?: "end" | "start" | "middle" | "extremities";
  tickLabelPlacement?: "tick" | "middle";
}

// Styled components for placeholder loading
const LoadingRect = styled("rect")({
  opacity: 0.2,
  fill: "lightgray",
});

const LoadingText = styled("text")(({ theme }) => ({
  stroke: "none",
  fill: theme.palette.text.primary,
  shapeRendering: "crispEdges",
  textAnchor: "middle",
  dominantBaseline: "middle",
}));

function PlaceholderLoadingOverlay() {
  const xScale = useXScale<"band">();
  const yScale = useYScale();
  const { left, width, height } = useDrawingArea();

  const bandWidth = xScale.bandwidth();
  const [bottom, top] = yScale.range();
  const ratios = [0.2, 0.8, 0.6, 0.5];

  return (
    <g>
      {xScale.domain().map((item, index) => {
        const ratio = ratios[index % ratios.length];
        const barHeight = ratio * (bottom - top);
        return (
          <LoadingRect
            key={"s" + index}
            x={xScale(item)}
            width={bandWidth}
            y={bottom - barHeight}
            height={barHeight}
          />
        );
      })}
      <LoadingText x={left + width / 2} y={top + height / 2}>
        Loading data...
      </LoadingText>
    </g>
  );
}

const DynamicEngagementBarChart: React.FC<DynamicEngagementBarChartProps> = ({
  data,
  loading,
  loadingType = "skeleton",
  noYLabel,
  colors = [LightThemeColors.uriColor, "#59a14f"],
  gridVertical,
  gridHorizontal,
  width,
  height,
  tickPlacement,
  tickLabelPlacement,
}) => {
  if (loading) {
    if (loadingType === "placeholder") {
      return (
        <Box
          sx={{
            overflowX: "auto",
            paddingBottom: 2,
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#d8d8d8",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
            pl: 2,
          }}
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <BarChart
            height={height ?? 300}
            width={width ?? 900}
            loading
            xAxis={[
              {
                scaleType: "band",
                data: ["A", "B", "C", "D", "E", "F", "G", "H"],
              },
            ]}
            slots={{ loadingOverlay: PlaceholderLoadingOverlay }}
            series={[]}
            margin={{ top: 10, right: 10, left: 25, bottom: 25 }}
          />
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        overflowX: "auto",
        paddingBottom: 2,
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d8d8d8",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        pl: 2,
      }}
      style={{ maxWidth: "100%", overflowX: "auto", width: "100%" }}
    >
      <BarChart
        height={height ?? 300}
        width={width}
        series={[{ label: "values", data: data.map((point) => point.value) }]}
        colors={colors}
        slotProps={{ legend: { hidden: true } }}
        xAxis={[
          {
            scaleType: "band",
            data: data.map((point) => {
              const date = new Date(point.date);
              return isNaN(date.getTime())
                ? point.date
                : `${dayjs(date).format("MMM DD")}`;
            }),
            tickLabelPlacement: tickLabelPlacement,
            tickPlacement: tickPlacement,
          },
        ]}
        yAxis={noYLabel ? [] : [{ label: "Daily Frequency", position: "left" }]}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translate(-10px, 0)",
          },
          [`& .${chartsGridClasses.line}`]: {
            strokeDasharray: "5 3",
            strokeWidth: 2,
          },
        }}
        grid={{ vertical: gridVertical, horizontal: gridHorizontal }}
      />
    </Box>
  );
};

export default DynamicEngagementBarChart;
