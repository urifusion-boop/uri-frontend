import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

// Define the data structure for the performance score breakdown
interface PerformanceScore {
  title: string;
  description: string;
  score: string;
  rating: string;
}

interface PerformanceOverviewCardProps {
  averagePerformanceScore: string | undefined;
  performanceScores: PerformanceScore[] | [] | undefined;
}

const PerformanceOverviewCard: React.FC<PerformanceOverviewCardProps> = ({ averagePerformanceScore, performanceScores }) => {
  return performanceScores && performanceScores.length > 0 ? (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>
      {/* Performance Score Card */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            Performance Score
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {averagePerformanceScore} / 5
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Performance Score Breakdown */}
        <Grid container spacing={2}>
          {performanceScores.map((score, idx) => (
            <Grid item xs={12} key={idx}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: idx < performanceScores.length - 1 ? '1px solid #ddd' : '',
                  pb: 2,
                  mb: 2,
                }}
              >
                {/* Score Title & Description */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {score.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {score.description}
                  </Typography>
                </Box>

                {/* Score & Rating */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {score.score}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    / 100
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Learn More Link */}
      {/* <Link
//         href="#"
//         underline="hover"
//         sx={{ display: "block", textAlign: "center", mt: 2 }}
//       >
//         Learn how to improve your performance
//       </Link> */}
    </Box>
  ) : null;
};

export default PerformanceOverviewCard;
