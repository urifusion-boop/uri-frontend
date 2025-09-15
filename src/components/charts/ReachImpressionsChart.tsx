import { Box, Divider, MenuItem, Select, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import * as React from 'react';
import { useState } from 'react';
import { GoDotFill } from 'react-icons/go';

interface DataPoint {
  value: number;
  end_time: string;
}

interface MetricData {
  name: string;
  period: string;
  values: DataPoint[];
}

interface ReachImpressionsChartProps {
  data: MetricData[];
  removeFilter?: boolean;
  reach?: string;
  impressions?: string;
  removeImpression?: boolean;
}

const ReachImpressionsChart: React.FC<ReachImpressionsChartProps> = ({ data, removeFilter, reach = 'reach', impressions = 'impressions', removeImpression }) => {
  const [period, setPeriod] = useState('day');

  const filteredData = data.filter((metric) => metric.period === period);
  const reachData = filteredData.find((metric) => metric.name === reach)?.values || [];
  const impressionsData = filteredData.find((metric) => metric.name === impressions)?.values || [];

  const reachValues = reachData.map((item) => item.value);
  const impressionsValues = impressionsData.map((item) => item.value);
  const xLabels = reachData.map((item) =>
    new Date(item.end_time).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  );

  const topReachValue = Math.max(...reachValues);
  const lowestReachValue = Math.min(...reachValues);
  const topImpressionsValue = Math.max(...impressionsValues);
  const lowestImpressionsValue = Math.min(...impressionsValues);

  const formatDateWithDay = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const topReachDate = formatDateWithDay(reachData[reachValues.indexOf(topReachValue)]?.end_time);
  const lowestReachDate = formatDateWithDay(reachData[reachValues.indexOf(lowestReachValue)]?.end_time);
  const topImpressionsDate = formatDateWithDay(impressionsData[impressionsValues.indexOf(topImpressionsValue)]?.end_time);
  const lowestImpressionsDate = formatDateWithDay(impressionsData[impressionsValues.indexOf(lowestImpressionsValue)]?.end_time);

  return (
    <Box
      borderRadius={2}
      sx={{
        width: '100%',
        mx: 'auto',
        p: 3,
        backgroundColor: '#fff',
        mt: 1,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E0E0E0',
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
        Engagement Over Time
      </Typography>
      {/* Subtitle */}
      <Typography
        variant="subtitle2"
        sx={{
          mt: 2,
          mb: 2,
          color: '#7f8c8d',
          textAlign: 'center',
        }}
      >
        This graph shows the engagement trend over time, highlighting the highest and lowest touch points for reach{removeImpression ? '.' : 'and impressions.'}
      </Typography>
      {/* Filter Selection - Centered */}
      {!removeFilter && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            displayEmpty
            variant="outlined"
            sx={{
              textAlign: 'center',
              border: 'none',
              '& fieldset': { border: 'none' }, // Removes outline
              '& .MuiSelect-select': {
                padding: '8px 16px',
                fontWeight: 'thin',
                color: 'gray',
                fontSize: 12,
              },
            }}
          >
            <MenuItem value="day">daily</MenuItem>
            <MenuItem value="week">weekly</MenuItem>
            <MenuItem value="days_28">Last 28 Days</MenuItem>
          </Select>
        </Box>
      )}

      {/* Legend */}
      <Box display="flex" justifyContent="center" gap={4} mb={2}>
        <Box display="flex" alignItems="center">
          <GoDotFill size={14} color={'#CD1B78'} />
          <Typography fontSize={14} fontWeight={600} marginLeft={1} color={'#CD1B78'}>
            Reach
          </Typography>
        </Box>
        {!removeImpression && (
          <Box display="flex" alignItems="center">
            <GoDotFill size={14} color={'#C4C4C4'} />
            <Typography fontSize={14} fontWeight={600} marginLeft={1} color={'#C4C4C4'}>
              Impression
            </Typography>
          </Box>
        )}
      </Box>

      {/* Scrollable Chart Wrapper with Thin and Low-Opacity Scrollbar */}
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          scrollbarWidth: 'thin', // Firefox support
          '&::-webkit-scrollbar': {
            height: '4px', // Extremely thin
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(205, 27, 120, 0.5)', // Thumb color with reduced opacity
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(240, 240, 240, 0.6)', // Track with slight transparency
          },
        }}
      >
        {/* Chart Container */}
        <Box sx={{ width: `${xLabels.length * 80}px`, minWidth: '100%' }}>
          <LineChart
            height={400}
            series={[
              {
                data: reachValues,
                color: '#CD1B78',
              },
              ...(removeImpression
                ? []
                : [
                    {
                      data: impressionsValues,
                      color: '#C4C4C4',
                    },
                  ]),
            ]}
            xAxis={[
              {
                scaleType: 'point',
                data: xLabels,
                tickSize: 10,
                tickLabelStyle: {
                  fill: '#333',
                  fontSize: 12,
                  transform: 'rotate(45deg)', // Rotate labels for better visibility
                  textAnchor: 'start', // Align properly after rotation
                },
              },
            ]}
            yAxis={[
              {
                tickSize: 10,
                tickLabelStyle: {
                  fill: '#000',
                  fontSize: 12,
                },
              },
            ]}
            tooltip={{
              trigger: 'axis',
              slotProps: {
                axisContent: {
                  sx: {
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                  },
                },
              },
            }}
            grid={{
              horizontal: true,
              vertical: true,
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Bottom Highlight Section */}
      <Box display="flex" alignItems="center" mt={2} gap={2} className="flex-col md:flex-row justify-center md:gap-6">
        <Box textAlign="center">
          <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'gray' }}>
            Top Reach: {topReachValue} on {topReachDate}
          </Typography>
          <Typography variant="body2" sx={{ color: '#C4C4C4' }}>
            Lowest Reach: {lowestReachValue} on {lowestReachDate}
          </Typography>
        </Box>

        {!removeImpression && (
          <Box textAlign="center">
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'gray' }}>
              Top Impression: {topImpressionsValue} on {topImpressionsDate}
            </Typography>
            <Typography variant="body2" sx={{ color: '#C4C4C4' }}>
              Lowest Impression: {lowestImpressionsValue} on {lowestImpressionsDate}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReachImpressionsChart;
