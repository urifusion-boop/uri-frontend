import React, { useEffect, useState } from 'react';
import { VictoryPie } from 'victory';
import { Box, Typography } from '@mui/material';

const CustomLabel = (props: any) => {
  const { x, y, text, datum } = props;

  return (
    <foreignObject x={x - 40} y={y - 35} width={120} height={96}>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '80px',
          textAlign: 'center',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          width: 90,
          height: 95,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Typography
          color={datum.color || 'black'}
          fontWeight={700}
          fontSize={18}
          textAlign={'center'}>
          {text}
        </Typography>
      </Box>
    </foreignObject>
  );
};

const PieChart: React.FC<{
  colorScale: string[];
  data: {
    x: string;
    y: number;
    color: string;
  }[];
}> = ({ colorScale = ['#8884d8', '#82ca9d', '#ffc658'], data }) => {
  const [endAngle, setEndAngle] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setEndAngle(360);
    }, 100);
  }, []);
  return (
    <Box maxWidth={550} height={'100%'}>
      <VictoryPie
        data={data}
        animate={{
          duration: 1000,
        }}
        endAngle={endAngle}
        labels={({ datum }) => `${datum.y}%`}
        labelComponent={<CustomLabel />}
        innerRadius={100}
        colorScale={colorScale}
        style={{
          labels: { fontSize: 14 },
        }}
      />
    </Box>
  );
};

export default PieChart;
