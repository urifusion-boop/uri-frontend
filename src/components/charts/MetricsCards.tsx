import { Grid, useMediaQuery } from '@mui/material';

import MetricCard from '../cards/MetricCard';

// MetricsCards component now accepts props
const MetricsCards = ({ metricsData, isLoading }: any) => {
  const isMobile = useMediaQuery('(max-width:800px)');
  const isTablet = useMediaQuery('(max-width:1200px)');

  return (
    <Grid display="grid" gridTemplateColumns={isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4, 1fr)'} gap={2} spacing={2}>
      {metricsData?.map((metric: any, index: any) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard metric={metric} isMobile={isMobile} isLoading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsCards;
