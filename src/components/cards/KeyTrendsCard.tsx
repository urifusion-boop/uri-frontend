import React from "react";
import { Box, Paper, Typography, Chip, Stack } from "@mui/material";
import { IoMdTrendingUp } from "react-icons/io";
import { BsFillLightbulbFill } from "react-icons/bs";
import { HiLightningBolt } from "react-icons/hi";

interface KeyTrendsCardProps {
  keyTrends: string[];
}

const KeyTrendsCard: React.FC<KeyTrendsCardProps> = ({ keyTrends }) => {
  const trendIcons = [
    <IoMdTrendingUp color="#CD1B78" size={20} key="trending" />,
    <HiLightningBolt color="#CD1B78" size={20} key="lighting" />,
    <BsFillLightbulbFill color="#CD1B78" size={20} key="bulb" />,
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "813px",
        p: 4,
        borderRadius: 3,
        mx: "auto",
        backgroundColor: "white",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header Title */}
      <Typography fontWeight={700} fontSize={22}>
        Key Trends Powered by AI
      </Typography>
      <Typography fontSize={16} color="text.secondary" sx={{ mt: 1 }}>
        Discover the top insights shaping the conversation
      </Typography>

      {/* Key Trends List */}
      <Stack spacing={2} sx={{ mt: 3 }}>
        {keyTrends.map((trend, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#F9F9F9",
              p: 2,
              borderRadius: 2,
            }}
          >
            {/* Left Icon and Trend Content */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Icon */}
              <Box sx={{ mr: 2 }}>{trendIcons[index % trendIcons.length]}</Box>

              {/* Trend Description */}

              <Typography
                fontWeight={600}
                fontSize={16}
                sx={{
                  color: "#363636",
                  maxWidth: {
                    xs: "200px",
                    md: "300px",
                    xl: "500px",
                  },
                }}
              >
                {trend}
              </Typography>
            </Box>

            {/* Trending Chip */}
            <Chip
              label="Trending"
              sx={{
                backgroundColor: "#CD1B78",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                px: "10px",
                py: "4px",
                borderRadius: 10,
              }}
            />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default KeyTrendsCard;
