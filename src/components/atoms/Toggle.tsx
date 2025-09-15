import { TextHelper } from '@/helpers/TextHelper';
import { Box, Typography } from '@mui/material';

interface SubscriptionToggleProps {
  options: {
    value: string;
    label: string;
  }[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const Toggle = ({ options, selectedOption, onChange }: SubscriptionToggleProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '7.5px',
        gap: '10px',
        background: '#FFFFFF',
        boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '40px',
        width: 'fit-content',
      }}
    >
      {options.map((option) => (
        <Box
          component="button"
          key={option.value}
          sx={{
            padding: { xs: '6px 20px', md: '12px 40px' },
            bgcolor: selectedOption === option.value ? '#CD1B78' : '#fff',

            borderRadius: '40px',
            minWidth: { xs: '100px', md: '200px' },
          }}
          onClick={() => onChange(option.value)}
        >
          <Typography
            sx={{
              color: selectedOption === option.value ? '#fff' : '#34393E',
              fontSize: { xs: 12, md: 20 },
              fontWeight: 600,
            }}
          >
            {TextHelper.capitalize(option.label)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Toggle;
