import { Box } from "@mui/material";
import React from "react";

function ProgressLoader({ color = "black" }: Readonly<{ color?: string }>) {
  return <Box height={18} bgcolor={color} borderRadius={5} />;
}

export default ProgressLoader;
