import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import React from 'react';

interface EmotionalTone {
  tone: string;
  score: number;
}

interface EmotionalTonesCardProps {
  emotionalTones: EmotionalTone[];
}

const EmotionalTonesCard: React.FC<EmotionalTonesCardProps> = ({ emotionalTones }) => {
  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2} bgcolor="white">
      {/* Title */}
      <Typography variant="h6" fontWeight="bold">
        Emotional Tones Analysis
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Breakdown of emotional tones detected in the conversation.
      </Typography>

      {/* Emotional Tones */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {emotionalTones.map((tone, index) => (
          <Grid item xs={12} key={index} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              {tone.tone.toUpperCase()}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={tone.score * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: tone.tone === 'positive' ? 'green' : tone.tone === 'negative' ? 'red' : 'blue',
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              {tone.score * 100}%
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmotionalTonesCard;
