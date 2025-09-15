import { Box, Step, StepConnector, StepIconProps, StepLabel, Stepper, styled } from '@mui/material';
import { GoChevronRight } from 'react-icons/go';

interface Stepper2Props {
  steps: string[];
  activeStep: number;
  handleStepClick: (step: number) => void;
  disabled?: boolean;
}

const Stepper2 = ({ activeStep, steps, handleStepClick, disabled }: Stepper2Props) => {
  const CustomConnector = styled(StepConnector)(() => ({
    '&.MuiStepConnector-root': {
      top: 16, // Adjust line alignment
    },
    '&.Mui-active, &.Mui-completed': {
      '& .MuiStepConnector-line': {
        borderColor: '#CD1B78', // Active & completed line color
      },
    },
    '& .MuiStepConnector-line': {
      borderColor: '#D3D3D3', // Default inactive color
      borderTopWidth: 2,
    },
  }));

  const CustomStepIcon = (props: StepIconProps) => {
    const { completed } = props;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {completed ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '33px',
              width: '33px',
              backgroundColor: '#CD1B78',
              borderRadius: '50%',
            }}
          >
            <GoChevronRight size={20} color="#fff" />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '33px',
              width: '33px',
              border: '1.66px solid #CD1B78',
              borderRadius: '50%',
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />} sx={{ maxWidth: '699px', mx: 'auto' }}>
      {steps.map((label, index) => (
        <Step key={label} onClick={() => handleStepClick(index + 1)} sx={{ cursor: 'pointer' }}>
          <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default Stepper2;
