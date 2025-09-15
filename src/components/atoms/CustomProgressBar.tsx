import { Box } from '@mui/material';
import React from 'react';
import useCustomTheme from '../../hooks/theme.hook';

interface IProps {
  percentage: number;
  height?: number;
  baseColor?: string;
  barColor?: string;
}

const CustomProgressBar: React.FC<IProps> = ({ percentage, height, baseColor, barColor }) => {
  const { themeColors } = useCustomTheme();

  return (
    <Box
      sx={{
        backgroundColor: baseColor ? baseColor : themeColors.borderColor,
      }}
      height={height ? height : 3}
      borderRadius={4}
      overflow="hidden"
    >
      <div
        style={{
          width: `${percentage * 100}%`,
          height: '100%',
          backgroundColor: barColor ? barColor : themeColors.primary,
        }}
      ></div>
    </Box>
  );
};

export default CustomProgressBar;
