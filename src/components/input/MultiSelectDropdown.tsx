import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Autocomplete, Box, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react';

export interface MultiSelectOption {
  label: string;
  value: string;
  iconUrl?: string;
}

interface MultiSelectDropdownProps {
  label?: string;
  tooltip?: string;
  options: MultiSelectOption[];
  selectedValues: MultiSelectOption[];
  onChange: (newValues: MultiSelectOption[]) => void;
  placeholder?: string;
  maxWidth?: number | string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, tooltip, options, selectedValues, onChange, placeholder = 'Select...', maxWidth }) => {
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
        multiple
        options={options}
        value={selectedValues}
        onChange={(e, newValue) => onChange(newValue)}
        autoHighlight
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box key={key} component="li" sx={{ '& > img': { mr: 1.5, flexShrink: 0 } }} {...otherProps}>
              {option.iconUrl && <img loading="lazy" width="20" src={option.iconUrl} alt="" />}
              {option.label}
            </Box>
          );
        }}
        renderInput={(params) => <TextField {...params} placeholder={selectedValues.length > 0 ? '' : placeholder} size="small" />}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
      />
    </Box>
  );
};

export default MultiSelectDropdown;
