import React from "react";
import { Box, Typography } from "@mui/material";

const HeaderWarning: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFEBEB",
        padding: "8px 16px",
        textAlign: "center",
        borderBottom: "1px solid #FFCBCB",
      }}
    >
      <Typography variant="body2" sx={{ color: "#D9534F", fontWeight: "bold" }}>
        Your LinkedIn session has expired. Please reconnect.
      </Typography>
    </Box>
  );
};

export default HeaderWarning;
