import HTWVideos from "@/components/landing/HTWVideos";
import Header from "@/components/landing/Header";
import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { YouTubeEmbed } from "react-social-media-embed";

const HowItWorks = () => {
  const matches2 = useMediaQuery("(max-width: 500px)");
  const matches = useMediaQuery("(max-width: 1200px)");

  return (
    <Box>
      <Header />
      <Typography
        fontSize={matches2 ? "40px" : "56px"}
        fontWeight={600}
        color={"#CD1B78"}
        textAlign={"center"}
      >
        How It Works
      </Typography>
      <Typography
        fontSize={matches2 ? "20px" : "24px"}
        fontWeight={400}
        color={"#141416"}
        textAlign={"center"}
        mx={"auto"}
        maxWidth={"1000px"}
        mt={"42px"}
        px={2}
      >
        Explore the inner workings of URI and unlock its full potential with our
        comprehensive guide, covering everything from profile completion to job
        creation, application processes, and portfolio management
      </Typography>
      <Box mt={8} px={2}>
        <Box maxWidth={"600px"} mx={"auto"} position={"relative"}>
          {/* <Box
            sx={{ boxShadow: "0px 8px 24px 0px #00000026" }}
            width={"175px"}
            borderRadius={"16px"}
            p={"20px"}
            position={"absolute"}
            top={"10px"}
            left={"-200px"}
            display={matches ? "none" : "block"}
          >
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <FaStar color="#F8BD38" size={24} />
              <Typography
                textTransform={"uppercase"}
                fontSize={12}
                fontWeight={700}
                color={"#1D1D1D"}
              >
                Great Project
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={0.5}>
              <Typography fontSize={24} fontWeight={700} color={"#1D1D1D"}>
                800+
              </Typography>
              <Typography fontSize={24} fontWeight={700} color={"#1D1D1D"}>
                Done
              </Typography>
            </Box>
          </Box> */}
          <YouTubeEmbed
            url={"https://www.youtube.com/watch?v=xY6wJrCIIEA"}
            width={"100%"}
            height={400}
            youTubeProps={{
              opts: {
                playerVars: {
                  autoplay: 0,
                },
              },
            }}
            style={{ border: "1px solid #e8e8e8", borderRadius: "16px" }}
          />
          {/* <Box
            sx={{ boxShadow: "0px 8px 24px 0px #00000026" }}
            width={"175px"}
            borderRadius={"16px"}
            p={"20px"}
            position={"absolute"}
            bottom={"10px"}
            right={"-200px"}
            display={matches ? "none" : "block"}
          >
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <img
                src="/assets/images/landing/bill.png"
                alt="bill"
                width={"32px"}
                height={"32px"}
              />
              <Box>
                <Typography
                  color={"#1D1D1D"}
                  fontSize={"10px"}
                  fontWeight={600}
                >
                  Bill Adams
                </Typography>
                <Typography color={"#1D1D1D"} fontSize={"6px"} fontWeight={600}>
                  CEO UpTech
                </Typography>
              </Box>
            </Box>
            <Typography
              fontWeight={400}
              fontSize={"10px"}
              color={"#1D1D1D"}
              mt={"12px"}
            >
              {"“"} This team is really the best in its field,I don{"'"}t regret
              working with them, and will come back again thanks{"“"}
            </Typography>
          </Box> */}
        </Box>
      </Box>
      <Typography
        fontSize={matches2 ? "24px" : "31.25px"}
        fontWeight={700}
        color={"#141416CC"}
        textAlign={"center"}
        mt={"120px"}
      >
        Tutorial Videos
      </Typography>
      <Typography
        fontSize={matches2 ? "14px" : "16px"}
        fontWeight={400}
        color={"##141416CC"}
        textAlign={"center"}
        mx={"auto"}
        maxWidth={"600px"}
        mt={"18px"}
        px={2}
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
          headerText="Get Started on URI"
          text="The video below provides steps-by-step guide to start using URI"
          url={"https://youtu.be/1qpvBioMUME"}
        />
      </Box>
    </Box>
  );
};

export default HowItWorks;
