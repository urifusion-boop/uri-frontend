import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Box,
  Grid,
  Button,
} from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TextHelper } from "@/helpers/TextHelper";
import { RiTwitterXFill } from "react-icons/ri";
import { Tweet } from "@/models/dtos/XInsightsDto";

interface PostCardProps {
  tweet: Tweet;
  keywords?: string[];
  insights?: boolean;
  handleEngagement?: (tweet: Tweet) => void;
}

const KeywordTrackerPostCard: React.FC<PostCardProps> = ({
  tweet,
  keywords,
  insights,
  handleEngagement,
}) => {
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderTop: "15px solid #1DA1F2",
        position: "relative",
        height: "100%",
      }}
    >
      <CardHeader
        sx={{
          height: "20%",
        }}
        avatar={
          insights ? (
            <RiTwitterXFill
              size={24}
              color="#1DA1F2"
              style={{
                marginRight: "12px",
              }}
            />
          ) : (
            <Avatar src={tweet?.profile_image_url} alt={tweet?.username} />
          )
        }
        title={`@${tweet?.username}`}
        subheader={`${new Date(tweet?.time ?? "").toLocaleString()}`}
        action={
          !insights && (
            <RiTwitterXFill
              size={24}
              color="#1DA1F2"
              style={{
                marginRight: "12px",
              }}
            />
          )
        }
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "80%",
        }}
      >
        <Typography
          variant="body1"
          sx={{ marginBottom: "20px", color: "#333" }}
          dangerouslySetInnerHTML={{
            __html:
              TextHelper.highlightKeywords(tweet?.text ?? "", keywords) ?? "",
          }}
        />

        {/* Mentions */}
        <Box
          sx={{
            pb: 2,
          }}
        >
          {tweet?.mentions && tweet?.mentions.length > 0 && (
            <Box sx={{ marginBottom: "8px" }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ color: "#0077b6" }}
              >
                Mentions:
              </Typography>
              {tweet?.mentions.map((mention, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  component="span"
                  sx={{ marginRight: "8px" }}
                >
                  @{mention}
                </Typography>
              ))}
            </Box>
          )}
        </Box>

        {/* Metrics */}
        <Box
          sx={{
            marginTop: "auto",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <RepeatIcon color="action" />
                <Typography variant="body2">{tweet?.retweets}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <ChatBubbleOutlineIcon color="action" />
                <Typography variant="body2">{tweet?.replies}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <FavoriteBorderIcon color="action" />
                <Typography variant="body2">{tweet?.likes}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <VisibilityIcon color="action" />
                <Typography variant="body2">{tweet?.impressions}</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Show Engagement */}
          {insights && (
            <Box
              display={"flex"}
              justifyContent={"center"}
              sx={{
                marginTop: "20px",
              }}
            >
              <Button
                style={{
                  fontSize: 11,
                }}
                color="primary"
                onClick={() => handleEngagement && handleEngagement(tweet)}
              >
                Show Engagement
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default KeywordTrackerPostCard;
