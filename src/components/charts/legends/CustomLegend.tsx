import React from "react";
import { Box, Typography } from "@mui/material";

type LegendProps = {
  scale: Record<string, string>;
  isTablet?: boolean;
};

const CustomLegend: React.FC<LegendProps> = ({ scale, isTablet = false }) => {
  return (
    <Box
      display={"flex"}
      gap={2}
      marginTop={isTablet ? 2 : 0}
      sx={{
        flexWrap: "wrap",
      }}
    >
      {Object.keys(scale)
        .reverse()
        .map((label, index) => (
          <Box key={index} display={"flex"} alignItems={"center"} gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: scale[label as keyof typeof scale],
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Diamond shape
              }}
            />
            <Typography fontWeight={500} fontSize={12}>
              {label}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default CustomLegend;
