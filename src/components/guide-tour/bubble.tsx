import { Box } from '@mui/material';

interface BeaconBubbleProps {
  innerColor?: string;
  outerColor?: string;
  size?: number;
  sx?: object;
  onClick?: (e: React.MouseEvent) => void;
}
const BeaconBubble = ({ innerColor = '#f04', outerColor = '#f04', size = 16, sx = {}, ...props }: BeaconBubbleProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        mx: '4px',
        width: size,
        height: size,
        ...sx,
      }}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      {/* Pulsing outer circle */}
      <Box
        sx={{
          position: 'absolute',
          borderRadius: '50%',
          backgroundColor: outerColor,
          width: '100%',
          height: '100%',
          opacity: 0.7,
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.5)',
              opacity: 0.7,
            },
            '70%': {
              transform: 'scale(1.5)',
              opacity: 0,
            },
            '100%': {
              transform: 'scale(1.8)',
              opacity: 0,
            },
          },
        }}
      />

      {/* Inner circle */}
      <Box
        sx={{
          borderRadius: '50%',
          backgroundColor: innerColor,
          width: '50%',
          height: '50%',
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default BeaconBubble;
