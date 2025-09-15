import { Box, Typography, styled } from '@mui/material';
import { chartsGridClasses, useDrawingArea, useXScale, useYScale } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';

interface ComparisonBarChartProps {
  title: string;
  description?: string;
  series: any[];
  xAxisData: string[];
  yAxisLabel: string;
  height?: number;
  gridVertical?: boolean;
  gridHorizontal?: boolean;
  loading?: boolean;
  width?: number;
  alignItems?: string;
}

const fakeSeries = [
  {
    label: 'Loading...',
    data: [5, 10, 8, 12, 6],
  },
];

const fakeXAxisData = ['A', 'B', 'C', 'D', 'E'];

// Styled components for placeholder loading
const LoadingRect = styled('rect')({
  opacity: 0.2,
  fill: 'lightgray',
});

const LoadingText = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

function PlaceholderLoadingOverlay() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale();
  const { left, width, height } = useDrawingArea();

  const bandWidth = xScale.bandwidth();
  const [bottom, top] = yScale.range();
  const ratios = [0.2, 0.8, 0.6, 0.5];

  return (
    <g>
      {xScale.domain().map((item, index) => {
        const ratio = ratios[index % ratios.length];
        const barHeight = ratio * (bottom - top);
        return <LoadingRect key={index} x={xScale(item)} width={bandWidth} y={bottom - barHeight} height={barHeight} />;
      })}
      <LoadingText x={left + width / 2} y={top + height / 2}>
        Loading data...
      </LoadingText>
    </g>
  );
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  title,
  description,
  series,
  xAxisData,
  yAxisLabel,
  height = 350,
  gridHorizontal,
  gridVertical,
  loading = false,
  width,
  alignItems,
}) => {
  const options = {
    yAxis: [{ label: yAxisLabel }],
    grid: { horizontal: gridHorizontal, vertical: gridVertical },
  };

  if (loading) {
    return (
      <Box
        sx={{
          overflowX: 'auto',
          paddingBottom: 2,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d8d8d8',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          pl: 2,
        }}
        style={{ maxWidth: '100%', overflowX: 'auto' }}
      >
        <BarChart
          height={height ?? 300}
          loading
          xAxis={[
            {
              scaleType: 'band',
              data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            },
          ]}
          slots={{ loadingOverlay: PlaceholderLoadingOverlay }}
          series={[]}
          margin={{ top: 10, right: 10, left: 25, bottom: 25 }}
        />
      </Box>
    );
  }

  return (
    <Box py={3} sx={{ display: 'grid', gap: 4, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'center',
          alignItems: alignItems ?? 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </Box>

      <Box
        sx={{
          overflowX: 'auto',
          paddingBottom: 2,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d8d8d8',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          pl: 2,
        }}
        style={{ maxWidth: '100%', overflowX: 'auto' }}
      >
        <BarChart
          series={loading ? fakeSeries : series}
          xAxis={[{ data: loading ? fakeXAxisData : xAxisData, scaleType: 'band' }]}
          height={height}
          width={width}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: -10,
              itemGap: 25,
              markGap: 8,
              itemMarkHeight: 8,
              itemMarkWidth: 8,
              labelStyle: { fontSize: 14, fontWeight: 500, color: '#101010' },
            },
          }}
          margin={{ top: 10, bottom: 70, left: 40, right: 10 }}
          sx={{
            [`& .${chartsGridClasses.line}`]: {
              strokeDasharray: '5 3',
              strokeWidth: 2,
            },
          }}
          {...options}
        />
      </Box>
    </Box>
  );
};

export default ComparisonBarChart;
