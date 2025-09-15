import React from "react";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";

interface EmptyStateProps {
  message?: string;
  buttonText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  actionRequired?: boolean;
  heading?: string;
  subtitle?: string;
  messageMaxWidth?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  buttonText = "Add",
  onAction,
  icon,
  actionRequired = true,
  heading,
  subtitle,
  messageMaxWidth,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
        padding: isMobile ? "20px" : "40px",
        gap: "20px",
      }}
    >
      {icon ? (
        <Box sx={{ mb: 2 }}>{icon}</Box>
      ) : (
        <Image
          src="/empty-state-icon.png"
          alt="Empty State"
          width={150}
          height={150}
        />
      )}

      {heading && (
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#495057",
            fontSize: isMobile ? "24px" : "32px",
          }}
        >
          {heading}
        </Typography>
      )}

      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            maxWidth: isMobile ? "90%" : "500px",
            color: "#6c757d",
          }}
        >
          {subtitle}
        </Typography>
      )}

      {message && (
        <Typography
          variant="h6"
          sx={{
            color: "#4a4a4a",
            maxWidth: messageMaxWidth ?? "100%",
            textAlign: "center",
            mx: "auto",
          }}
        >
          {message}
        </Typography>
      )}

      {actionRequired && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAction}
          sx={{
            width: isMobile ? "100%" : "auto",
            mt: 2,
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
