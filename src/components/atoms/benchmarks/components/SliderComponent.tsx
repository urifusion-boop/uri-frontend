import { Box, Slider, Typography } from "@mui/material";
import { useState } from "react";

interface SliderProps {
  title: string;
  initialValue: number;
  color: string;
}

export const SliderComponent = ({
  title,
  initialValue,
  color,
}: SliderProps) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Typography sx={{}}>{title}</Typography>
      <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
        <Slider
          sx={{ color: color, height: "10px" }}
          size="medium"
          value={value}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={handleChange}
        />
        <Typography>{`${value}%`}</Typography>
      </Box>
    </Box>
  );
};
