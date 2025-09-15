import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

interface IProps {
  color: string;
  size?: number;
  text?: string;
}

const Spinner: React.FC<IProps> = ({ color, size, text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: color ?? "#CD1B78" }} size={size ?? 20} />
      {text && (
        <Typography fontSize={size ? size * 0.5 : 12} sx={{ color: "#000" }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;
