import { Box, Skeleton, Typography } from '@mui/material';
import React, { memo } from 'react';

import { NumberHelper } from '@/helpers/NumberHelper';

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const HashtagAnalyticsCard = memo(({ title, value, icon, isLoading }: AnalyticsCardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '0px 29px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
        width: { xs: '100%', md: 'calc(33.33% - 32px)' },
        justifyContent: 'space-between',
        height: '177px',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: '20px',
            color: '#3A3A3A',
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '32px',
            color: '#282828',
            fontWeight: 700,
          }}
        >
          {isLoading ? <Skeleton variant="text" width={100} /> : NumberHelper.formatNumber(Number(value))}
        </Typography>
      </Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '8px',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
});

HashtagAnalyticsCard.displayName = 'HashtagAnalyticsCard';

export default HashtagAnalyticsCard;
