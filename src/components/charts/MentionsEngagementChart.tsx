import { Box, Typography } from '@mui/material';
import React, { memo, useState } from 'react';
import { VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

import { MentionsCommentIcon } from '@/components/atoms/Icons';

interface ChartData {
  date: string;
  Mentions: number;
  Engagement: number;
  Likes: number;
  Comments: number;
}

interface MentionsEngagementChartProps {
  data: ChartData[];
}

const CustomAxisLabel = (props: any) => (
  <VictoryLabel
    {...props}
    textAnchor="end"
    renderInPortal
    angle={-45}
    labelComponent={
      <Typography
        variant="body2"
        sx={{
          fontSize: 15,
          color: '#838383',
        }}
      >
        {props.text}
      </Typography>
    }
  />
);

const MentionsEngagementChart: React.FC<MentionsEngagementChartProps> = memo(({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: 'Mentions & Engagement',
      icon: <MentionsCommentIcon />,
      color: '#CD1B78',
    },
  ];

  const dataLegend = [
    { name: 'Mentions', symbol: { fill: '#d83f87' } },
    { name: 'Engagement', symbol: { fill: '#A2D2FC' } },
    { name: 'Likes', symbol: { fill: '#FF9800' } },
    { name: 'Comments', symbol: { fill: '#2196F3' } },
  ];

  return (
    <Box className="bg-white w-full">
      <Box className="p-4 shadow-sm rounded-md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
            pt: 2,
          }}
        >
          {tabs.map((tab, index) => (
            <button
              onClick={() => setActiveTab(index)}
              key={tab.title}
              className="flex items-center space-x-1 cursor-pointer border-0 bg-transparent"
              aria-label={`Switch to ${tab.title} tab`}
              role="tab"
              aria-selected={activeTab === index}
            >
              {tab.icon}
              <Typography variant="h6" align="center" fontWeight={600} fontSize={20} color={'#181818'}>
                {tab.title}
              </Typography>
            </button>
          ))}
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            {dataLegend.map((legend) => (
              <Box
                key={legend.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: legend.symbol.fill,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 12,
                    color: '#838383',
                  }}
                >
                  {legend.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {activeTab === 0 && (
          <Box>
            <Box sx={{ width: '100%', height: '340px', maxWidth: '1000px' }}>
              <VictoryChart theme={VictoryTheme.material} domainPadding={20} width={1000} height={360} containerComponent={<VictoryVoronoiContainer />}>
                {/* X Axis */}
                <VictoryAxis
                  tickValues={data.map((point) => point.date)}
                  style={{
                    tickLabels: {
                      fontSize: 10,
                      textAnchor: 'middle',
                      alignSelf: 'center',
                    },
                  }}
                  tickLabelComponent={
                    <CustomAxisLabel
                      style={{
                        fontSize: 10,
                      }}
                    />
                  }
                />
                {/* Y Axis */}
                <VictoryAxis
                  dependentAxis
                  tickLabelComponent={
                    <CustomAxisLabel
                      style={{
                        fontSize: 10,
                        textAnchor: 'end',
                      }}
                    />
                  }
                />

                {/* Lines for metrics */}
                <VictoryLine
                  data={data.map((d) => ({
                    date: d.date,
                    y: d.Mentions,
                  }))}
                  x="date"
                  y="y"
                  interpolation="monotoneX"
                  labels={({ datum }) => `Mentions: ${datum.y}`}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { stroke: '#d83f87', strokeWidth: 3 },
                  }}
                />
                <VictoryLine
                  data={data.map((d) => ({
                    date: d.date,
                    y: d.Engagement,
                  }))}
                  x="date"
                  y="y"
                  interpolation="monotoneX"
                  labels={({ datum }) => `Engagement: ${datum.y}`}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { stroke: '#A2D2FC', strokeWidth: 3 },
                  }}
                />
                <VictoryLine
                  data={data.map((d) => ({
                    date: d.date,
                    y: d.Likes,
                  }))}
                  x="date"
                  y="y"
                  interpolation="monotoneX"
                  labels={({ datum }) => `Likes: ${datum.y}`}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { stroke: '#FF9800', strokeWidth: 3 },
                  }}
                />
                <VictoryLine
                  data={data.map((d) => ({
                    date: d.date,
                    y: d.Comments,
                  }))}
                  x="date"
                  y="y"
                  interpolation="monotoneX"
                  labels={({ datum }) => `Comments: ${datum.y}`}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { stroke: '#2196F3', strokeWidth: 3 },
                  }}
                />
              </VictoryChart>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
});

MentionsEngagementChart.displayName = 'MentionsEngagementChart';
export default MentionsEngagementChart;
