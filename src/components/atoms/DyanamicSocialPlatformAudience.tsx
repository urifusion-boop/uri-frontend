import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import PieChart from "../charts/PieChart";
import React from "react";
import {
  calculateEngagement,
  calculateFacebookTopPost,
} from "@/helpers/EngagementHelper";
import { FacebookPostDto } from "@/models/dtos/FacebookInsightsDto";
import FacebookPostCard from "../cards/FacebookPostCard";

const legendStyles = {
  display: "flex",
  alignItems: "center",
  mb: 1,
  marginLeft: 4,
};

const dotStyles = (color: string) => ({
  backgroundColor: color,
  width: 10,
  height: 10,
  borderRadius: "50%",
  marginRight: "8px",
});

const FacebookLatestPost = ({
  post,
  maxWidth,
}: {
  post: FacebookPostDto[];
  maxWidth: string;
}) => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const videoType = post.filter(
    (item) => item?.attachments?.data?.[0].media_type === "video"
  );
  const photoType = post.filter(
    (item) => item?.attachments?.data?.[0].media_type === "photo"
  );
  const albumType = post.filter(
    (item) => item?.attachments?.data?.[0].media_type === "album"
  );

  const platforms = [
    {
      name: " Video",
      color: "#e74c3c",
      followers: calculateEngagement(
        videoType.map((item) => ({
          like_count: (item?.reactions?.data ?? []).length,
          comments_count: item.comments?.data.length || 0,
        }))
      ),
    },
    {
      name: "Photo",
      color: "#f39c12",
      followers: calculateEngagement(
        photoType.map((item) => ({
          like_count: (item?.reactions?.data ?? []).length,
          comments_count: item.comments?.data.length ?? 0,
        }))
      ),
    },
    {
      name: " Album",
      color: "#27ae60",
      followers: calculateEngagement(
        albumType.map((item) => ({
          like_count: (item?.reactions?.data ?? []).length,
          comments_count: item.comments?.data.length ?? 0,
        }))
      ),
    },
  ];

  const totalEngagement = platforms.reduce((acc, platform) => {
    return acc + parseInt(platform.followers.replace(/,/g, ""));
  }, 0);

  const pieChartData = platforms.map((platform) => ({
    x: platform.name,
    y: parseFloat(
      (
        (parseInt(platform.followers.replace(/,/g, "")) / totalEngagement) *
        100
      ).toFixed(2)
    ), // Convert to percentage
    color: platform.color,
    totalEngagement,
  }));

  const mostTopPost = calculateFacebookTopPost(post);

  return (
    <Box
      p={3}
      border="1px solid #ddd"
      borderRadius={2}
      bgcolor="white"
      maxWidth={maxWidth}
      width={"100%"}
    >
      {/* Title and Tabs */}
      <Typography fontSize={isMobile ? 14 : 16} variant="h6" mb={2}>
        Summary of Last {post.length} Post
      </Typography>

      <Box
        bgcolor={"#F8F9FA"}
        marginBottom={2.5}
        padding={0.8}
        display={"grid"}
        gridTemplateColumns={"1fr 1fr"}
        borderRadius={2}
      >
        {["Top Post", "Post Type"].map((tab, index) => (
          <Box
            key={index}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            padding={1}
            bgcolor={activeIndex === index ? "white" : "transparent"}
            borderRadius={2}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveIndex(index)}
          >
            <Typography
              fontSize={14}
              fontWeight={600}
              color={activeIndex === index ? "#CD1B78" : "text.secondary"}
            >
              {tab}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Donut Chart and Legend */}
      {activeIndex === 1 && (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          marginTop={-5}
        >
          <Grid item xs={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="relative"
              height={270}
            >
              <PieChart
                colorScale={pieChartData.map((item) => item.color)}
                data={pieChartData}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                fontSize={12}
                position="absolute"
                top="45%"
                left="50%"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                {totalEngagement}
              </Typography>
              <Typography
                align="center"
                fontSize={9}
                color="textSecondary"
                position="absolute"
                top="55%"
                left="50%"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                Total Engagements
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center">
            {platforms.map((platform) => (
              <Box key={platform.name} sx={legendStyles}>
                <Box sx={dotStyles(platform.color)} />
                <Box>
                  <Typography fontSize={15} fontWeight={600}>
                    {platform.name}
                  </Typography>
                  <Typography
                    color={"GrayText"}
                    fontSize={12}
                    sx={{ ml: "auto" }}
                  >
                    {platform.followers}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      )}

      {activeIndex === 0 && (
        <FacebookPostCard
          height={"fit"}
          post={mostTopPost}
          isDashboard
          noOfCaptionLines={15}
        />
      )}
    </Box>
  );
};

export default FacebookLatestPost;
