import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

interface MediaPreviewGridProps {
  media: { id: string; url: string; type: string }[]; // Supports images and videos
}

export const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  media,
}) => {
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});

  const togglePlay = (id: string) => {
    setPlaying((prev) => ({ ...prev, [id]: !prev[id] }));
    const video = document.getElementById(id) as HTMLVideoElement | null;
    if (video) {
      if (playing[id]) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
        mt: 2,
      }}
    >
      {media.map((item) => {
        const { id, url, type } = item;

        return (
          <Box
            key={id}
            sx={{
              position: "relative",
              paddingBottom: "100%", // Maintain 1:1 Aspect ratio
              width: "100%",
              height: 0,
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            {type === "image" ? (
              <Box
                component="img"
                src={url}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                component="video"
                id={id}
                src={url}
                muted
                loop
                playsInline
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            {/* Play/Pause Button for Videos */}
            {type === "video" && (
              <IconButton
                onClick={() => togglePlay(id)}
                sx={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                {playing[id] ? <Pause /> : <PlayArrow />}
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
