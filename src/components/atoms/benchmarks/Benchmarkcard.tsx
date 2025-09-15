import { Box, Typography } from "@mui/material";
import React from "react";

interface CardProps {
  title: string;
  icon: React.JSX.Element;
  amount: number | string;
  chart: React.JSX.Element;
}
const BenchmarkCard: React.FC<CardProps> = ({ title, icon, amount, chart }) => {
  return (
    <Box
      p={2}
      sx={{ width: "100%", display: "grid", gap: 1, justifyContent: "start" }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {icon}
        <Typography sx={{ fontWeight: 600, fontSize: 12 }}>{amount}</Typography>
      </Box>
      <Box sx={{ pt: 1, minWidth: "200px" }}>{chart}</Box>
    </Box>
  );
};

export default BenchmarkCard;
