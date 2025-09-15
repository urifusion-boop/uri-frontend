import React from "react";
import { Box, Typography } from "@mui/material";
import { LuTarget } from "react-icons/lu";
import { LightThemeColors } from "@/configs/colors.config";

// Define the props for summary and achievements data
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
      {/* Achievements List */}
      <Box sx={{ marginTop: "24px" }}>
        {summary_and_achievements.achievements.map((achievement, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={1}
            gap={"6px"}
          >
            <LuTarget size={20} color={LightThemeColors.uriColor} />
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
