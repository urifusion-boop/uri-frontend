import React from "react";
import { Box, Typography, Menu, MenuItem, Button } from "@mui/material";

const MentionsDropdown: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="outlined"
        sx={{ textTransform: "none" }}
      >
        Select Keyword
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ marginTop: "8px" }}
      >
        {["Growth Machine", "Prospecting B2B", "Sales Automation"].map(
          (keyword) => (
            <MenuItem key={keyword} onClick={handleClose}>
              {keyword}
            </MenuItem>
          )
        )}
        <MenuItem onClick={handleClose} sx={{ color: "#6200EA" }}>
          + Add New Keyword
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MentionsDropdown;
