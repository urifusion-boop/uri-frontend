import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";

interface IProps {
  sideNavOpen: boolean;
  toggleSideNav: () => void;
}

const BasicHeader = ({ title, legend }: { title: string; legend?: any }) => {
  const isTablet = useMediaQuery("(max-width:1200px)");

  return (
    <Box
      display={isTablet ? "block" : "flex"}
      justifyContent={"space-between"}
      marginTop={2}
      paddingTop={2}
      alignItems={"center"}
    >
      <Typography fontSize={14} variant="h6">
        {title}
      </Typography>
      {legend && <>{legend}</>}
    </Box>
  );
};

export default BasicHeader;
