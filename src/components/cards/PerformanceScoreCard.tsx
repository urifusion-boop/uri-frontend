import React from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import {
  IndustryClassification,
  PerformanceScoreBreakdown,
} from '@/models/dtos/AiMediaReportDto';

interface PerformanceOverviewCardProps {
  industryClassification: IndustryClassification;
  performanceScoreBreakdown: PerformanceScoreBreakdown;
}

const PerformanceOverviewCard: React.FC<PerformanceOverviewCardProps> = ({
  industryClassification,
  performanceScoreBreakdown,
}) => {
  return (
    <Box className='px-4 py-3 bg-white shadow-sm rounded-md space-y-6'>
      {/* AI Industry Classification */}
      <Box className='px-4 py-3 bg-white shadow-sm rounded-md border'>
        <div className='flex justify-between items-center'>
          <Typography fontWeight={600} fontSize={20}>
            AI Industry Classification
          </Typography>
          <MusicNoteIcon sx={{ fontSize: 36, color: '#CD1B78' }} />
        </div>
        <Typography
          fontWeight={600}
          fontSize={18}
          className='text-[#CD1B78] mt-1'>
          {industryClassification.industry_name || 'N/A'}
        </Typography>
        <Typography fontSize={14} color='text.secondary' className='mt-2'>
          {industryClassification.overview ||
            'No detailed overview available for this industry.'}
        </Typography>
      </Box>

      {/* Performance Score */}
      <Box className='px-4 py-3 bg-white shadow-sm rounded-md'>
        <div className='flex justify-between items-center'>
          <Typography fontWeight={600} fontSize={20}>
            Performance Score
          </Typography>
          <Typography fontWeight={600} fontSize={24} className='text-[#CD1B78]'>
            {performanceScoreBreakdown.average_performance_score || 'N/A'} / 100
          </Typography>
        </div>
        <div className='mt-[40px] flex flex-wrap justify-center gap-3 items-center md:grid md:grid-cols-3'>
          {performanceScoreBreakdown.performance_scores?.map((score) => (
            <CircularProgressWithLabel
              key={`score-${score.title.toLowerCase().replace(/\s+/g, '-')}`}
              value={parseFloat(score.score)}
              title={score.title}
            />
          ))}
        </div>
      </Box>

      {/* Score Summary Card */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#FFF',
        }}>
        <Typography variant='h6' fontWeight='bold'>
          Score Summary
        </Typography>
        <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
          Your performance score is calculated based on key engagement metrics.
          A higher score indicates better engagement, reach, and content
          quality.
        </Typography>
      </Paper>
    </Box>
  );
};

// Circular Progress with Label Component
const CircularProgressWithLabel = ({
  value,
  title,
}: {
  value: number;
  title: string;
}) => {
  return (
    <Box position='relative' display='inline-flex' className='w-fit'>
      {/* Circular Progress */}
      <CircularProgress
        variant='determinate'
        value={100}
        size={120}
        thickness={5}
        sx={{ color: '#FFE4F24D' }} // Background progress color
      />
      <CircularProgress
        variant='determinate'
        value={value}
        size={120}
        thickness={5}
        sx={{ color: '#CD1B78', position: 'absolute' }} // Foreground progress color
      />

      {/* Text Inside */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Typography
          variant='caption'
          component='div'
          className='text-center'
          fontSize={21}
          sx={{
            color: 'text.secondary',
          }}>{`${value}%`}</Typography>
        <Typography
          variant='caption'
          component='div'
          fontWeight={500}
          className='text-center -mt-2 text-[#CD1B78]'
          fontSize={10}
          sx={{
            maxWidth: '80px',
          }}>
          {`${title}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default PerformanceOverviewCard;
