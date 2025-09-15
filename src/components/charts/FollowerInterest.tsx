import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  VictoryChart,
  VictoryPolarAxis,
  VictoryLine,
  VictoryTheme,
} from "victory";

const FollowerInterest = () => {
  const categories = [
    "Fashion",
    "Cosmetics",
    "Watches",
    "Others",
    "Memes",
    "Cars",
    "Technology",
  ];
  const dataTiktok = [
    { x: "Fashion", y: 65 },
    { x: "Cosmetics", y: 59 },
    { x: "Watches", y: 90 },
    { x: "Others", y: 81 },
    { x: "Memes", y: 56 },
    { x: "Cars", y: 55 },
    { x: "Technology", y: 78 },
  ];

  const dataTwitter = [
    { x: "Fashion", y: 50 },
    { x: "Cosmetics", y: 60 },
    { x: "Watches", y: 40 },
    { x: "Others", y: 30 },
    { x: "Memes", y: 75 },
    { x: "Cars", y: 50 },
    { x: "Technology", y: 70 },
  ];

  const dataFacebook = [
    { x: "Fashion", y: 40 },
    { x: "Cosmetics", y: 70 },
    { x: "Watches", y: 50 },
    { x: "Others", y: 45 },
    { x: "Memes", y: 80 },
    { x: "Cars", y: 60 },
    { x: "Technology", y: 60 },
  ];

  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <Box p={3} borderRadius={2} bgcolor="white" border="1px solid #ddd">
      <Typography variant="h6" fontSize={isMobile ? 14 : 16} mb={2}>
        Follower Interest
      </Typography>
      <Box marginTop={-6} marginBottom={-5}>
        <VictoryChart
          polar
          theme={VictoryTheme.material}
          height={190}
          width={200}
          domain={{ y: [0, 70] }}
        >
          {/* Polar Axis for each category */}
          <VictoryPolarAxis
            labelPlacement="perpendicular"
            tickValues={categories}
            style={{
              axisLabel: { padding: 20, fontSize: 12, fill: "#6c757d" },
              ticks: { stroke: "grey", size: 5 },
              tickLabels: { fontSize: 8, padding: 12 },
            }}
          />

          {/* Tiktok Line */}
          <VictoryLine
            data={dataTiktok}
            style={{
              data: { stroke: "#FFCE56", strokeWidth: 2 },
            }}
          />

          {/* Twitter Line */}
          <VictoryLine
            data={dataTwitter}
            style={{
              data: { stroke: "#36A2EB", strokeWidth: 2 },
            }}
          />

          {/* Facebook Line */}
          <VictoryLine
            data={dataFacebook}
            style={{
              data: { stroke: "#FF6384", strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </Box>
    </Box>
  );
};

export default FollowerInterest;
