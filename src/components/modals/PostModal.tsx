import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { BusinessProfileInsight } from "@/models/dtos/InstagramInsights";
import MetricsCarousel from "../atoms/MetricsCarousel";
import { TextHelper } from "@/helpers/TextHelper";

interface PostModalProps {
  post: BusinessProfileInsight;
  open: boolean;
  handleClose: () => void;
  keywords?: string[];
}

const PostModal: React.FC<PostModalProps> = ({
  post,
  open,
  handleClose,
  keywords,
}) => {
  const renderMedia = () => {
    switch (post.media_type) {
      case "IMAGE":
        return (
          <img
            src={post.media_url}
            alt="Post"
            style={{ width: "100%", height: "auto" }}
          />
        );
      case "VIDEO":
        return post.media_url ? (
          <video controls style={{ width: "100%", maxHeight: "300px" }}>
            <source src={post.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null;
      case "CAROUSEL_ALBUM":
        return (
          <Box
            sx={{
              width: "100%",
              height: "auto",
            }}
          >
            <MetricsCarousel
              postMedia={{
                id: post.id,
                data:
                  post.children?.data.map((child) => ({
                    media_type: child.media_type,
                    media_url: child.media_url,
                  })) ?? [],
                media_url: post.media_url ?? "",
              }}
            />
            ;
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "50%" },
          bgcolor: "#fff",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        className="scroll"
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Post Details
        </Typography>

        {keywords ? (
          <p
            dangerouslySetInnerHTML={{
              __html: TextHelper.highlightKeywords(post.caption, keywords),
            }}
            style={{
              fontFamily: "urbanist",
              fontSize: "16px",
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {post.caption}
          </Typography>
        )}

        {renderMedia()}
        <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default PostModal;
