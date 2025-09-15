import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { BsCameraVideoOffFill } from "react-icons/bs";

interface FacebookPostModalProps {
  open: boolean;
  handleClose: () => void;
  post: {
    description: string;
    media_type: string;
    source: string;
    title?: string;
  };
}

const FacebookPostModal: React.FC<FacebookPostModalProps> = ({
  post,
  open,
  handleClose,
}) => {
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

        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.description}
        </Typography>

        <Box sx={{ maxWidth: 500, marginBottom: 2 }}>
          {post.source ? (
            <>
              {" "}
              {post.media_type === "video" ? (
                <Box
                  component="video"
                  src={post.source}
                  controls
                  autoPlay
                  loop
                  sx={{
                    width: "100%",
                    height: 400,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={post.source}
                  alt={post.title || "Media"}
                  sx={{
                    width: "100%",
                    height: 400,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              )}
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 200,
                fontSize: 100,
                color: "rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f5f5f5",
              }}
            >
              <BsCameraVideoOffFill />
            </Box>
          )}
        </Box>

        <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default FacebookPostModal;
