import { Box } from "@mui/material";
import {
  AxisConfig,
  ChartsGridProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
  LineChart,
  LineChartSlotProps,
  LineSeriesType,
  markElementClasses,
} from "@mui/x-charts";
import { AxisScaleConfig, MakeOptional } from "@mui/x-charts/internals";
import React from "react";

interface LineChartProps {
  colors?: string[];
  width?: number;
  height?: number;
  grid?: Pick<ChartsGridProps, "vertical" | "horizontal">;
  xAxis?: MakeOptional<
    AxisConfig<keyof AxisScaleConfig, any, ChartsXAxisProps>,
    "id"
  >[];
  series: MakeOptional<LineSeriesType, "type">[];
  markElement?: {
    display: boolean;
    strokeWidth: number;
    color?: string;
  };
  bottomAxis?: string | ChartsXAxisProps | null;
  leftAxis?: string | ChartsYAxisProps | null;
  slotProps?: LineChartSlotProps;
  loading?: boolean;
}

const ReusableLineChart = ({
  xAxis,
  series,
  markElement,
  width,
  height,
  grid,
  colors,
  bottomAxis,
  leftAxis,
  slotProps,
  loading,
}: LineChartProps) => {
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
      <LineChart
        loading={loading}
        xAxis={xAxis}
        series={series}
        sx={{
          [`& .${markElementClasses.root}`]: {
            stroke: "#8884d8",
            scale: "0.6",
            fill: markElement?.color ?? "#fff",
            strokeWidth: markElement?.strokeWidth,
            display: markElement?.display ? "block" : "none",
          },
        }}
        colors={colors}
        width={width}
        height={height}
        grid={{ vertical: grid?.vertical, horizontal: grid?.horizontal }}
        bottomAxis={bottomAxis}
        leftAxis={leftAxis}
        slotProps={slotProps}
      />
    </Box>
  );
};

export default ReusableLineChart;
