import { Bar, BarChart, Line, LineChart } from "recharts";
import { Box } from "@mui/material";
import Text from "../atoms/CustomText";
import { IoMdClock } from "react-icons/io";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 3400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 2000,
    pv: 98,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 800,
    amt: 2181,
  },
];

const renderChart = (type: string) => {
  switch (type) {
    case "bar-chart":
      return (
        <BarChart width={150} height={100} data={data}>
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      );
    case "clock":
      return (
        <Box>
          <IoMdClock size={100} color={"#CD1B78"} />
        </Box>
      );
    default:
      return (
        <LineChart width={150} height={100} data={data}>
          <Line type="monotone" dataKey="pv" stroke="#CD1B78" strokeWidth={2} />
        </LineChart>
      );
  }
};

function InsightCard({
  title,
  value,
  type = "line-chart",
}: Readonly<{
  title: string;
  value: string;
  type?: "bar-chart" | "line-chart" | "clock";
}>) {
  return (
    <Box
      bgcolor={"white"}
      justifyContent={"space-between"}
      display={"flex"}
      py={3}
      alignItems={"center"}
      borderRadius={2}
      gap={2}
      px={3}
    >
      <div>
        <Text weight={600} size={14}>
          {title}
        </Text>
        <Text weight={900} size={30}>
          {value}
        </Text>
      </div>
      {renderChart(type)}
    </Box>
  );
}

export default InsightCard;
