// components/forms/LabeledSelectField.tsx
import { Box, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import Select from '../atoms/Select';

interface LabeledSelectInputProps {
  label?: React.ReactNode;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { value: string | null; label: string }[];
  placeholder?: string;
  wrapperSx?: SxProps<Theme>;
}

const LabeledSelectInput: React.FC<LabeledSelectInputProps> = ({ label, value, onChange, options, placeholder, wrapperSx }) => {
  return (
    <Box sx={wrapperSx} width="100%">
      {label && (
        <Typography variant="body2" mb={1} mt={3} sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      )}

      <Select options={options} value={value ?? ''} onChange={onChange} placeholder={placeholder} />
    </Box>
  );
};

export default LabeledSelectInput;
