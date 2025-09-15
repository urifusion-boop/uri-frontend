import { Box, Typography } from '@mui/material';

import { TextHelper } from '@/helpers/TextHelper';
import useResponsiveness from '@/hooks/useResponsiveness';
import { AiMessageDto } from '@/models/dtos/AiMessageDto';
import { Message } from '@/models/dtos/BotMessageDto';
import { AnimatedBox } from '../boxes/AnimatedBox';
import CustomLineChart from '../charts/CustomLineChart';
import GenericBarChart from '../charts/GenericBarChart';
import PostTypePieChart from '../charts/PostTypePieChart';

type SingleMessageProps = {
  msg: AiMessageDto;
};

export const SingleMessage = ({ msg, maxWidth = { xs: 'calc(80vw)', sm: 'calc(400px - 110px)' } }: { msg: Message; maxWidth?: { xs: string; sm: string } }) => {
  const { isMobile } = useResponsiveness();
  let content = msg.content;
  let isChart = false;
  let chartData = null;

  try {
    const parsedData = JSON.parse(msg.content);
    if (parsedData.chart_type && parsedData.data) {
      isChart = true;
      chartData = parsedData;
    }
  } catch (error) {
    // Not JSON, treat as normal text
  }

  return (
    <AnimatedBox maxWidth="100%" display="flex" justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'} mb={2}>
      <Box maxWidth={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        {msg?.role === 'assistant' && !isMobile && (
          <Box
            sx={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              backgroundColor: '#CD1B786B',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img alt="uri insight assistant" src="/assets/images/bot.png" style={{ width: '30px', height: '23px' }} />
          </Box>
        )}
        <Box maxWidth={'100%'}>
          {isChart ? (
            <Box
              sx={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#F3F3F3',
              }}
            >
              <Typography variant="h6" align="center">
                {chartData.title}
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                {chartData.subtitle}
              </Typography>

              {/* Render appropriate chart component */}
              {chartData.chart_type === 'bar' && <GenericBarChart data={chartData.data} metrics={[{ label: 'Value', dataKey: 'value', color: '#CD1B78' }]} xAxisKey="label" />}
              {chartData.chart_type === 'line' && <CustomLineChart data={chartData.data} series={[{ dataKey: 'value', label: 'Value', color: '#CD1B78' }]} />}
              {chartData.chart_type === 'pie' && <PostTypePieChart data={chartData.data} xKey="label" yKey="value" />}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '10px',
                maxWidth,
                backgroundColor: msg?.role === 'user' ? '#FFE5F3' : '#F3F3F3',
                fontSize: '16px',
                color: '#5B5B5B',
                fontWeight: 500,
                '& table': {
                  display: 'block',
                  overflowX: 'auto',
                  width: 'fit-content',
                  maxWidth: '100%',
                  borderCollapse: 'collapse',
                },
                '& th, & td': {
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <Typography sx={{ width: '100%' }} fontSize={'12px'} variant="body1" dangerouslySetInnerHTML={TextHelper.createMarkup(content)} />
            </Box>
          )}
        </Box>
      </Box>
    </AnimatedBox>
  );
};
