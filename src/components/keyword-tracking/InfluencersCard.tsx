import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import { NumberHelper } from "@/helpers/NumberHelper";
import { TextHelper } from "@/helpers/TextHelper";

interface InfluencerCardProps {
  name: string;
  occupation: string;
  address: string;
  tags?: string[];
  image: string;
  socialStats: {
    platform: string;
    icon: React.ReactNode;
    followers: string;
  }[];
  bio?: string;
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  name,
  occupation,
  address,
  tags,
  socialStats,
  image,
  bio,
}) => {
  return (
    <Card
      sx={{
        maxWidth: 800,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        backgroundColor: "#f7fbfd",
        width: "100%",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ marginBottom: "16px" }}
        >
          <Avatar src={image} alt={name} sx={{ width: 80, height: 80 }} />
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#2b2d42" }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginBottom: "4px" }}
            >
              {occupation}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {address}
            </Typography>
          </Box>
        </Box>

        {tags && tags.length > 0 && (
          <>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ marginBottom: "8px", color: "#2b2d42" }}
            >
              Tags
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" marginBottom={2}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  sx={{
                    backgroundColor: "#f2f2f2",
                    color: "0#077b6",
                    fontWeight: "500",
                  }}
                />
              ))}
            </Box>
          </>
        )}

        {/* <Typography
          variant="subtitle1"
          sx={{ marginBottom: "8px", color: "#2b2d42" }}
        >
          Bio: {bio && bio?.length > 0 ? bio : "No bio available"}
        </Typography> */}

        <Box display="flex" gap={1} marginBottom={2}>
          {socialStats.map((stat, index) => (
            <Tooltip
              key={index}
              title={`${stat.followers} ${TextHelper.removeChar(stat.platform, "_")}`}
              arrow
            >
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                sx={{
                  color: "#0077b6",
                  fontWeight: "500",
                  backgroundColor: "#f1f7fa",
                  padding: "4px 6px",
                  borderRadius: "8px",
                  cursor: "pointer", // Optional for better tooltip UX
                }}
              >
                {stat.icon}
                <Typography variant="subtitle2">
                  {NumberHelper.formatNumber(parseInt(stat.followers))}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </CardContent>
      {/* <CardActions
        sx={{
          padding: "16px",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#d9f9ff",
            color: "#0077b6",
            fontWeight: "600",
          }}
        >
          View Profile
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default InfluencerCard;
