import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from "@mui/material";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { TextHelper } from "@/helpers/TextHelper";
import { MediaHelper } from "@/helpers/MediaHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BarChartIcon from "@mui/icons-material/BarChart";

interface TwitterPreviewProps {
  username: string;
  handle: string;
  content: string;
  avatarUrl: string;
  attachments: UserDocDto[];
}

const TwitterPreview: React.FC<TwitterPreviewProps> = ({
  username,
  handle,
  content,
  avatarUrl,
  attachments,
}) => {
  const getGridAreas = (attachmentLength: number) => {
    switch (attachmentLength) {
      case 1:
        return `"image1 image1" 
                "image1 image1"`;
      case 2:
        return `"image1 image2" 
                "image1 image2"`;
      case 3:
        return `"image1 image2" 
                "image1 image3"`;
      case 4:
        return `"image1 image2" 
                "image3 image4"`;
      default:
        return ``;
    }
  };

  const getMediaHeight = (attachmentLength: number, index: number) => {
    if (attachmentLength === 1) {
      return "200px";
    } else if (attachmentLength === 3 && index === 0) {
      return "200px";
    } else if (attachmentLength === 2) {
      return "200px";
    } else {
      return index % 2 === 0 ? "100px" : "100px";
    }
  };

  return (
    <Card sx={{ boxShadow: 3, width: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={avatarUrl} alt={username} sx={{ marginRight: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{handle}
              </Typography>
            </Box>
          </Box>
          <img
            src={"/assets/icons/x.svg"}
            alt={username}
            style={{ width: 30, height: 30, borderRadius: "50%" }}
          />
        </Box>
        <Typography variant="body1">{content}</Typography>

        {/* Images */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 1,
            gridTemplateAreas: getGridAreas(
              attachments?.slice(0, 4)?.length ?? 0
            ),
            position: "relative",
            marginTop: 2,
          }}
        >
          {attachments?.slice(0, 4).map((image, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: getMediaHeight(
                  attachments?.slice(0, 4).length ?? 0,
                  index
                ),
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 1,
                gridArea: `image${index + 1}`,
              }}
            >
              {MediaHelper.getMediaType(image.docType) ===
              MediaTypeEnum.IMAGE ? (
                <img
                  src={TextHelper.setUrl(image.url)}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              ) : (
                <video
                  src={TextHelper.setUrl(image.url)}
                  autoPlay
                  loop
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              )}
            </Box>
          ))}

          <Box
            sx={{
              backgroundColor: "white",
              position: "absolute",
              bottom: 10,
              right: 10,
              padding: "2px 7px",
              borderRadius: 10,
              display: attachments && attachments?.length > 4 ? "flex" : "none",
              fontSize: 12,
            }}
          >
            +
            {attachments && attachments?.length > 4
              ? attachments?.length - 4
              : 0}
          </Box>
        </Box>

        {/* Twitter buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <IconButton size="small" color="inherit">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <RepeatIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <BarChartIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TwitterPreview;
