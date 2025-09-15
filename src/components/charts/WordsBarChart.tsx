import * as React from 'react';

import { Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

interface HorizontalBarsProps {
  dataset: { hashtag: string; count: number }[]; // Define the structure of the data
}

function HorizontalBars({ dataset }: Readonly<HorizontalBarsProps>) {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
        padding: '20px',
        marginTop: '36px',
        overflow: 'hidden', // Prevents chart overflow
        maxWidth: '100%', // Container width will adapt to screen size
      }}
    >
      <Box
        sx={{
          width: '100%', // Full width for responsiveness
          maxWidth: '900px', // Maximum width to avoid over-expansion
          margin: '0 auto', // Center chart in the container
        }}
      >
        <BarChart
          dataset={dataset} // Use the passed-in dataset
          yAxis={[
            {
              scaleType: 'band',
              dataKey: 'hashtag',
              label: '', // Label for the y-axis
            },
          ]}
          xAxis={[
            {
              label: 'Frequency', // Label for the x-axis
            },
          ]}
          series={[
            {
              dataKey: 'count',
              label: 'Hashtag Mentions',
              color: '#888', // Default bar color
            },
          ]}
          layout="horizontal"
          margin={{ top: 100, right: 20, bottom: 80, left: 180 }}
          height={670} // Fixed height
        />
      </Box>
    </Box>
  );
}

export default React.memo(HorizontalBars, (prevProps, nextProps) => {
  return prevProps?.dataset?.length === nextProps?.dataset?.length;
});
