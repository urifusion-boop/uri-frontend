import HTWVideos from "@/components/landing/HTWVideos";
import { Box, Typography, useMediaQuery } from "@mui/material";
import useCustomTheme from "@/hooks/theme.hook";

const HowItWorks = () => {
  const matches2 = useMediaQuery("(max-width: 500px)");
  const matches = useMediaQuery("(max-width: 1200px)");
  const { themeColors } = useCustomTheme();

  return (
    <Box id="how-it-works">
      <Typography
        sx={{ fontWeight: 700, zIndex: 10 }}
        variant={"h4"}
        align="center"
        marginLeft={"auto"}
        marginRight={"auto"}
        marginBottom={"20px"}
        maxWidth={"md"}
      >
        Getting
        <span
          style={{
            color: themeColors.primary,
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          Started
        </span>{" "}
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{
          maxWidth: "500px",
          textAlign: "center",
          fontFamily: "Plus Jakarta Sans,sans-serif",
          mx: "auto",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        Watch our step-by-step tutorial videos to understand how URI works.
        These concise and informative tutorials provide step-by-step guidance on
        key functionalities. Whether you’re a client or a creative, our videos
        will help you make the most of URI.
      </Typography>
      <Box
        display={"flex"}
        flexDirection={matches ? "column" : "row"}
        alignItems={"center"}
        gap={"44px"}
        mx={"auto"}
        maxWidth={"1100px"}
        mt={8}
        mb={"44px"}
        px={2}
      >
        <HTWVideos
          number="02"
          headerText="Get Started On URI"
          text="The video below provides step-by-step guide to start using URI"
          url={"https://youtu.be/1qpvBioMUME"}
        />
      </Box>
    </Box>
  );
};

export default HowItWorks;
