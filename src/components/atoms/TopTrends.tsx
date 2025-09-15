import { Box, Typography, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { FaHashtag, FaTwitter } from 'react-icons/fa';
import { IoGlobeOutline } from 'react-icons/io5';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTooltip } from 'victory';
import Text from './CustomText';

interface Breakdown {
  dimension_keys: string[];
}

interface TotalValue {
  value: number;
  breakdowns: Breakdown[];
}

interface MetricData {
  name: string;
  period: string;
  title: string;
  description: string;
  total_value: TotalValue;
  id: string;
}

const TopTrends: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:800px)');

  const [, setEndAngle] = React.useState(0);
  const [selectedData, setSelectedData] = React.useState<any>();

  React.useEffect(() => {
    setTimeout(() => {
      setEndAngle(360);
    }, 100);
  }, []);

  const data: MetricData = {
    name: 'profile_links_taps',
    period: 'day',
    title: 'Top Trends',
    description: 'The number of taps on your business address, call button, email button and text button.',
    total_value: {
      value: 0, // Assume this will be updated dynamically when taps are recorded
      breakdowns: [
        {
          dimension_keys: ['Business Address', 'Call Button', 'Email Button', 'Text Button'],
        },
      ],
    },
    id: '17841464129861404/insights/profile_links_taps/day',
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  // Example taps data
  const tapsData = [
    { contact_button_type: 'Business Address', taps: 5 },
    { contact_button_type: 'Call Button', taps: 10 },
    { contact_button_type: 'Email Button', taps: 3 },
    { contact_button_type: 'Text Button', taps: 2 },
  ];

  const nonZeroBreakdowns = tapsData.filter((b) => b.taps > 0);

  if (nonZeroBreakdowns.length === 0) {
    return <p>No data available yet for Profile Links Taps</p>;
  }

  // Your two datasets (orange)
  const dataSet1 = [
    { x: new Date(2017, 8, 7), y: 50 },
    { x: new Date(2017, 8, 19), y: 190 },
    { x: new Date(2017, 9, 1), y: 210 },
    { x: new Date(2017, 9, 14), y: 240 },
    { x: new Date(2017, 9, 25), y: 220 }, // Highest point
    { x: new Date(2017, 10, 4), y: 90 },
    { x: new Date(2017, 10, 15), y: 550 },
    { x: new Date(2017, 10, 24), y: 250 },
    { x: new Date(2017, 11, 10), y: 150 },
    { x: new Date(2017, 11, 20), y: 200 },
    { x: new Date(2017, 11, 29), y: 50 },
  ];

  // green
  const dataSet2 = [
    { x: new Date(2017, 8, 7), y: 90 },
    { x: new Date(2017, 8, 19), y: 230 },
    { x: new Date(2017, 9, 1), y: 180 },
    { x: new Date(2017, 9, 14), y: 250 },
    { x: new Date(2017, 9, 25), y: 270 },
    { x: new Date(2017, 10, 4), y: 90 },
    { x: new Date(2017, 10, 15), y: 230 },
    { x: new Date(2017, 10, 24), y: 250 },
    { x: new Date(2017, 11, 10), y: 1300 },
    { x: new Date(2017, 11, 20), y: 200 },
    { x: new Date(2017, 11, 29), y: 60 },
  ];

  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2} bgcolor="white">
      <Typography fontSize={isMobile ? 14 : 16} variant="h6" mb={2}>
        {data.title}
      </Typography>
      <Box style={{ position: 'relative' }}>
        <VictoryChart
          width={780}
          style={{
            parent: {
              border: 'none',
              width: '100%',
              height: '250px',
              padding: '0px',
            },
          }}
          height={300}
          padding={{ top: 20, bottom: 30, left: 35, right: 10 }}
          domainPadding={0}
        >
          <VictoryAxis
            tickFormat={(x) => dayjs(x).format('MMM YYYY')}
            style={{
              axis: { stroke: '#756f6a' },
              ticks: { stroke: 'grey', size: 5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={formatNumber}
            style={{
              axis: { stroke: '#756f6a' },
              ticks: { stroke: 'grey', size: 5 },
              grid: {
                stroke: '#e5e5e570',
                strokeWidth: 1,
              },
            }}
          />

          <VictoryLine data={dataSet1} style={{ data: { stroke: 'orange', strokeWidth: 3 } }} />
          <VictoryScatter
            data={dataSet1}
            size={5}
            style={{ data: { fill: 'orange' } }}
            labels={({ datum }) => 'B'}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: 20, fill: 'white' }} // Tooltip text style
                flyoutStyle={{
                  fill: 'orange', // Tooltip background color
                  stroke: 'white', // Tooltip border color
                  padding: '20px',
                  borderRadius: '100px',
                }}
                cornerRadius={20}
              />
            }
            events={[
              {
                target: 'data', // Target the data points (dots)
                eventHandlers: {
                  onMouseEnter: (event, data) => {
                    setSelectedData({ ...data.datum, color: 'orange' }); // Pass the data of the hovered dot
                  },
                  onMouseLeave: (event, data) => {
                    setSelectedData(null); // Pass the data of the hovered dot
                  },
                },
              },
            ]}
          />

          {/* Line and scatter plot for dataSet2 */}
          <VictoryLine data={dataSet2} style={{ data: { stroke: 'lime', strokeWidth: 3 } }} />
          <VictoryScatter
            data={dataSet2}
            size={5}
            style={{ data: { fill: 'lime' } }}
            labels={({ datum }) => 'A'}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: 20, fill: 'white' }} // Tooltip text style
                flyoutStyle={{
                  fill: 'lime', // Tooltip background color
                  stroke: 'white', // Tooltip border color
                  padding: '20px',
                  borderRadius: '100px',
                }}
                cornerRadius={20}
              />
            }
            events={[
              {
                target: 'data', // Target the data points (dots)
                eventHandlers: {
                  onMouseEnter: (event, data) => {
                    setSelectedData({ ...data.datum, color: 'lime' }); // Pass the data of the hovered dot
                  },
                  onMouseLeave: (event, data) => {
                    setSelectedData(null); // Pass the data of the hovered dot
                  },
                },
              },
            ]}
          />
        </VictoryChart>

        {selectedData && (
          <Box
            style={{
              position: 'absolute',
              left: '0px',
              bottom: '100%',
              width: '300px',
              height: '300px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.2)',
            }}
          >
            <Box
              className="d-flex justify-start"
              style={{
                flexDirection: 'row',
                borderBottom: '1px solid lightgray',
                padding: '10px 15px',
                alignItems: 'center',
              }}
            >
              <Box
                className="d-flex justify-center align-center"
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: selectedData.color ?? 'lime',
                  borderRadius: '30px',
                  marginRight: '10px',
                }}
              >
                <Text size={20} weight={600} color="white">
                  {selectedData.color === 'orange' ? 'B' : 'A'}
                </Text>
              </Box>

              <Text size={18} weight={600} color="dimgray">
                {dayjs(selectedData.x).format('MMM YYYY')}
              </Text>
            </Box>
            <Box
              style={{
                padding: '15px',
              }}
            >
              <Text size={15} weight={500} color="dimrgay">
                Volume was 317% higher than usual, driven by:
              </Text>

              <Box
                className="d-flex"
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Box
                  className="d-flex justify-center"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '30px',
                    marginRight: '15px',
                    border: '1px solid lightgray',
                    alignItems: 'center',
                  }}
                >
                  <FaTwitter size={16} color={selectedData.color} />
                </Box>

                <Text size={15} weight={500} color="dimrgay">
                  <Text size={15} weight={500} color={selectedData.color} style={{ display: 'inline' }}>
                    514k
                  </Text>{' '}
                  retweets of this{' '}
                  <Text size={15} weight={500} color={selectedData.color} style={{ display: 'inline' }}>
                    Tweet
                  </Text>
                </Text>
              </Box>

              <Box
                className="d-flex"
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Box
                  className="d-flex justify-center"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '30px',
                    marginRight: '15px',
                    border: '1px solid lightgray',
                    alignItems: 'center',
                  }}
                >
                  <FaHashtag size={16} color={selectedData.color} />
                </Box>

                <Text size={15} weight={500} color="dimrgay">
                  <Text size={15} weight={500} color={selectedData.color} style={{ display: 'inline' }}>
                    211
                  </Text>{' '}
                  mentions using the hashtag{' '}
                  <Text size={15} weight={500} color={selectedData.color} style={{ display: 'inline' }}>
                    #plasticwaste
                  </Text>
                </Text>
              </Box>

              <Box
                className="d-flex"
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Box
                  className="d-flex justify-center"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '30px',
                    marginRight: '15px',
                    border: '1px solid lightgray',
                    alignItems: 'center',
                  }}
                >
                  <IoGlobeOutline size={16} color={selectedData.color} />
                </Box>

                <Text size={15} weight={500} color="dimgray">
                  <Text size={15} weight={500} color={selectedData.color} style={{ display: 'inline' }}>
                    987
                  </Text>{' '}
                  mentions from{' '}
                  <Text size={15} weight={500} color={selectedData.color} style={{ display: 'inline' }}>
                    news sites
                  </Text>
                </Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopTrends;
