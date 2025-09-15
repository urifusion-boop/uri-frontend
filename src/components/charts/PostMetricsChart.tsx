import { Box, Typography, useMediaQuery } from '@mui/material';
import * as React from 'react';
import { FaDiamond } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import CustomBarChart from './CustomBarChart';
import PieActiveArc from './PieActiveArc';

// Define the structure of the data
interface BarChartData {
  name: string;
  value: number;
  title: string;
  description: string;
}

// Array of colors for dynamic color assignment
const dynamicColors = [
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

const validNames = new Set([
  'comments',
  'likes',
  'saved',
  'shares',
  'like',
  'reply',
  'quote',
  'impression',
  'retweet',
  'post_impressions',
  'post_impressions_unique',
  'post_video_views',
  'blue_reels_play_count',
  'fb_reels_replay_count',
  'fb_reels_total_plays',
  'post_impressions_unique',
  'post_video_followers',
]);
// Bar chart component styled according to the sample code

// Legend component for displaying metric types with their dynamically assigned colors
const Legend: React.FC<{ data: BarChartData[] }> = ({ data }) => (
  <Box display="flex">
    {data
      .filter((item) => validNames.has(item.name))
      .map((metric, index) => (
        <Box key={metric.name} display="flex" alignItems="center" marginLeft={2}>
          <FaDiamond size={22} color={dynamicColors[index % dynamicColors.length]} /> {/* Dynamic color for legend */}
          <Typography fontWeight={500} fontSize={10} fontFamily="Plus Jakarta Sans" marginLeft={1}>
            {metric.title}
          </Typography>
        </Box>
      ))}
  </Box>
);

// Main component to render the bar chart
const PostMetricsChart = ({ barChartMediaData }: { barChartMediaData: BarChartData[] | [] }) => {
  const pieChartData = barChartMediaData
    ?.filter((item) => validNames.has(item.name))
    .map((item) => ({
      x: item.title,
      y: item.value,
    }));

  const isMobile = useMediaQuery('(max-width:800px)');

  return (
    <>
      <Box border={'1px solid #f0f0f0'}>
        <Box bgcolor={'#fff'} padding={2} borderRadius={'8px'} marginBottom={1}>
          <Typography fontWeight={500} fontSize={18} fontFamily="Plus Jakarta Sans" justifyContent={'center'} alignItems={'center'}>
            Breakdown
          </Typography>
        </Box>
        <Legend data={barChartMediaData} />
        <Box bgcolor={'#fff'} display={'flex'} alignItems={'center'} padding={2} borderRadius={'8px'}>
          <Typography
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontSize: isMobile ? 12 : 16,
              fontFamily: 'Plus Jakarta Sans',
              marginRight: -40,
              marginTop: isMobile ? -20 : -40,
              fontWeight: 600,
            }}
          >
            Total Interactions
          </Typography>
          <CustomBarChart data={barChartMediaData} />
        </Box>
      </Box>
      <Box border={'1px solid #f0f0f0'} padding={2}>
        <Typography fontWeight={500} fontSize={18} fontFamily="Plus Jakarta Sans" justifyContent={'center'} alignItems={'center'}>
          Summary and Distribution
        </Typography>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
          <PieActiveArc data={pieChartData} />
          <Box marginTop={isMobile ? 0 : 2} display={'flex'} flexWrap={'wrap'} gap={1} marginBottom={3}>
            {pieChartData?.map((item, index) => (
              <Box display="flex" alignItems="center" key={item.x}>
                <GoDotFill size={12} color={dynamicColors[index % dynamicColors.length]} />
                <Typography fontSize={12} fontFamily="Plus Jakarta Sans" marginLeft={1}>
                  {item.x}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PostMetricsChart;
