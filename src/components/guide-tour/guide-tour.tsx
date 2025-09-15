import { Box, Button, Paper, Typography } from '@mui/material';
import { forwardRef, memo, useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, STATUS, Step, TooltipRenderProps } from 'react-joyride';

import useCustomTheme from '@/hooks/theme.hook';
import { styled } from '@mui/material/styles';

const TooltipContainer = styled(Paper)(({ theme }) => ({
  width: '280px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: theme.shadows[5],
  overflow: 'hidden',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 2, 2, 2),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
}));

export interface CustomStep extends Step {
  icon?: React.ComponentType;
  description?: string;
  image?: string;
}

// Custom tooltip component
const CustomTooltip = forwardRef<HTMLDivElement, TooltipRenderProps>((props, ref) => {
  const { themeColors } = useCustomTheme();

  const { index, size, step, isLastStep, tooltipProps, primaryProps, closeProps, backProps } = props;
  const customStep = step as CustomStep;

  return (
    <TooltipContainer {...tooltipProps} ref={ref} elevation={6}>
      <Box sx={{ p: 2 }}>
        {customStep.icon && <customStep.icon />}
        <Typography variant="h6" fontWeight="bold" fontSize="14px">
          {customStep.content}
        </Typography>
        {customStep.description && (
          <Typography variant="body2" fontSize="12px">
            {customStep.description}
          </Typography>
        )}
      </Box>

      {customStep.image && (
        <ImageContainer>
          <img src={customStep.image} alt={String(customStep.content)} />
        </ImageContainer>
      )}

      <FooterContainer>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {Array.from({ length: size }, (_, i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: i === index ? '#000' : '#fff',
                transition: 'all 0.2s ease-in-out',
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isLastStep && (
            <Button size="small" {...closeProps}>
              Skip
            </Button>
          )}

          <Box
            component="button"
            {...primaryProps}
            sx={{
              backgroundColor: '#ffffff',
              color: themeColors.primary,
              fontSize: '12px',
              paddingInline: '20px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#FCE4EC',
              },
            }}
          >
            {isLastStep ? 'Done' : 'Next'}
          </Box>
        </Box>
      </FooterContainer>
    </TooltipContainer>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

interface GuideTourProps {
  steps: CustomStep[];
  run?: boolean;
  onFinish?: (data: CallBackProps) => void;
  onSkip?: (data: CallBackProps) => void;
  onComplete?: (data: CallBackProps) => void;
  autoStart?: boolean;
  showSkipButton?: boolean;
  showProgress?: boolean;
  continuous?: boolean;
  [key: string]: any;
}

export const GuideTour = memo(
  ({ steps, run = false, onFinish, onSkip, onComplete, autoStart = false, showSkipButton = true, showProgress = false, continuous = true, ...joyrideProps }: GuideTourProps) => {
    const { themeColors } = useCustomTheme();

    const [tourRun, setTourRun] = useState(run || autoStart);
    const [tourKey, setTourKey] = useState(0);

    // Update internal state when the run prop changes
    useEffect(() => {
      setTourRun(run);
    }, [run]);

    // Reset tour when steps change
    useEffect(() => {
      // Generate new key to force remount
      setTourKey((prev) => prev + 1);
    }, [steps]);

    const handleJoyrideCallback = (data: CallBackProps) => {
      const { action, index, status, type } = data;
      // Handle events based on the status
      if (status === STATUS.FINISHED && onComplete) {
        onComplete(data);
        setTourRun(false);
      }

      if (action === ACTIONS.CLOSE && onSkip) {
        onSkip(data);
        setTourRun(false);
      }

      // Handle finish via the done button
      if (type === 'step:after' && action === ACTIONS.NEXT && index === steps.length - 1) {
        if (onFinish) {
          onFinish(data);
        }
        setTourRun(false);
      }
    };

    return (
      <Joyride
        key={tourKey}
        steps={steps}
        run={tourRun}
        continuous={continuous}
        showSkipButton={showSkipButton}
        showProgress={showProgress}
        tooltipComponent={CustomTooltip}
        callback={handleJoyrideCallback}
        floaterProps={{
          disableAnimation: true,
          styles: {
            arrow: {
              color: themeColors.primary,
              length: 10,
              spread: 16,
            },
          },
        }}
        {...joyrideProps}
      />
    );
  }
);

GuideTour.displayName = 'GuideTour';

export default GuideTour;
