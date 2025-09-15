import { AlertAnalyticsResponse, PlatformBreakdown } from '@/models/dtos/MentionInsightsDto';
import { Box, Grid, Typography } from '@mui/material';

import DateFilter from '@/components/atoms/DateFilter';
import { InsightHelper } from '@/helpers/InsightHelper';
import { DateFilterEnum } from '@/models/enum-models/DateFIlterEnum';
import React from 'react';
import LoaderWrapper from '../../atoms/LoaderWrapper';
import SemiCircleIndicator from '../../atoms/SemiCircleIndicator';
import PostTypePieChart from '../../charts/PostTypePieChart';
import ReusableLineChart from '../../charts/ReusableLineChart';
import ReusableBarChart from '../../charts/ReuseableBarChart';
import AlertMetricsCard from './AlertMetricsCard';
import PriorityAlertCard from './PriorityAlertCard';

interface AnalyticsTabProps {
  alertAnalysisData: AlertAnalyticsResponse | null | undefined;
  selectedDate: DateFilterEnum | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateFilterEnum | null>>;
  loading?: boolean;
}

const Legend = ({ colors }: { colors: string[] }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        mt: '5px',
      }}
    >
      {colors.map((color, index) => (
        <Box
          key={color}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Box
            sx={{
              width: '5px',
              height: '5px',
              backgroundColor: color,
              borderRadius: '50%',
            }}
          ></Box>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#181818',
            }}
          >
            {['Positive', 'Negative', 'Neutral'][index]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const AnalyticsTab = ({ alertAnalysisData, selectedDate, setSelectedDate, loading }: AnalyticsTabProps) => {
  const alertMetricsCard = [
    {
      title: 'Total Alerts',
      amount: alertAnalysisData?.total_alerts ?? 0,
      percentage: 12,
      image: '/assets/images/singleLineArea0.png',
      percentageColor: '#43CD34',
      arrowDirection: 'up',
    },
    {
      title: 'Negative Alerts',
      amount: alertAnalysisData?.negative_alerts ?? 0,
      percentage: 30,
      image: '/assets/images/singleLineArea1.png',
      percentageColor: '#CD5A34',
      arrowDirection: 'up',
    },
    {
      title: 'Positive Alerts',
      amount: alertAnalysisData?.positive_alerts ?? 0,
      percentage: 5,
      image: '/assets/images/singleLineArea2.png',
      percentageColor: '#CD5A34',
      arrowDirection: 'down',
    },
  ];

  const calculateTotalSentiments = (data: PlatformBreakdown | undefined) => {
    let Negative = 0;
    let Positive = 0;
    let Neutral = 0;

    Object.values(data ?? {}).forEach((platform) => {
      Negative += platform.negative ?? 0;
      Positive += platform.positive ?? 0;
      Neutral += platform.neutral ?? 0;
    });

    return { Negative, Positive, Neutral };
  };

  const pieData = InsightHelper.preparePieChartData(calculateTotalSentiments(alertAnalysisData?.platform_breakdown) ?? {});

  const platforms = Object.keys(alertAnalysisData?.platform_breakdown ?? {});

  const positive: number[] = [];
  const negative: number[] = [];
  const neutral: number[] = [];

  platforms.forEach((platform) => {
    positive.push(alertAnalysisData?.platform_breakdown?.[platform].positive ?? 0);
    negative.push(alertAnalysisData?.platform_breakdown?.[platform]?.negative ?? 0);
    neutral.push(alertAnalysisData?.platform_breakdown?.[platform]?.neutral ?? 0);
  });

  const alertTrendsDateData = Object.keys(alertAnalysisData?.analytics_over_time ?? {});

  const negativeArray: number[] = [];
  const neutralArray: number[] = [];
  const positiveArray: number[] = [];

  alertTrendsDateData.forEach((date) => {
    const { negative = 0, neutral = 0, positive = 0 } = alertAnalysisData?.analytics_over_time?.[date] ?? {};

    negativeArray.push(negative);
    neutralArray.push(neutral);
    positiveArray.push(positive);
  });

  const colors = ['#31EB11', '#EB3511', '#ECBE18'];

  return (
    <Box
      sx={{
        backgroundColor: '#FAFAFA',
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Metrics card */}
      <Grid container spacing={'36px'}>
        {alertMetricsCard.map((alert) => (
          <Grid item xs={12} md={4} key={alert.title}>
            <AlertMetricsCard alert={alert} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Date filter */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          gap: '20px',
          mb: 4,
          width: '100%',
          mt: 4,
        }}
      >
        <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </Box>

      {/* Pie and Line graph */}
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          p={3}
          borderRadius={2}
          bgcolor="white"
          sx={{
            boxShadow: '-1px -1px 2px 1px #0000000D',
            borderRadius: '10px',
            width: { xs: '100%', md: '60%' },
          }}
        >
          <PostTypePieChart
            data={pieData}
            xKey="x"
            yKey="y"
            title="Sentiment Breakdown"
            subtitle="See the Distribution of Sentiment in Your Alerts."
            colorSet={['#C21E0FCC', '#35DC13CC', '#ECBE18']}
            isLoading={loading}
          />
        </Box>

        <Box
          p={3}
          borderRadius={2}
          bgcolor="white"
          sx={{
            boxShadow: '-1px -1px 2px 1px #0000000D',
            width: { xs: '100%', md: '60%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px',
            borderRadius: '10px',
          }}
        >
          <Typography fontWeight={600} variant="h6" fontSize={24} color="#181818" alignSelf={'flex-start'}>
            Alert Trends Over Time
          </Typography>
          <ReusableLineChart
            loading={loading}
            xAxis={[
              {
                scaleType: 'point',
                data: alertTrendsDateData,
              },
            ]}
            series={[
              {
                data: positiveArray,
                area: false,
                label: 'Positive',
              },
              {
                data: negativeArray,
                area: false,
                label: 'Negative',
              },
              {
                data: neutralArray,
                area: false,
                label: 'Neutral',
              },
            ]}
            colors={['#31EB11', '#EB3511', '#ECBE18']}
            height={300}
            width={undefined}
            grid={{ horizontal: true, vertical: false }}
            bottomAxis={{
              disableLine: true,
              disableTicks: true,
            }}
            leftAxis={{
              disableLine: true,
              disableTicks: true,
            }}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
          <Legend colors={colors} />
        </Box>
      </Box>

      {/* Stack Chart */}
      <Box p={3} borderRadius={2} bgcolor="white" sx={{ boxShadow: '-1px -1px 8px 3px #0000000D', borderRadius: '10px' }} mt={4}>
        <Typography
          fontWeight={600}
          variant="h6"
          sx={{
            width: '100%',
            textAlign: 'center',
            color: '#181818',
            fontSize: '24px',
          }}
        >
          Platforms Breakdown
        </Typography>

        <ReusableBarChart
          series={[
            {
              data: negative,
              label: 'Negative',
              id: 'negative',
              stack: 'total',
            },
            {
              data: positive,
              label: 'Positive',
              id: 'positive',
              stack: 'total',
            },
            {
              data: neutral,
              label: 'Neutral',
              id: 'neutral',
              stack: 'total',
            },
          ]}
          height={500}
          xAxis={[
            {
              data: platforms,
              scaleType: 'band',
            },
          ]}
          colors={['#CA2011', '#3BCA13', '#ECBE18']}
          grid={{ horizontal: true, vertical: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          leftAxis={{
            disableLine: true,
            disableTicks: true,
          }}
          bottomAxis={{
            disableTicks: true,
          }}
          loading={loading}
        />
        <Legend colors={colors} />
      </Box>

      {/* Bottom Component */}
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: { xs: 'column', md: 'row' },
          mt: '24px',
          height: '100%',
          alignItems: 'stretch',
        }}
      >
        {/* High Priority Alerts */}
        <Box
          p={3}
          borderRadius={2}
          bgcolor="white"
          sx={{
            boxShadow: '-1px -1px 8px 3px #0000000D',
            borderRadius: '10px',
            width: { xs: '100%', md: '60%' },
          }}
        >
          <Typography fontWeight={600} variant="h6" fontSize={24} color="#181818" alignSelf={'flex-start'}>
            High Priority Alerts
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: '24px',
              flexDirection: 'column',
              mb: 1,
            }}
          >
            <LoaderWrapper isLoading={loading} skeletonHeight="150px" numberOfSkeletons={3}>
              {(alertAnalysisData?.high_priority_alerts ?? []).map((item, index) => (
                <PriorityAlertCard alert={item} key={item.platform + index} />
              ))}
            </LoaderWrapper>
          </Box>
        </Box>

        {/* Business Health Score */}
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Box
            p={3}
            borderRadius={2}
            bgcolor="white"
            sx={{
              boxShadow: '-1px -1px 8px 3px #0000000D',
              borderRadius: '10px',
              width: '100%',
              height: '100%',
            }}
          >
            <SemiCircleIndicator
              percentage={InsightHelper.calculateSentimentScore({
                negative_alerts: alertAnalysisData?.negative_alerts ?? 0,
                neutral_alerts: alertAnalysisData?.neutral_alerts ?? 0,
                positive_alerts: alertAnalysisData?.positive_alerts ?? 0,
                total_alerts: alertAnalysisData?.total_alerts ?? 0,
              })}
              loading={loading}
            />
          </Box>
          <Box
            p={3}
            borderRadius={2}
            bgcolor="white"
            sx={{
              boxShadow: '-1px -1px 8px 3px #0000000D',
              borderRadius: '10px',
              width: '100%',
              maxHeight: '250px',
              overflowY: 'auto',
              height: '100%',
            }}
            className="scroll"
          >
            <Typography
              sx={{
                color: '#181818',
                fontSize: '24px',
                fontWeight: 600,
              }}
            >
              AI Recommendation
            </Typography>

            <LoaderWrapper isLoading={loading} skeletonHeight="20px" skeletonWidth="100%" mb="16px">
              <Box
                sx={{
                  backgroundColor: '#FFCDCD',
                  display: 'flex',
                  alignItems: 'center',
                  width: 'fit-content',
                  py: '7px',
                  px: '14px',
                  borderRadius: '4px',
                  mt: '20px',
                  mb: '16px',
                }}
              >
                {/* <IoMdInformationCircleOutline color="#A81010" size={24} /> */}

                <Typography
                  sx={{
                    color: '#474646',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  {alertAnalysisData?.ai_recommendation?.title}
                </Typography>
              </Box>
            </LoaderWrapper>

            <LoaderWrapper isLoading={loading} skeletonHeight="100px">
              <Typography
                sx={{
                  color: '#474646',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {alertAnalysisData?.ai_recommendation?.text}
              </Typography>
            </LoaderWrapper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsTab;
