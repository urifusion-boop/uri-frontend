import { Box, Typography, useMediaQuery } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import dayjs from "dayjs";
import React from "react";
import { GoDotFill } from "react-icons/go";

interface FacebookInsightBarChartProps {
  header?: string;
  subText?: string;
  legend?: {
    name: string;
    color: string;
  }[];
  date: string[];
  series: {
    label: string;
    data: number[];
  }[];
  maxWidth: string;
}

const FacebookInsightBarChart = ({
  header,
  subText,
  legend,
  date,
  maxWidth,
  series,
}: FacebookInsightBarChartProps) => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <Box
      p={3}
      border="1px solid #ddd"
      borderRadius={2}
      maxWidth={maxWidth}
      bgcolor="white"
    >
      {header && (
        <Typography fontSize={isMobile ? 16 : 18} variant="h6" mb={2}>
          {header}
        </Typography>
      )}

      {subText && (
        <Typography
          marginBottom={2}
          fontSize={16}
          variant="body2"
          color="textSecondary"
        >
          {subText}
        </Typography>
      )}
      <Box sx={{ width: "100%" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          gap={4}
        >
          {legend?.map((item, index) => (
            <Box display="flex" alignItems="center" key={index}>
              <GoDotFill size={14} color={item.color} />
              <Typography
                fontSize={14}
                fontWeight={600}
                fontFamily="Plus Jakarta Sans"
                marginLeft={1}
              >
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            overflowX: "auto",
            paddingBottom: 2,
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#2980b9",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          }}
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <BarChart
            height={300}
            width={2000}
            series={series}
            colors={["#f28e2c", "#59a14f"]}
            slotProps={{ legend: { hidden: true } }}
            xAxis={[
              {
                scaleType: "band",
                data: date
                  .map((point) => {
                    return dayjs(point).format("DD MMM YYYY");
                  })
                  .reverse(),
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FacebookInsightBarChart;
