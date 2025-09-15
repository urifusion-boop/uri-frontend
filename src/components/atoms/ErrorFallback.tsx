'use client';

import { Box, Typography } from '@mui/material';

import useCustomTheme from '@/hooks/theme.hook';
import useResponsiveness from '@/hooks/useResponsiveness';
import { useRouter } from 'next/router';
import { FallbackProps } from 'react-error-boundary';
import SeoHead from '../atoms/SeoHead';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { isMobile } = useResponsiveness();
  const router = useRouter();
  const { themeColors } = useCustomTheme();

  return (
    <>
      <SeoHead title="Error Occurred" />
      <Box height={'100vh'} width={'100%'} bgcolor={'background.default'}>
        <Box display="flex" flexDirection="column" alignItems="center" height={'100%'} justifyContent={'center'} gap={'24px'} px={3}>
          <Typography fontSize={isMobile ? 60 : 100} fontWeight={800} color="#721c24">
            Oops!
          </Typography>
          <Typography fontSize={20} fontWeight={500}>
            Something went wrong
          </Typography>

          <Box maxWidth="600px" width="100%" bgcolor="#f8d7da" p={2} borderRadius={1} overflow="auto" maxHeight="200px">
            <Typography fontSize={14} color="#721c24" sx={{ wordBreak: 'break-word' }}>
              {error.message || 'An unknown error occurred'}
            </Typography>
          </Box>

          <Box display="flex" gap={2} flexDirection={isMobile ? 'column' : 'row'}>
            <Box
              component={'button'}
              onClick={resetErrorBoundary}
              sx={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: themeColors.primary,
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              Try Again
            </Box>
            <Box
              component={'button'}
              onClick={() => router.push('/dashboard')}
              sx={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: themeColors.primary,
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              Go to Dashboard
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ErrorFallback;
