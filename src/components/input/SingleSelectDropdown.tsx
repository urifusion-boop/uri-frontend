import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Autocomplete, Box, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react';

export interface SingleSelectOption {
  label: string;
  value: string;
  iconUrl?: string;
}

interface SingleSelectDropdownProps {
  label?: string;
  tooltip?: string;
  options: SingleSelectOption[];
  selectedValue: SingleSelectOption | null;
  onChange: (newValues: SingleSelectOption) => void;
  placeholder?: string;
  maxWidth?: number | string;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({ label, tooltip, options, selectedValue, onChange, placeholder = 'Select...', maxWidth }) => {
  return (
    <Box sx={{ width: { xs: '100%', md: maxWidth }, alignItems: 'center', justifyContent: 'center' }}>
      {label && (
        <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'flex', alignItems: 'center' }}>
          {label}
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: '#9ca3af' }} />
            </Tooltip>
          )}
        </Typography>
      )}

      <Autocomplete
        options={options}
        value={selectedValue}
        onChange={(e, newValue) => onChange(newValue as SingleSelectOption)}
        autoHighlight
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 1.5, flexShrink: 0 } }} {...props}>
            {option.iconUrl && <img loading="lazy" width="20" src={option.iconUrl} alt="" />}
            {option.label}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} placeholder={selectedValue ? '' : placeholder} size="small" />}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
      />
    </Box>
  );
};

export default SingleSelectDropdown;
