import { Box, styled, useMediaQuery } from "@mui/material";
import React from "react";

import YouTubeEmbed from "@/components/atoms/YouTubeEmbed";

const Container = styled(Box)({
  backgroundColor: "#fff",
  padding: "4rem 2rem",
  borderRadius: "1rem",
  textAlign: "center",
  maxWidth: "100%",
  margin: "100px auto",
  position: "relative",
});

const HowItWorks: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Container id="how-it-works">
      <Box
        sx={{
          maxWidth: "1280px",
          px: 2,
          margin: "0 auto",
        }}
      >
        <h2 className="text-[#CD1B78] text-xl font-semibold">GET STARTED</h2>
        <h3 className="text-[#000000] text-[32px] md:text-[48px] font-bold mx-auto py-2 text-center">
          How it <span className="text-[#CD1B78]">Works</span>
        </h3>
        <p className="max-w-[770px] mx-auto text-center text-[#080808] text-lg md:text-[24px] mt-1 font-urbanist font-medium leading-snug">
          Watch our step-by-step tutorial videos to understand how URI works.
        </p>
        <div className="bg-[#CD1B78] rounded-md py-[1px] mt-[120px] px-[20px] max-w-fit mx-auto relative">
          <YouTubeEmbed
            url="https://youtu.be/1qpvBioMUME"
            width={isMobile ? "300" : "908"}
            height={isMobile ? "200" : "480"}
            className="shadow-none"
          />
          <div
            style={{
              border: "10px solid #CD1B78",
              borderLeft: "10px solid transparent",
              borderBottom: "10px solid transparent",
            }}
            className={`   
              absolute
              top-[-35px] 
              right-[-35px] 
              h-[95px] 
              w-[110px] 
            `}
          ></div>
          <div
            style={{
              border: "10px solid #E984B9",
              borderLeft: "10px solid transparent",
              borderBottom: "10px solid transparent",
            }}
            className={`   
              absolute
              top-[-55px] 
              right-[-55px] 
              h-[115px] 
              w-[130px] 
            `}
          ></div>
          <div
            style={{
              border: "10px solid #CD1B78",
              borderTop: "10px solid transparent",
              borderRight: "10px solid transparent",
            }}
            className={`   
              absolute
              bottom-[-35px] 
              left-[-35px] 
              h-[95px] 
              w-[110px] 
            `}
          ></div>
          <div
            style={{
              border: "10px solid #E984B9",
              borderTop: "10px solid transparent",
              borderRight: "10px solid transparent",
            }}
            className={`   
              absolute
              bottom-[-55px] 
              left-[-55px] 
              h-[115px] 
              w-[130px] 
            `}
          ></div>
        </div>
      </Box>
    </Container>
  );
};

export default HowItWorks;
