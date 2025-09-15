import { Box, Button, ButtonProps, Tooltip, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

import BeaconBubble from '@/components/guide-tour/bubble';
import useResponsiveness from '@/hooks/useResponsiveness';

interface FeaturesHeaderProps {
  title: string;
  titleIcon: ReactNode;
  hasBtn?: boolean;
  btnText?: string;
  onBtnClick?: () => void;
  btnProps?: ButtonProps;
  wrapperStyle?: React.CSSProperties;
  startTour?: () => void;
  tooltipText?: string;
}

const FeaturesHeader = ({ title, titleIcon, hasBtn, btnText, onBtnClick, btnProps, wrapperStyle, startTour, tooltipText }: FeaturesHeaderProps) => {
  const { isMobile, isTablet } = useResponsiveness();

  const variant = isMobile ? 'h6' : isTablet ? 'h5' : 'h4';
  const flexDir = isMobile ? 'column' : 'row';

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={flexDir}
      gap={2}
      sx={{
        pt: 3,
        pb: { xs: 1, sm: 2 },
        ...wrapperStyle,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography variant={variant} fontWeight="bold" display="flex" alignItems="center">
          <Typography
            sx={{
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              mr: 2,
            }}
          >
            {titleIcon}
          </Typography>
          {title}
        </Typography>
        {startTour && <BeaconBubble onClick={startTour} />}
      </Box>

      {hasBtn && (
        <Tooltip title={tooltipText} placement="bottom" arrow>
          <Box display="flex" gap={2} alignItems="center" width={isMobile ? '100%' : 'auto'}>
            <Button
              variant="contained"
              color="primary"
              onClick={onBtnClick}
              style={{
                flexBasis: isMobile ? '100%' : 'auto',
              }}
              {...btnProps}
            >
              {btnText}
            </Button>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default FeaturesHeader;
