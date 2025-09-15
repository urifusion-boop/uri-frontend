import { Add, InfoOutlined } from '@mui/icons-material';
import { Box, Chip, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

interface ListValuesInputProps {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  placeholder?: string;
  label?: string;
  tooltip?: string;
}

const ListValuesInput = ({ keywords, setKeywords, placeholder, label, tooltip }: ListValuesInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setInputValue('');
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <Box>
      {label && (
        <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'flex', alignItems: 'center' }}>
          {label}
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <InfoOutlined fontSize="small" sx={{ ml: 0.5, color: '#9ca3af' }} />
            </Tooltip>
          )}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {keywords.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword}
            onDelete={() => removeKeyword(index)}
            sx={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder={placeholder || 'Type a value'} size="small" fullWidth />
        <IconButton
          onClick={addKeyword}
          sx={{
            border: '1px solid #d1d5db',
            borderRadius: 1,
          }}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ListValuesInput;
