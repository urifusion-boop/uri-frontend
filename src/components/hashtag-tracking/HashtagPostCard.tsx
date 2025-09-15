import PlatformIcon from "@/components/atoms/PlatformIcons";
import { LightThemeColors } from "@/configs/colors.config";
import { ColorHelper } from "@/helpers/ColorHelper";
import { TextHelper } from "@/helpers/TextHelper";
import { HashtagTrackPost } from "@/models/dtos/HashTagDto";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoChatbubbleSharp } from "react-icons/io5";

interface PostHashtagCardProps {
  post: HashtagTrackPost;
  onSelectPost?: (post: HashtagTrackPost) => void;
  isSelected?: boolean;
}

const HashtagPostCard = ({
  post,
  onSelectPost,
  isSelected,
}: PostHashtagCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const MAX_LENGTH = 300;
  const isLongCaption = post?.caption?.length > MAX_LENGTH;
  const displayedCaption =
    isExpanded || !isLongCaption
      ? post?.caption
      : post?.caption.substring(0, MAX_LENGTH) + "...";

  return (
    <Card
      sx={{
        boxShadow: 0,
        borderRadius: "10px",
        border: "1px solid",
        cursor: "pointer",
        height: "100%",
        borderColor: isSelected ? LightThemeColors.primary : "#8C8C8C4D",
      }}
      onClick={() => {
        if (onSelectPost) {
          onSelectPost(post);
        }
      }}
    >
      {/* Header Section */}
      <CardHeader
        avatar={<Avatar src={post?.media_url} alt="User Image" />}
        title={
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: "#1E1E1E",
                fontSize: "16px",
              }}
            >
              {"@username"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <PlatformIcon
                platform={TextHelper.getDomainName(post?.permalink)}
                size={16}
              />
              <Typography variant="body2" color="text.secondary">
                {dayjs(post?.timestamp).format("DD MMM YYYY HH:mm A")}
                &bull; {post?.like_count ?? 0 + post?.comments_count}{" "}
                Engagements
              </Typography>
            </Box>
          </Box>
        }
      />

      {/* Middle Section (Text) */}
      <CardContent
        sx={{
          p: "0 16px",
        }}
      >
        <Typography variant="body1" color="text.primary" fontSize={14}>
          {displayedCaption}
          {isLongCaption && (
            <Button
              variant="text"
              size="small"
              onClick={handleToggle}
              sx={{
                display: "inline-block",
                fontSize: "12px",
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </Typography>
      </CardContent>

      {/* Bottom Section (Actions) */}
      <CardActions
        disableSpacing
        sx={{ justifyContent: "space-between", px: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="Message"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IoChatbubbleSharp size={18} />
            <Typography variant="body2" color="text.secondary">
              {post?.comments_count}
            </Typography>
          </IconButton>
          <IconButton
            aria-label="Like"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FaHeart size={18} />
            <Typography variant="body2" color="text.secondary">
              {post?.like_count ?? 0}
            </Typography>
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default HashtagPostCard;
