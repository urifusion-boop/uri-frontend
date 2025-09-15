import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";

interface DynamicWebRendererProps {
  url: string; // The URL of the page to render
}

const IframeContainer = styled(Box)({
  width: "100%",
  height: "600px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  overflow: "hidden",
  position: "relative",
});

const DynamicWebRenderer: React.FC<DynamicWebRendererProps> = ({ url }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const handleIframeError = () => {
    setIsBlocked(true); // Set to true if iframe fails to load
  };

  return (
    <Box sx={{ textAlign: "center", padding: "2rem" }}>
      <IframeContainer>
        {!isBlocked ? (
          <iframe
            src={url}
            title="Dynamic Web Content"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "8px",
            }}
            sandbox="allow-scripts allow-same-origin"
            onError={handleIframeError} // Detect embedding restrictions
          />
        ) : (
          <Box sx={{ padding: "2rem" }}>
            <Typography variant="body1" color="textSecondary">
              This content cannot be embedded directly. Click the link below to
              view it in a new tab.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Open in New Tab
              </Typography>
            </Box>
          </Box>
        )}
      </IframeContainer>
    </Box>
  );
};

export default DynamicWebRenderer;
