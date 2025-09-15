import React from "react";
import { Box, Typography, Grid, Paper, LinearProgress } from "@mui/material";

type Suggestion = {
  title: string;
  description: string;
  priority_score: string; // Using string type for consistency with provided data
};

type SuggestionsCardProps = {
  improvement_suggestions: Suggestion[] | [] | undefined;
};

const SuggestionsCard: React.FC<SuggestionsCardProps> = ({
  improvement_suggestions,
}) => {
  if (!improvement_suggestions?.length) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        px: 4,
        py: 3,
        borderRadius: 2,
        mx: "auto",
        bgcolor: "white",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Title */}
      <Typography fontSize={20} fontWeight={600}>
        Top Suggested Improvements
      </Typography>
      <Typography fontSize={14} color="textSecondary" sx={{ mb: 3 }}>
        Suggestions ranked by priority to enhance engagement
      </Typography>

      {/* Header */}
      <Grid container sx={{ mb: 2, pb: 1, borderBottom: "1px solid #ddd" }}>
        <Grid item xs={9}>
          <Typography fontSize={14} fontWeight={600}>
            Improvement
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ textAlign: "right" }}>
          <Typography fontSize={14} fontWeight={600}>
            Priority Score
          </Typography>
        </Grid>
      </Grid>

      {/* Suggested Improvements */}
      {improvement_suggestions?.slice(0, 3).map((suggestion, idx) => (
        <Box
          key={idx}
          sx={{
            pb: 3,
            mb: 4.2,
            borderBottom:
              idx < improvement_suggestions.length - 1 ? "1px solid #ddd" : "",
          }}
        >
          <Grid container>
            <Grid item xs={9} maxWidth={"409px"}>
              <Typography fontSize={16} fontWeight={600} mb={1.5}>
                {suggestion.title}
              </Typography>
              <Typography fontSize={14} color="textSecondary" mb={0.8}>
                {suggestion.description}
              </Typography>
            </Grid>

            <Grid item xs={3} sx={{ textAlign: "right" }}>
              <Typography fontSize={16} fontWeight={600}>
                {parseFloat(suggestion.priority_score) * 100}%
              </Typography>
            </Grid>
          </Grid>

          {/* Progress Bar */}
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={parseFloat(suggestion.priority_score) * 100}
              sx={{
                height: 6,
                borderRadius: 4,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#CD1B78",
                },
              }}
            />
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default SuggestionsCard;
