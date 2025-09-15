import { Box, Typography } from '@mui/material';
import { VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryVoronoiContainer } from 'victory';

const chartData = {
  facebook: [50, 80, 60, 120, 150, 200],
  twitter: [30, 70, 100, 90, 130, 170],
  instagram: [20, 40, 70, 110, 160, 230],
  tiktok: [10, 60, 100, 90, 130, 200],
  youtube: [5, 40, 80, 100, 140, 180],
  dates: ['01 Jun', '05 Jun', '10 Jun', '15 Jun', '20 Jun', '25 Jun'],
};

const TimelineChart = () => {
  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        Timeline
      </Typography>
      <VictoryChart height={400} width={1000} containerComponent={<VictoryVoronoiContainer labels={({ datum }) => `${datum.x}: ${datum.y}`} />}>
        <VictoryLegend
          x={100}
          y={10}
          orientation="horizontal"
          gutter={20}
          style={{
            labels: { fontSize: 12 },
          }}
          data={[
            { name: 'Facebook', symbol: { fill: '#4267B2' } },
            { name: 'Twitter', symbol: { fill: '#1DA1F2' } },
            { name: 'Instagram', symbol: { fill: '#E1306C' } },
            { name: 'TikTok', symbol: { fill: '#69C9D0' } },
            { name: 'YouTube', symbol: { fill: '#FF0000' } },
          ]}
        />
        <VictoryAxis
          tickValues={chartData.dates}
          style={{
            tickLabels: { fontSize: 10, angle: -45, padding: 10 },
            axisLabel: { padding: 30 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => `${x}`}
          style={{
            tickLabels: { fontSize: 10, padding: 5 },
          }}
        />
        <VictoryLine
          data={chartData.dates.map((date, i) => ({
            x: date,
            y: chartData.facebook[i],
          }))}
          style={{ data: { stroke: '#4267B2', strokeWidth: 2 } }}
        />
        <VictoryLine
          data={chartData.dates.map((date, i) => ({
            x: date,
            y: chartData.twitter[i],
          }))}
          style={{ data: { stroke: '#1DA1F2', strokeWidth: 2 } }}
        />
        <VictoryLine
          data={chartData.dates.map((date, i) => ({
            x: date,
            y: chartData.instagram[i],
          }))}
          style={{ data: { stroke: '#E1306C', strokeWidth: 2 } }}
        />
        <VictoryLine
          data={chartData.dates.map((date, i) => ({
            x: date,
            y: chartData.tiktok[i],
          }))}
          style={{ data: { stroke: '#69C9D0', strokeWidth: 2 } }}
        />
        <VictoryLine
          data={chartData.dates.map((date, i) => ({
            x: date,
            y: chartData.youtube[i],
          }))}
          style={{ data: { stroke: '#FF0000', strokeWidth: 2 } }}
        />
      </VictoryChart>
    </Box>
  );
};

export default TimelineChart;
