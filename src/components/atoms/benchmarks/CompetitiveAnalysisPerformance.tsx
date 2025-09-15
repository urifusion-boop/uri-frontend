import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { FaMessage, FaPencil } from 'react-icons/fa6';
import { GoArrowUpRight } from 'react-icons/go';
import { HiTrophy } from 'react-icons/hi2';
import { MdOutlineWindow } from 'react-icons/md';
import { TbRectangleFilled } from 'react-icons/tb';
import { VictoryPie, VictoryTooltip } from 'victory';
import { AnalysisTable } from './AnalysisTable';
import BenchmarkCard from './Benchmarkcard';
import { MatrixCompetitorAnalysis } from './MatrixCompetitorAnalysis';

interface Segment {
  width: number;
  color: string;
}

interface HorizontalBarProps {
  segments: Segment[];
}

const BarSegment = ({ width, color }: { width: number; color: string }) => <Box sx={{ height: '100%', width: `${width}%`, backgroundColor: color }}></Box>;

const HorizontalBar: React.FC<HorizontalBarProps> = ({ segments }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 20,
        display: 'flex',
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
      }}
    >
      {segments.map((segment, index) => (
        <BarSegment key={index} width={segment.width} color={segment.color} />
      ))}
    </Box>
  );
};

const CompetitiveAnalysisPerformance: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // const colorScale = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];
  const colorScale = ['#31C5B2', '#816FEA', '#E0447C'];
  const data = [
    { topic: 'Coffee Cabin', shareOfVoice: 62, color: '#31C5B2' },
    { topic: 'Java House', shareOfVoice: 24, color: '#816FEA' },
    { topic: 'Impresso Expresso', shareOfVoice: 14, color: '#E0447C' },
  ];

  const pieData = data.map((item) => {
    return {
      x: item.topic,
      y: item.shareOfVoice,
    };
  });
  return (
    <>
      <MatrixCompetitorAnalysis />
      <AnalysisTable />
      <Box
        sx={{
          borderRadius: 1.5,
          border: '1px solid #ccc',
          boxShadow: 1,
          width: '100%',
          minHeight: '500px',
          display: 'grid',
          alignContent: 'start',
        }}
      >
        <Box
          p={isMobile ? 1 : 2}
          pb={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1 }}>
            <Typography variant="h6"> Topic Summary </Typography>
            <Typography variant="subtitle2">View key performance metrics for this topic</Typography>
          </Box>
          <IconButton>
            <MdOutlineWindow />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'grid',
            height: '100%',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            borderTop: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
          }}
        >
          <Box
            p={2}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" color={'gray'}>
                Share of voice
              </Typography>

              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {' '}
                <HiTrophy color={data[0].color} /> Cofee Cabin
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.map((item) => (
                  <Box key={item.topic} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="body2">{item.topic}</Typography>
                    <Typography variant="body2" color={item.color}>
                      {item.shareOfVoice}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* the chart */}
            <Box maxWidth={250} maxHeight={250} marginRight={'auto'} position="relative" marginLeft={'auto'}>
              <VictoryPie
                animate={{
                  duration: 1000,
                }}
                endAngle={360}
                padding={!isMobile ? { left: 20, right: 20, bottom: 20 } : { left: 76, right: 70, top: 25, bottom: 50 }}
                data={pieData}
                labelComponent={<VictoryTooltip cornerRadius={10} pointerLength={10} flyoutStyle={{ fill: 'white' }} />}
                colorScale={colorScale}
                labels={({ datum }) => `${datum.x}: ${datum.y}`} // Label each slice
                style={{
                  labels: { fontSize: 14, fill: 'black' },
                  parent: {
                    maxWidth: '100%',
                  },
                }}
                innerRadius={90} // Donut chart, remove for a regular pie chart
              />
              <Typography variant="h6" fontWeight={600} fontSize={12} position="absolute" top="45%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
                Total Volume
              </Typography>
              <Typography align="center" fontSize={9} color="textSecondary" position="absolute" top="55%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
                40.4k
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                gap: 1,
              }}
            ></Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #ccc',
              height: 'auto',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Box p={2} sx={{ height: '50%', width: '100%' }}>
              <BenchmarkCard
                title={'Total Engagements'}
                icon={<FaMessage color={colorScale[1]} />}
                amount={`55%`}
                chart={
                  <HorizontalBar
                    segments={[
                      { width: 80, color: colorScale[0] },
                      { width: 10, color: colorScale[1] },
                      { width: 10, color: colorScale[2] },
                    ]}
                  />
                }
              />
            </Box>
            <Box p={2} sx={{ height: '50%', width: '100%' }}>
              <BenchmarkCard
                title={'Avg. Engagements Per Message'}
                icon={<GoArrowUpRight color={colorScale[2]} />}
                amount={`55%`}
                chart={
                  <HorizontalBar
                    segments={[
                      { width: 80, color: colorScale[0] },
                      { width: 10, color: colorScale[1] },
                      { width: 10, color: colorScale[2] },
                    ]}
                  />
                }
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            height: '100%',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            borderTop: '1px solid #ccc',
          }}
        >
          <Box p={2} sx={{ borderRight: '1px solid #ccc' }}>
            <BenchmarkCard
              title={'Total Potential Impressions'}
              icon={<FaEye color={colorScale[1]} />}
              amount={`55%`}
              chart={
                <HorizontalBar
                  segments={[
                    { width: 80, color: colorScale[0] },
                    { width: 10, color: colorScale[1] },
                    { width: 10, color: colorScale[2] },
                  ]}
                />
              }
            />
          </Box>
          <Box p={2} sx={{ borderRight: '1px solid #ccc' }}>
            <BenchmarkCard
              title={'Total Unique Authors'}
              icon={<FaPencil color={colorScale[2]} />}
              amount={`55%`}
              chart={
                <HorizontalBar
                  segments={[
                    { width: 40, color: colorScale[0] },
                    { width: 20, color: colorScale[1] },
                    { width: 40, color: colorScale[2] },
                  ]}
                />
              }
            />
          </Box>
          <Box p={2} sx={{}}>
            <BenchmarkCard
              title={'Avg. Positive Sentiments'}
              icon={<GoArrowUpRight color={colorScale[0]} />}
              amount={`55%`}
              chart={
                <HorizontalBar
                  segments={[
                    { width: 30, color: colorScale[0] },
                    { width: 20, color: colorScale[1] },
                    { width: 50, color: colorScale[2] },
                  ]}
                />
              }
            />
          </Box>
        </Box>
        <Box
          p={isMobile ? 0.5 : 2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? 2 : 4,
            alignItems: 'center',
            borderTop: '1px solid #ccc',
          }}
        >
          {data.map((item, i) => {
            return (
              <Box key={item.topic} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">
                  {' '}
                  <TbRectangleFilled color={item.color} />{' '}
                </Typography>
                <Typography variant="body2"> {item.topic} </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default CompetitiveAnalysisPerformance;
