import React from "react";
import { Box, Typography, LinearProgress, Grid } from "@mui/material";

// Sentiment data for the comparison
const sentimentData = [
  { name: "Spotify", positive: 30.1, negative: 10.4 },
  { name: "Apple music", positive: 49.5, negative: 8.2 },
  { name: "Google Play Music", positive: 42.8, negative: 9.1 },
];

const SentimentAnalysis = () => {
  return (
    <Box p={2} border="1px solid #ddd" borderRadius="8px" bgcolor="white">
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Sentiment
      </Typography>

      {sentimentData.map((platform, index) => (
        <Box key={index} mb={2}>
          <Typography variant="body1" mb={1}>
            {platform.name}
          </Typography>
          <Box display="flex" alignItems="center">
            <LinearProgress
              variant="determinate"
              value={platform.positive}
              sx={{
                flexGrow: 1,
                height: 10,
                borderRadius: 5,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "green",
                },
              }}
            />
            <Box ml={1} minWidth={50}>
              <Typography variant="body2" color="green">
                {platform.positive}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={platform.negative}
              sx={{
                flexGrow: 1,
                height: 10,
                borderRadius: 5,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "red",
                },
                ml: 1,
              }}
            />
          </Box>
        </Box>
      ))}

      {/* Legend */}
      <Grid container justifyContent="flex-start" mt={2}>
        <Grid item xs={3} display="flex" alignItems="center">
          <Box width={10} height={10} bgcolor="green" mr={1}></Box>
          <Typography variant="caption">Positive</Typography>
        </Grid>
        <Grid item xs={3} display="flex" alignItems="center">
          <Box width={10} height={10} bgcolor="red" mr={1}></Box>
          <Typography variant="caption">Negative</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SentimentAnalysis;
