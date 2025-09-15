import { Autocomplete, Box, Chip, IconButton, TextField, Typography } from '@mui/material';
import React from 'react';
import { BiX } from 'react-icons/bi';

interface MultiSelectInputProps {
  values: string[];
  setValues: (value: string[]) => void;
  handleValuesChange: (event: React.SyntheticEvent | null, newCompetitors: string[]) => void;
  label?: string;
  notOptional?: boolean;
}

const MultiSelectInput = ({ values, setValues, handleValuesChange, label, notOptional }: MultiSelectInputProps) => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Autocomplete
        multiple
        freeSolo
        id="multi-email-input"
        options={[]}
        value={values}
        onChange={handleValuesChange}
        fullWidth
        sx={{
          width: '100%',
          mx: 'auto',
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          const isExisting = values.includes(inputValue.trim());

          return (inputValue !== '' && !isExisting ? [...options, inputValue.trim()] : options) as never[];
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                label={option}
                key={key}
                {...tagProps}
                sx={{
                  backgroundColor: '#FEE4F1',
                  color: '#4B4B4B',
                  '& .MuiChip-deleteIcon': {
                    color: '#4B4B4B',
                  },
                }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={label ?? 'Type a competitor and press Enter'}
            fullWidth
            variant="standard"
            InputProps={{
              ...params.InputProps,
              onBlur: (event) => {
                const value = event.target.value.trim();
                if (value && !values.includes(value)) {
                  handleValuesChange(null, [...values, value]); // Auto-add on blur
                }
              },
              endAdornment: (
                <IconButton onClick={() => setValues([])} edge="end">
                  <BiX size={20} />
                </IconButton>
              ),
            }}
            sx={{
              borderBottom: '0.83px solid #CCCCCC',
              '&::placeholder': {
                color: '#888',
                fontStyle: 'italic',
              },
              '&:focus-within': {
                borderBottom: '1.5px solid #333',
              },
            }}
          />
        )}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            const inputValue = (event.target as HTMLInputElement).value.trim();
            if (inputValue && !values.includes(inputValue)) {
              handleValuesChange(null, [...values, inputValue]);
            }
          }
        }}
      />
      {!notOptional && (
        <Typography
          variant="body2"
          sx={{
            color: '#ccc',
            mt: 1,
          }}
        >
          Optional
        </Typography>
      )}
    </Box>
  );
};

export default MultiSelectInput;
