import { Switch, SwitchProps, SxProps, Theme, styled } from '@mui/material';

interface IosSwitchProps extends SwitchProps {
  sx?: SxProps<Theme>;
  selectedColor?: string;
  width?: number;
  height?: number;
}

const IOSSwitch = styled((props: IosSwitchProps) => {
  const { ...otherProps } = props;
  return <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...otherProps} />;
})(({ theme, selectedColor, width = 42, height = 26 }) => {
  // Calculate derived measurements based on width and height
  const thumbSize = height - 4; // 4px total margin (2px on each side)
  const translateX = width - thumbSize - 4; // How far the thumb should move

  return {
    width,
    height,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0.0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: `translateX(${translateX}px)`,
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: selectedColor ?? '#65C466', // Use selectedColor if provided
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: selectedColor ?? '#33cf4d',
        border: '6px solid #fff',
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: thumbSize,
      height: thumbSize,
    },
    '& .MuiSwitch-track': {
      borderRadius: height / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  };
});

const IosSwitch: React.FC<IosSwitchProps> = ({ sx, selectedColor, width, height, ...props }) => {
  return <IOSSwitch {...props} sx={sx} selectedColor={selectedColor} width={width} height={height} />;
};

export default IosSwitch;
