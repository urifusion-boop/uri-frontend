import { Box, Skeleton, Typography } from '@mui/material';
import { memo, useMemo } from 'react';

import { TextHelper } from '@/helpers/TextHelper';
import { PieChart } from '@mui/x-charts/PieChart';
import { GoDotFill } from 'react-icons/go';

const defaultDynamicColors = [
  '#4e79a7', // blue
  '#f28e2c', // orange
  '#e15759', // red
  '#76b7b2', // teal
  '#59a14f', // green
  '#edc949', // yellow
  '#af7aa1', // purple
  '#ff9da7', // pink
  '#9c755f', // brown
  '#bab0ab', // gray
];

interface PieActiveArcProps {
  data: any[]; // Accept any object structure
  xKey: string; // Key for x-axis (e.g., "post_type")
  yKey: string; // Key for y-axis (e.g., "count")
  title?: string; // Chart title
  subtitle?: string; // Chart subtitle
  description?: string; // Chart description
  colorSet?: string[]; // Optional custom color set
  isLoading?: boolean;
  marginTop?: number;
}

function PostTypePieChart({ data, xKey, yKey, title = 'Pie Chart', subtitle, description, colorSet = defaultDynamicColors, isLoading, marginTop }: Readonly<PieActiveArcProps>) {
  // Check if data exists and has items
  const hasData = Array.isArray(data) && data.length > 0;

  const formattedData = useMemo(
    () =>
      hasData
        ? data.map((item, index) => ({
            id: item[xKey],
            value: item[yKey],
            label: `${item[xKey]}: ${item[yKey]}`,
            color: colorSet[index % colorSet.length], // Use custom color set or fallback to default
          }))
        : [],
    [hasData, data, xKey, yKey, colorSet]
  );

  return (
    <Box>
      {title && (
        <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1} fontSize={20} color={'#181818'}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="subtitle1" align="center" color="#181818" marginBottom={2} fontSize={16}>
          {subtitle}
        </Typography>
      )}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 2,
            height: '100%',
          }}
        >
          <Skeleton variant="circular" height={250} width={250} animation="wave" />
        </Box>
      ) : (
        <>
          {hasData ? (
            <>
              <PieChart
                margin={{ left: 10, right: 10, top: marginTop ?? 0 }}
                series={[
                  {
                    data: formattedData,
                    highlightScope: { fade: 'global' },
                    faded: {
                      innerRadius: 80,
                      additionalRadius: -30,
                      color: 'gray',
                    },
                  },
                ]}
                slotProps={{ legend: { hidden: true } }}
                rightAxis={null}
                height={250}
              />
              <Box
                display="flex"
                marginTop={3}
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
                justifySelf={'center'}
              >
                {data.map((item, index) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    key={item[xKey]} // Use xKey value as the unique key
                    marginRight={2}
                  >
                    <GoDotFill
                      size={12}
                      color={colorSet[index % colorSet.length]} // Use custom color set or fallback to default
                    />
                    <Typography className="font-bold " sx={{ fontSize: '12px' }}>
                      {TextHelper.removeChar(item[xKey], '_')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Typography variant="body2" align="center" color="textSecondary" marginTop={2} fontSize={13}>
              No data available
            </Typography>
          )}
        </>
      )}
      {description && (
        <Typography variant="body2" align="center" color="textSecondary" marginTop={2} fontSize={13}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default memo(PostTypePieChart, (prevProps, nextProps) => {
  return prevProps?.data?.length === nextProps?.data?.length;
});

PostTypePieChart.displayName = 'PostTypePieChart';
