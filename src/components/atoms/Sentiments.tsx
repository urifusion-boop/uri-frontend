import { SentimentOverTimeDto, SingleSentimentData } from '@/models/dtos/TrackerDto';
import { Box, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from 'victory';
import CustomLineChart from '../charts/CustomLineChart';
import SentimentScatterChart from '../charts/SentimentScatterChart';
import CustomLegend from '../charts/legends/CustomLegend';
import BasicHeader from '../headers/BasicHeader';

type PieDataType = { x: string; y: number }[];

interface SentimentData {
  totalFeedback: number;
  sentiments: { sentiment: string; percentage: number }[];
  pieData: PieDataType;
  anotherPieData?: PieDataType;
}

interface SentimentsProps {
  sentimentData: SentimentData;
  tags?: string[];
  scatterData?: (SingleSentimentData | undefined)[];
  total?: number;
  sentimentOverTimeData?: SentimentOverTimeDto[];
}

const colorScale = {
  Negative: '#e74c3c',
  Neutral: '#f39c12',
  Positive: '#27ae60',
};

const Sentiments = ({ sentimentData, tags, scatterData, total, sentimentOverTimeData }: SentimentsProps) => {
  const isTablet = useMediaQuery('(max-width:1300px)');
  const { sentiments, pieData } = sentimentData;

  const data = pieData.map((item) => {
    return {
      theme: item.x,
      count: item.y,
      sentiment: item.x,
    };
  });

  return (
    <div>
      <Typography fontSize={isTablet ? 20 : 24} fontWeight={600} variant="h4">
        Sentiment Analysis
      </Typography>

      <Box
        marginTop={2}
        sx={{
          overflow: 'auto',
        }}
        display={'grid'}
        gridTemplateColumns={isTablet ? '1fr' : '1fr auto auto auto'}
        gap={2}
      >
        <Box bgcolor={'#fff'} display={'flex'} flexDirection={isTablet ? 'column' : 'row'} padding={2} gap={2} borderRadius={'8px'}>
          <Box paddingRight={4} borderRight={'1px solid gray'} display="flex" alignItems="center" gap={2}>
            <Typography fontSize={18}>Total Feedback</Typography>

            <Typography variant="h6" fontWeight={600}>
              {total}
            </Typography>
          </Box>

          {sentiments.map((item, i) => (
            <Box key={item.sentiment} display={'flex'} padding={2} borderRadius={'8px'} alignItems={'center'} bgcolor={'#F8F8F8'} gap={4}>
              <Typography fontSize={16}>{item.sentiment}</Typography>
              <Typography fontWeight={600} fontSize={14} variant="body1">
                {pieData[i].y.toFixed(2)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {sentimentOverTimeData && sentimentOverTimeData.length > 0 && (
        <Box marginTop={3}>
          <Box bgcolor={'white'} borderRadius={'8px'} paddingLeft={2} pt={2} paddingRight={2} pb={2}>
            <CustomLineChart
              data={sentimentOverTimeData as []}
              series={[
                { dataKey: 'positive', label: 'Positive', color: 'green' },
                { dataKey: 'negative', label: 'Negative', color: 'red' },
                { dataKey: 'neutral', label: 'Neutral', color: 'yellow' },
              ]}
              title="Sentiment Analysis Over Time"
              subtitle="Trends in Positive, Negative, and Neutral Sentiments"
              description="This chart represents sentiment trends across various dates."
            />
          </Box>
        </Box>
      )}

      <Box display={isTablet ? 'block' : 'grid'} gap={3} gridTemplateColumns={'1fr 1fr'} marginTop={3}>
        <Box bgcolor={'white'} marginBottom={isTablet ? 3 : 0} borderRadius={'8px'} paddingLeft={2} paddingRight={2} pb={2}>
          <Box pb={2}>
            <BasicHeader title="Sentiment Trend Overview" legend={<CustomLegend scale={colorScale} isTablet={false} />} />
          </Box>
          <FeedbackThemesBarChart data={data} />
        </Box>

        <Box bgcolor={'white'} borderRadius={'8px'} paddingLeft={2} paddingRight={2} pb={2}>
          {scatterData && (
            <Box
              sx={{
                pt: 4,
              }}
            >
              <SentimentScatterChart sentimentData={scatterData ?? []} />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

const FeedbackThemesBarChart: React.FC<{
  data: { theme: string; count: number; sentiment: string }[];
}> = ({ data }) => {
  return (
    <VictoryChart theme={VictoryTheme.material} width={400} height={200} padding={{ left: 65, right: 70, top: 25, bottom: 50 }}>
      <VictoryAxis
        style={{
          tickLabels: {
            fontSize: 6,
            fontFamily: 'Plus Jakarta Sans',
            fill: '#000',
            fontWeight: 600,
          },
          axis: { stroke: 'none' },
          grid: { stroke: 'none' },
        }}
        offsetX={50}
        tickFormat={Object.keys(colorScale) ?? ['Negative', 'Neutral', 'Positive']}
        tickLabelComponent={<VictoryLabel />}
      />

      <VictoryBar
        horizontal
        data={data}
        x="theme"
        y="count"
        labels={({ datum }) => `Sentiment: ${datum.count.toFixed(2)}% \n ${datum.sentiment}`}
        labelComponent={
          <VictoryLabel
            style={{
              fontSize: 6,
              fontFamily: 'Plus Jakarta Sans',
              fill: '#000',
              lineHeight: 24,
            }}
          />
        }
        animate={false}
        style={{
          data: {
            fill: ({ datum }) => {
              //@ts-ignore
              return colorScale[datum.sentiment];
            },
            stroke: 'none',
          },
        }}
        barWidth={40}
        barRatio={0.2}
        cornerRadius={{ top: 4, bottom: 4 }}
      />
    </VictoryChart>
  );
};

export default Sentiments;
