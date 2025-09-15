import React from "react";
import { Box, Button } from "@mui/material";

const ExportButton: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "right",
        padding: "16px",
        borderTop: "1px solid #EAEAEA",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#6200EA",
          color: "#FFF",
          textTransform: "none",
        }}
      >
        Export Leads
      </Button>
    </Box>
  );
};

export default ExportButton;
