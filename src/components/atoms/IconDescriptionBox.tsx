import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";

const IconDescriptionBox = ({
  icon,
  description,
}: {
  icon: React.ReactNode;
  description: string;
}) => {
  return (
    <Box
      display={"flex"}
      bgcolor={"#f9f9fb"}
      width={"fit-content"}
      alignItems={"center"}
      padding={1}
      border={"1px solid #e0e0e0"}
      borderRadius={2}
      gap={1}
    >
      {icon}
      <Typography fontWeight={600} fontSize={14}>
        {description}
      </Typography>
      <KeyboardArrowDownIcon />
    </Box>
  );
};

export default IconDescriptionBox;
