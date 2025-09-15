import React from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

interface SummaryAndAchievements {
  summary: string;
  achievements: string[];
}

interface AchievementsProps {
  summary_and_achievements: SummaryAndAchievements | undefined;
}

const Achievements: React.FC<AchievementsProps> = ({
  summary_and_achievements,
}) => {
  return summary_and_achievements ? (
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Title */}
      <Typography variant="h6" gutterBottom>
        Summary & Achievements
      </Typography>

      {/* Summary */}
      <Typography variant="body1" gutterBottom>
        {summary_and_achievements.summary}
      </Typography>
      <Box sx={{ marginTop: "24px" }}>
        {summary_and_achievements.achievements.map((achievement, index) => (
          <Box key={index} display="flex" alignItems="center" mb={1}>
            <CheckCircleOutline sx={{ color: "#FF9900", mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              {achievement}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  ) : null;
};

export default Achievements;
