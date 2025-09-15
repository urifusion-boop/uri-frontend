import React from "react";
import { Box, Button, Typography } from "@mui/material";

const FilterBar: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        borderBottom: "1px solid #EAEAEA",
        backgroundColor: "#F9FAFB",
      }}
    >
      <Button variant="outlined" size="small" sx={{ textTransform: "none" }}>
        Filters
      </Button>
      <Typography variant="body2" sx={{ fontWeight: "bold", color: "#6C757D" }}>
        Social Inbox
      </Typography>
      <Button
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#6200EA",
          color: "#FFF",
          textTransform: "none",
        }}
      >
        + Add Keyword
      </Button>
    </Box>
  );
};

export default FilterBar;
