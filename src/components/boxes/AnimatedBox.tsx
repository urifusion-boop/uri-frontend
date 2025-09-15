import { Box, keyframes, styled } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const AnimatedBox = styled(Box)`
  animation: ${fadeIn} 0.5s ease-in-out;
`;
