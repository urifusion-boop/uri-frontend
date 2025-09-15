import { EngagementStackedBarProps } from '@/models/dtos/EngagementDto';
import { Box, Typography, useMediaQuery } from '@mui/material';
import React, { useCallback } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { BsChatLeftTextFill } from 'react-icons/bs';
import { FaDiamond, FaShare } from 'react-icons/fa6';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack, VictoryTheme, VictoryTooltip } from 'victory';
import InsightToolTipBox from './InsightToolTipBox';

const sentiments = [
  { sentiment: 'Positive', percentage: 50 },
  { sentiment: 'Neutral', percentage: 30 },
  { sentiment: 'Negative', percentage: 20 },
];

const colorScale = {
  Negative: '#e74c3c', // Red for Negative
  Neutral: '#f39c12', // Orange for Neutral
  Positive: '#27ae60', // Green for Positive
};

const barChartData = [
  {
    name: 'likes',
    total_value: {
      breakdowns: [
        {
          results: [
            { dimension_values: ['POST'], value: 20 }, // Only POST
            { dimension_values: ['CAROUSEL_CONTAINER'], value: 11 }, // Complete media type
          ],
        },
      ],
    },
  },
  {
    name: 'comments',
    total_value: {
      breakdowns: [
        {
          results: [
            { dimension_values: ['POST'], value: 2 }, // Only POST
            // Missing CAROUSEL_CONTAINER, so it will be treated as zero
          ],
        },
      ],
    },
  },
  {
    name: 'shares',
    total_value: {
      breakdowns: [
        {
          results: [
            { dimension_values: ['CAROUSEL_CONTAINER'], value: 1 }, // Only CAROUSEL_CONTAINER
            { dimension_values: ['POST'], value: 1 }, // POST available
          ],
        },
      ],
    },
  },
];

function Engagements(igUserId: string) {
  const isTablet = useMediaQuery('(max-width:1200px)');

  return (
    <div>
      <Typography fontSize={isTablet ? 20 : 24} fontWeight={600} variant="h4">
        Engagements
      </Typography>

      <Box marginTop={2} display={'grid'} gridTemplateColumns={isTablet ? '1fr' : '1fr auto auto auto'} gap={2}>
        <Box bgcolor={'#fff'} display={'flex'} flexDirection={isTablet ? 'column' : 'row'} padding={2} gap={2} borderRadius={'8px'}>
          <InsightToolTipBox
            toolTipTitle="Total Feedback"
            customComponent={
              <Box paddingRight={4} borderRight={'1px solid gray'}>
                <Typography fontSize={14}>Total Feedback</Typography>
                <Typography variant="h5" fontWeight={600}>
                  1000
                </Typography>
              </Box>
            }
          />

          {sentiments.map((item) => (
            <Box key={item.sentiment} display={'flex'} padding={2} borderRadius={'8px'} alignItems={'center'} bgcolor={'#F8F8F8'} gap={2}>
              <Typography>{item.sentiment}</Typography>
              <Typography fontWeight={600} fontSize={20} variant="h5">
                {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
        <Box display={'flex'} alignItems={'center'} padding={2} width={'100%'} justifyContent={'space-between'} borderRadius={'8px'} gap={6} bgcolor={'#fff'}>
          <Box>
            <Typography fontSize={14}>Share</Typography>
            <Typography variant="h5" fontWeight={600}>
              400
            </Typography>
          </Box>
          <Box>
            <FaShare size={25} color="#CD1B78" />
          </Box>
        </Box>
        <Box display={'flex'} alignItems={'center'} padding={2} width={'100%'} justifyContent={'space-between'} borderRadius={'8px'} gap={6} bgcolor={'#fff'}>
          <Box>
            <Typography fontSize={14}>Comments</Typography>
            <Typography variant="h5" fontWeight={600}>
              400
            </Typography>
          </Box>
          <Box>
            <BsChatLeftTextFill size={25} color="#800080" />
          </Box>
        </Box>
        <Box display={'flex'} alignItems={'center'} padding={2} width={'100%'} justifyContent={'space-between'} borderRadius={'8px'} gap={6} bgcolor={'#fff'}>
          <Box>
            <Typography fontSize={14}>Like</Typography>
            <Typography variant="h5" fontWeight={600}>
              400
            </Typography>
          </Box>
          <Box>
            <AiFillLike size={25} color="#FF0000" />
          </Box>
        </Box>
      </Box>

      <Box display={isTablet ? 'block' : 'grid'} gap={3} gridTemplateColumns={'1fr 1fr'} marginTop={3}>
        <Box bgcolor={'white'} borderRadius={'8px'} paddingLeft={2} paddingRight={2}>
          {/* <Header
            title="Reach and Impressions"
            colors={{ Reach: "#ff9800", Impression: "#4caf50" }}
          />
          <ReachAndImpression igUserId={igUserId} /> */}
        </Box>
        <Box bgcolor={'white'} borderRadius={'8px'} paddingLeft={2} paddingRight={2}>
          <Header title="Engagement Metrics by Post Type" colors={{ Carousel: '#ff9800', Post: '#4caf50' }} />
          <EngagementStackedBar data={barChartData} />
        </Box>
      </Box>
    </div>
  );
}

function Header({
  title,
  colors = colorScale,
}: Readonly<{
  title: string;
  colors?: any;
}>) {
  const isTablet = useMediaQuery('(max-width:1200px)');

  return (
    <Box display={isTablet ? 'block' : 'flex'} justifyContent={'space-between'} marginTop={2} paddingTop={2} alignItems={'center'}>
      <Typography fontSize={14} variant="h6">
        {title}
      </Typography>
      <Box display={'flex'} gap={2} marginTop={isTablet ? 2 : 0}>
        {Object.keys(colors)
          .reverse()
          .map((color, index) => (
            <Box key={index} display={'flex'} alignItems={'center'} gap={1}>
              <FaDiamond size={16} color={colors[color as keyof typeof colors]} />
              <Typography fontWeight={500} fontSize={12}>
                {color}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
}

const EngagementStackedBar: React.FC<EngagementStackedBarProps> = ({ data }) => {
  const chartData = useCallback(() => {
    return data.map((item) => {
      let postValue = 0;
      let carouselValue = 0;

      const results = item.total_value.breakdowns[0].results;
      results.forEach((result) => {
        if (result.dimension_values[0] === 'POST') {
          postValue = result.value;
        }
        if (result.dimension_values[0] === 'CAROUSEL_CONTAINER') {
          carouselValue = result.value;
        }
      });

      return {
        metric: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        POST: postValue,
        CAROUSEL_CONTAINER: carouselValue,
      };
    });
  }, [data]);

  const isTablet = useMediaQuery('(max-width:1200px)');

  return (
    <VictoryChart
      style={{
        parent: { border: 'none', marginTop: isTablet ? -20 : -40 },
      }}
      height={250}
      theme={VictoryTheme.material}
      domainPadding={20}
    >
      <VictoryAxis
        tickValues={['Likes', 'Comments', 'Shares']}
        style={{
          tickLabels: {
            fontSize: 6,
            fontFamily: 'Plus Jakarta Sans',
            fill: '#000',
            fontWeight: 600,
          },

          grid: { stroke: 'none' },
        }}
      />

      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `${x}`}
        style={{
          tickLabels: {
            fontSize: 6,
            fontFamily: 'Plus Jakarta Sans',
            fill: '#000',
            fontWeight: 600,
          },

          grid: { stroke: 'none' },
        }}
      />

      <VictoryStack colorScale={['#4caf50', '#ff9800']}>
        <VictoryBar
          barWidth={30}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          data={chartData()}
          x="metric"
          y="POST"
          labels={({ datum }) => `POST: ${datum.POST} engagements`}
          labelComponent={<VictoryTooltip flyoutStyle={{ fill: 'white' }} style={{ fontSize: 6, fill: '#000' }} />}
        />
        <VictoryBar
          barWidth={30}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          data={chartData()}
          x="metric"
          y="CAROUSEL_CONTAINER"
          labels={({ datum }) => `CarouselPost: ${datum.CAROUSEL_CONTAINER} engagements`}
          labelComponent={<VictoryTooltip flyoutStyle={{ fill: 'white' }} style={{ fontSize: 6, fill: '#000' }} />}
        />
      </VictoryStack>
    </VictoryChart>
  );
};

export default Engagements;
