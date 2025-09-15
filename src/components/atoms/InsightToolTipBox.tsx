import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

function InsightToolTipBox({
  Icon,
  toolTipTitle,
  value,
  label,
  customComponent,
  showCustomComponent = false,
}: Readonly<{
  Icon?: React.ReactNode;
  toolTipTitle: string;
  value?: string;
  label?: string;
  customComponent?: React.ReactNode;
  showCustomComponent?: boolean;
}>) {
  return (
    <Tooltip
      style={{ cursor: "pointer", backgroundColor: "white" }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -14],
              },
            },
          ],
        },
      }}
      title={toolTipTitle}
    >
      <Box>
        {!showCustomComponent && (
          <Box display="flex" alignItems="center">
            {Icon}
            <Box ml={1}>
              <Typography fontSize={14} fontWeight={600}>
                {value}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {label}
              </Typography>
            </Box>
          </Box>
        )}
        {customComponent}
      </Box>
    </Tooltip>
  );
}

export default InsightToolTipBox;
