import React from "react";
import { Box, Typography } from "@mui/material";
import { Comment, Share, ThumbUpAlt, Repeat } from "@mui/icons-material";
import { SocialMediaEnum } from "../../models/enum-models/SocialMediaEnum";
import { MediaPreviewGrid } from "./MediaPreviewGrid";

const previewTextAreaStyle = {
  width: "100%",
  minHeight: "100px",
  maxHeight: "200px",
  resize: "none",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  overflow: "auto",
};

interface SocialMediaPreviewProps {
  socialMedia: SocialMediaEnum | null;
  editorState: any; // DraftJS EditorState
  medias?: string[];
}

const SocialMediaPreview = ({
  socialMedia,
  editorState,
  medias,
}: SocialMediaPreviewProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="#F5F5F5"
      border="1px solid #ccc"
      height="100%"
      borderRadius="8px"
      padding="16px"
    >
      <Typography variant="h6" fontSize={16} fontWeight={700}>
        {socialMedia === SocialMediaEnum.TWITTER
          ? "X / Twitter Preview"
          : "LinkedIn Preview"}
      </Typography>

      <Box
        marginTop={2}
        maxWidth="100%"
        border="1px solid #ccc"
        borderRadius="8px"
        padding="16px"
      >
        <Box display="flex" gap={2}>
          <Typography variant="h6" fontSize={14} fontWeight={700}>
            Jennifer Awanyi on{" "}
            {socialMedia === SocialMediaEnum.TWITTER ? "Twitter" : "LinkedIn"}
          </Typography>
          <Typography variant="h6" fontSize={12} color="grey">
            2h ago
          </Typography>
        </Box>

        <Box marginTop={2}>
          <textarea
            disabled
            style={{ ...previewTextAreaStyle, resize: "none" }}
            value={
              socialMedia === SocialMediaEnum.TWITTER
                ? `${editorState?.getCurrentContent().getPlainText()} @jenniferawanyi`
                : editorState?.getCurrentContent().getPlainText()
            }
          ></textarea>
          {medias && (
            <MediaPreviewGrid
              media={medias.map((media) => ({
                id: media,
                url: media,
                type: "image",
              }))}
            />
          )}
        </Box>

        {/* Social Media Buttons */}
        {socialMedia === SocialMediaEnum.LINKEDIN && (
          <Box
            display="flex"
            justifyContent="space-between"
            marginTop={2}
            borderTop="1px solid #e0e0e0"
            paddingTop={2}
          >
            <PreviewAction icon={<ThumbUpAlt fontSize="small" />} text="Like" />
            <PreviewAction icon={<Comment fontSize="small" />} text="Comment" />
            <PreviewAction icon={<Repeat fontSize="small" />} text="Repost" />
            <PreviewAction icon={<Share fontSize="small" />} text="Share" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Subcomponent for Action Buttons
const PreviewAction = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
    sx={{
      cursor: "pointer",
      "&:hover": { color: "#0a66c2" },
    }}
  >
    {icon}
    <Typography fontSize={12}>{text}</Typography>
  </Box>
);

export default SocialMediaPreview;
