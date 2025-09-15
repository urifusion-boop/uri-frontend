import calculateGenderPercentages from "@/helpers/AudienceHelper";
import {
  DemographicInsightBreakdown,
  DemographicInsights,
} from "@/models/dtos/InstagramInsights";
import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useMemo } from "react";
import { GoDotFill } from "react-icons/go";

import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory";

const tabData = [
  {
    id: "followers",
    title: "Followers",
    value: "follower_demographics",
  },
  {
    id: "reached",
    title: "Reached",
    value: "reached_audience_demographics",
  },
];

function AudienceDemographic({
  data,
}: Readonly<{
  data: DemographicInsights[] | null | undefined;
}>) {
  const isMobile = useMediaQuery("(max-width:800px)");
  const [activeIndex, setActiveIndex] = React.useState(tabData[0]);

  const activeData = useMemo(() => {
    return data?.filter((data) => data.name === activeIndex.value);
  }, [data, activeIndex]);

  const percentages = calculateGenderPercentages(activeData);

  return (
    <Box
      borderRadius={2}
      sx={{
        width: "100%",
        mx: "auto",
        p: 3,
        backgroundColor: "#fff",
        mt: 1,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        border: "1px solid #E0E0E0",
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography fontSize={isMobile ? 16 : 18} variant="h6" mb={2}>
          {activeIndex.title} Audience Demographic
        </Typography>
        <Box
          bgcolor={"#F8F9FA"}
          marginBottom={2.5}
          padding={0.8}
          display={"grid"}
          gap={1}
          zIndex={99999}
          gridTemplateColumns={"1fr 1fr"}
          borderRadius={2}
        >
          {tabData.map(({ value, title, id }) => (
            <Box
              key={id}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              padding={0.8}
              bgcolor={activeIndex.value === value ? "white" : "transparent"}
              borderRadius={2}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveIndex({ id, value, title })}
            >
              <Typography
                fontSize={12}
                fontWeight={600}
                color={
                  activeIndex.value === value ? "#CD1B78" : "text.secondary"
                }
              >
                {title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Box marginTop={isMobile ? -4 : -12} marginBottom={isMobile ? -4 : -8}>
          <AudienceDemographicsChart
            data={activeData?.[0]?.total_value?.breakdowns ?? []}
          />
        </Box>
        <Box display={"flex"} gap={1} justifyContent={"center"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={1}
            border={"1px solid gray"}
            padding={1}
            borderRadius={2}
          >
            <GoDotFill color={"#CD1B78"} />
            <Typography fontSize={12} fontWeight={600} color={"text.secondary"}>
              Male, {percentages.malePercentage}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={1}
            border={"1px solid gray"}
            padding={1}
            borderRadius={2}
          >
            <GoDotFill color={"#DFDFDF"} />
            <Typography fontSize={12} fontWeight={600} color={"text.secondary"}>
              Female, {percentages.femalePercentage} %
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            fontSize={12}
            textAlign={"center"}
            marginTop={1}
            color={"text.secondary"}
          >
            Data is distributed between different age groups and gender.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ['#c43a31', '#00a2ee'];

const CustomLabel = (props: any) => {
  const { x, y, datum } = props;

  return (
    <foreignObject x={x - 4} y={y - 13} width={120} height={96}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "80px",
          textAlign: "center",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 9,
          height: 9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          color={datum.color || "black"}
          //   fontWeight={700}
          fontSize={3}
          textAlign={"center"}
        >
          {datum.value}
        </Typography>
      </Box>
    </foreignObject>
  );
};

const AudienceDemographicsChart = ({
  data,
}: {
  data: DemographicInsightBreakdown[] | [];
}) => {
  // Organize the data for plotting
  const ageGroups = [
    "13-17",
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+",
  ];

  const femaleData = data[0]?.results
    .filter((d) => d?.dimension_values[1] === "F")
    .map((d) => ({ age: d.dimension_values[0], value: d.value }));

  const maleData = data[0]?.results
    .filter((d) => d.dimension_values[1] === "M")
    .map((d) => ({ age: d.dimension_values[0], value: d.value }));

  return (
    <VictoryChart height={180} domainPadding={{ x: 20, y: 40 }}>
      <VictoryGroup offset={10} colorScale={["#CD1B78", "#DFDFDF"]}>
        <VictoryBar
          data={femaleData}
          x="age"
          y="value"
          barWidth={6}
          cornerRadius={{ topLeft: 3, topRight: 3 }}
          labels={({ datum }) => datum.value}
          labelComponent={<CustomLabel />}
        />
        <VictoryBar
          data={maleData}
          x="age"
          barRatio={0.8}
          barWidth={6}
          y="value"
          cornerRadius={{ topLeft: 3, topRight: 3 }}
          labels={({ datum }) => datum.value}
          labelComponent={<CustomLabel />}
        />
      </VictoryGroup>

      {/* Add custom axes */}
      <VictoryAxis
        tickValues={ageGroups}
        tickFormat={ageGroups}
        style={{
          tickLabels: { fontSize: 4, padding: 5 },
          axisLabel: {
            fontSize: 6, // Adjust font size for x-axis label
            paddingTop: -120,
          },
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `${x}`}
        style={{
          tickLabels: { fontSize: 4, padding: 5 },

          axisLabel: {
            fontSize: 6, // Adjust font size for y-axis label
            // paddingLeft: -20,
          },
        }}
      />
    </VictoryChart>
  );
};

// export default AudienceDemographicsChart;

export default AudienceDemographic;
