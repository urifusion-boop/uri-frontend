import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, Input, Tooltip, Typography } from '@mui/material';
import { BiX } from 'react-icons/bi';
import { ErrorText } from '../atoms/CustomText';

interface SingleFieldInputProps {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
  label?: string;
  tooltip?: string;
}

const SingleFieldInput = ({ placeholder, value, setValue, required = true, label, tooltip }: SingleFieldInputProps) => {
  return (
    <Box
      mt={3}
      sx={{
        maxWidth: '600px',
        width: '100%',
        mx: 'auto',
      }}
    >
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

      <Input
        id="input-with-icon-adornment"
        placeholder={placeholder}
        value={value}
        fullWidth
        // onChange={(e) => {
        //   const trimmedValue = e.target.value.replace(/\s+/g, '');
        //   setValue(trimmedValue);
        // }}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          borderBottom: '0.83px solid #CCCCCC',
          '&::placeholder': {
            color: 'red',
            fontStyle: 'italic',
          },
        }}
        endAdornment={
          <IconButton
            onClick={() => {
              setValue('');
            }}
          >
            <BiX size={20} />
          </IconButton>
        }
      />

      {value.length < 1 && required && <ErrorText>Required</ErrorText>}
    </Box>
  );
};

export default SingleFieldInput;
