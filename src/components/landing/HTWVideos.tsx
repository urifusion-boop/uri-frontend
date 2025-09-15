import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { YouTubeEmbed } from "react-social-media-embed";

interface HTWVideosProps {
  number: string;
  text: string;
  headerText: string;
  url: string;
}

const HTWVideos = ({ number, headerText, text, url }: HTWVideosProps) => {
  return (
    <Box
      maxWidth={"555px"}
      width={"100%"}
      bgcolor={"#CD1B78"}
      borderRadius={"9px"}
      p={"33px"}
    >
      <Typography
        color={"transparent"}
        sx={{ "-webkit-text-stroke": "1px #fff" }}
        fontSize={"70px"}
        fontWeight={600}
      >
        {number}
      </Typography>
      <Typography
        fontSize={"20px"}
        fontWeight={600}
        textTransform={"uppercase"}
        color={"#FFFFFF"}
        borderBottom={" 1px solid #FFFFFF7A"}
        pb={"17px"}
      >
        {headerText}
      </Typography>
      <Typography
        fontSize={"16px"}
        fontWeight={400}
        color={"#FFFFFF"}
        mt={"31px"}
      >
        {text}
      </Typography>
      <Box mt={"50px"} mb={"33px"}>
        <Box maxWidth={"478px"} mx={"auto"}>
          <YouTubeEmbed
            url={url}
            width={"100%"}
            height={270}
            style={{ borderRadius: "10px" }}
            youTubeProps={{
              opts: {
                playerVars: {
                  autoplay: 0,
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HTWVideos;
