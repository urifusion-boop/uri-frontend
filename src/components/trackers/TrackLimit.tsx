import { Box, Chip, Typography } from '@mui/material';

import CustomProgressBar from '@/components/atoms/CustomProgressBar';
import Tooltip from '@/components/atoms/Tooltip';
import { useMemo } from 'react';
import { BiBriefcase } from 'react-icons/bi';
import { FaCrown } from 'react-icons/fa6';

{
  /* <TrackLimit planName="Premium Plan" planLimit={3} currentUsage={1} description="This plan allows you to track 2 keywords." />; */
}
interface TrackLimitProps {
  planName: string;
  planLimit: number;
  currentUsage: number;
  description: string;
  type?: 'card' | 'snackbar';
}

const TrackLimit = ({ planName, planLimit, currentUsage, description, type = 'card' }: TrackLimitProps) => {
  const isUnlimited = useMemo(() => planLimit <= 0, [planLimit]);

  if (type === 'snackbar') {
    return (
      <Box sx={{ flex: 1, boxShadow: '0px 2px 5px 0px rgba(124, 115, 115, 0.1)', borderRadius: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <FaCrown style={{ marginRight: 4 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
            {isUnlimited ? `Unlimited Tracking, Enjoy!` : `${currentUsage} of ${planLimit} Tracked`}
          </Typography>
          <Tooltip text={description} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 5 } }}>
          <Box flex={1} width="100%">
            <CustomProgressBar percentage={isUnlimited ? 100 : currentUsage / planLimit} height={8} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ borderRadius: 2, bgcolor: 'background.paper', py: 3, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <BiBriefcase style={{ marginRight: 4 }} />
          <Typography variant="h6" fontWeight={600} component="span" sx={{ mr: 2 }}>
            {planName}
          </Typography>
          <Chip
            label="Active"
            variant="outlined"
            size="small"
            color="primary"
            sx={{
              padding: 1,
              borderRadius: 2,
              '& .MuiChip-label': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
            icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2ecc71', mr: 0.5 }} />}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 5 } }}>
        <Box flex={1} width="100%">
          <CustomProgressBar percentage={isUnlimited ? 100 : currentUsage / planLimit} height={8} />
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          {isUnlimited ? `Unlimited Tracking, Enjoy!` : `${currentUsage} of ${planLimit} Tracked`}
        </Typography>
      </Box>
    </Box>
  );
};

export default TrackLimit;
