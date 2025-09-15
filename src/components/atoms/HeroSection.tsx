import React, { useState, useEffect } from "react";
import { Box, Fade, Typography, styled, useMediaQuery } from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch"; // Keyword Tracking
import FolderIcon from "@mui/icons-material/Folder"; // Content Management
import GroupIcon from "@mui/icons-material/Group"; // Account Tracking
import { LightThemeColors } from "@/configs/colors.config";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem 2rem",
  backgroundColor: "#F9F8F980",
  backgroundImage: "radial-gradient(#e0e0e0 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  textAlign: "center",
  boxSizing: "border-box",
});

const HighlightText = styled("span")({
  backgroundColor: LightThemeColors.uriColor,
  borderRadius: "5px",
  padding: "0 0.6rem", // Increased padding for emphasis
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.2em", // Slightly larger highlight text
});

const DashboardImage = styled(Box)({
  width: "220px", // Increased size
  height: "90px", // Increased size
  padding: "1.5rem", // Increased padding
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.1)", // Larger shadow
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const AnimatedTextContainer = styled(Box)({
  position: "relative",
  minHeight: "240px", // Increased height for more prominence
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 700,
});

const HeroSection: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const textOptions = [
    {
      text: "Empower, Your Business Growth with URI AI Driven Social Insights",
      highlight: "Your Business Growth",
    },
    {
      text: "Stay Connected to Conversations that Spark Important Changes",
      highlight: "Connected to Conversations",
    },
    // {
    //   text: "Drive Smarter Decisions with Real-Time Market Intelligence",
    //   highlight: "Smarter Decisions",
    // },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % textOptions.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, [textOptions.length]);

  const renderText = (textOption: (typeof textOptions)[0]) => {
    const parts = textOption.text.split(textOption.highlight);
    return (
      <Typography
        variant={isMobile ? "h3" : "h1"} // Larger text size for the main content
        lineHeight={1.8} // Adjusted line height
        sx={{
          fontWeight: "bold",
          fontSize: {
            xs: "28px", // Mobile size
            sm: "36px", // Tablet size
            md: "50px", // Desktop size
          },
          width: "100%",
          maxWidth: 700,
        }}
      >
        {parts[0]}
        <HighlightText>{textOption.highlight}</HighlightText>
        {parts[1]}
      </Typography>
    );
  };

  return (
    <Container className="md:min-h-[600px] md:max-h-[690px]">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        maxWidth="1100px" // Slightly wider for larger content
        mb={2}
      >
        {/* Left Column */}
        <Box
          flexDirection="column"
          gap="1.5rem" // Increased gap
          sx={{
            marginTop: "8rem",
            display: { xs: "none", lg: "flex" },
          }} // Increased top margin
        >
          <DashboardImage>
            <Typography
              variant="h6"
              fontSize={17}
              color="textSecondary"
              sx={{ mb: 1 }}
            >
              Lead Tracking
            </Typography>
            <RecordVoiceOverIcon
              style={{
                height: "25px",
                width: "25px",
                color: LightThemeColors.uriColor,
              }}
            />
          </DashboardImage>
          <Box sx={{ alignSelf: "flex-end", mr: -4 }}>
            <DashboardImage>
              <Typography
                variant="h6"
                fontSize={17}
                color="textSecondary"
                sx={{ mb: 1 }}
              >
                Keyword Tracking
              </Typography>
              <ManageSearchIcon
                style={{
                  height: "25px",
                  width: "25px",
                  color: LightThemeColors.uriColor,
                }}
              />
            </DashboardImage>
          </Box>
        </Box>

        <Box
          textAlign="center"
          sx={{ px: isMobile ? 2 : 5, flex: 1, paddingTop: isMobile ? 0 : 10 }}
        >
          <AnimatedTextContainer>
            <Fade in={!isTransitioning} timeout={1000}>
              <Box sx={{ width: "100%" }}>
                {renderText(textOptions[currentIndex])}
              </Box>
            </Fade>
          </AnimatedTextContainer>
        </Box>

        {/* Right Column */}
        <Box
          flexDirection="column"
          gap="1.5rem"
          sx={{ marginTop: "8rem", display: { xs: "none", lg: "flex" } }}
        >
          <DashboardImage>
            <Typography
              variant="h6"
              fontSize={17}
              color="textSecondary"
              sx={{ mb: 1 }}
            >
              Content Management
            </Typography>
            <FolderIcon
              style={{
                height: "25px",
                width: "25px",
                color: LightThemeColors.uriColor,
              }}
            />
          </DashboardImage>
          <Box sx={{ alignSelf: "flex-start", ml: -4 }}>
            <DashboardImage>
              <Typography
                variant="h6"
                fontSize={17}
                color="textSecondary"
                sx={{ mb: 1 }}
              >
                Account Tracking
              </Typography>
              <GroupIcon
                style={{
                  height: "25px",
                  width: "25px",
                  color: LightThemeColors.uriColor,
                }}
              />
            </DashboardImage>
          </Box>
        </Box>
      </Box>

      {/* Footer Text */}
      <Box
        textAlign="center"
        maxWidth={620}
        sx={{ px: isMobile ? 2 : 6, paddingBottom: isMobile ? 0 : 10 }}
      >
        <Typography
          variant="body1"
          color="textSecondary"
          className="text-[#424242]"
          sx={{
            lineHeight: 1.6,
            fontSize: {
              xs: "14px", // Mobile size
              sm: "16px", // Default size
            },
            // mt: { xs: 2, sm: 3 },
          }}
        >
          Empower your business with real-time social media insights, smarter
          lead generation, and trend tracking—URI keeps you connected to the
          conversations that drive growth.
        </Typography>
      </Box>
    </Container>
  );
};

export default HeroSection;
