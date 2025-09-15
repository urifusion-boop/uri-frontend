import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { VictoryPie, VictoryTooltip } from "victory";
import { FaDiamond } from "react-icons/fa6";

interface Breakdown {
  dimension_keys: string[];
}

interface TotalValue {
  value: number;
  breakdowns: Breakdown[];
}

interface MetricData {
  name: string;
  period: string;
  title: string;
  description: string;
  total_value: TotalValue;
  id: string;
}

const ProfileLinksTaps: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:800px)");

  const [endAngle, setEndAngle] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setEndAngle(360);
    }, 100);
  }, []);

  const data: MetricData = {
    name: "profile_links_taps",
    period: "day",
    title: "Profile links taps",
    description:
      "The number of taps on your business address, call button, email button and text button.",
    total_value: {
      value: 0,
      breakdowns: [
        {
          dimension_keys: [
            "Business Address",
            "Call Button",
            "Email Button",
            "Text Button",
          ],
        },
      ],
    },
    id: "17841464129861404/insights/profile_links_taps/day",
  };

  const tapsData = [
    { contact_button_type: "Business Address", taps: 5 },
    { contact_button_type: "Call Button", taps: 10 },
    { contact_button_type: "Email Button", taps: 3 },
    { contact_button_type: "Text Button", taps: 2 },
  ];

  const nonZeroBreakdowns = tapsData.filter((b) => b.taps > 0);

  if (nonZeroBreakdowns.length === 0) {
    return <p>No data available yet for Profile Links Taps</p>;
  }

  const pieData = nonZeroBreakdowns.map((b) => ({
    x: b.contact_button_type,
    y: b.taps,
  }));

  const colorScale = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

  const Keys = () => (
    <Box
      sx={{
        display: "grid",
        gap: 1,
        columnGap: 4,
        width: "100%",
        gridTemplateColumns: "repeat(2, 1fr)",
        marginTop: 2,
        maxWidth: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {pieData.map((data, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <FaDiamond size={16} color={colorScale[i]} />
          <Typography fontWeight={500} fontSize={10}>
            {data.x}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2} bgcolor="white">
      <Typography fontSize={isMobile ? 14 : 16} variant="h6" mb={2}>
        {data.title}
      </Typography>
      <Box
        // Reduced for a smaller donut
        maxWidth={isMobile ? "65%" : "65%"}
        maxHeight={isMobile ? "65%" : "65%"}
        marginRight="auto"
        position="relative"
        marginTop={7}
        marginLeft="auto"
      >
        <VictoryPie
          animate={{ duration: 1000 }}
          endAngle={endAngle}
          padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
          data={pieData}
          labelComponent={
            <VictoryTooltip
              cornerRadius={10}
              pointerLength={10}
              flyoutStyle={{ fill: "white" }}
            />
          }
          colorScale={colorScale}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          style={{
            labels: { fontSize: 12, fill: "black" },
          }}
        />
      </Box>
      <Keys />
    </Box>
  );
};

export default ProfileLinksTaps;
