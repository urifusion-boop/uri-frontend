import React from "react";
import { Box, Typography, LinearProgress, Paper } from "@mui/material";

interface ContentTheme {
  theme: string;
  mentions: number;
}

interface ContentThemesCardProps {
  contentThemes: ContentTheme[];
}

const ContentThemesCard: React.FC<ContentThemesCardProps> = ({
  contentThemes,
}) => {
  const maxMentions = Math.max(
    ...contentThemes.map((theme) => theme.mentions),
    1
  );

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: 4,
        pb: 3,
        borderRadius: 3,
        mx: "auto",

        backgroundColor: "white",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header Title */}
      <Typography fontWeight={700} fontSize={22}>
        AI-Driven Content Themes
      </Typography>
      <Typography fontSize={16} color="text.secondary" sx={{ mt: 1 }}>
        Insights on key themes
      </Typography>

      {/* Content Themes List */}
      <Box sx={{ mt: 3 }}>
        {contentThemes.map((theme, idx) => (
          <Box
            key={idx}
            sx={{
              backgroundColor: "#F9F9F9",
              p: 2,
              borderRadius: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* Theme Title */}
              <Typography fontWeight={600} fontSize={16} color="#000000">
                {theme.theme}
              </Typography>

              {/* Mentions Count */}
              <Typography fontSize={14} color="#5C5C5C" fontWeight={600}>
                {theme.mentions} in conversations
              </Typography>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={(theme.mentions / maxMentions) * 100}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 6,
                backgroundColor: "#E0E0E0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#CD1B78",
                },
                width: "100%",
                maxWidth: { xs: "200px", md: "267px", xl: "500px" },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ContentThemesCard;
