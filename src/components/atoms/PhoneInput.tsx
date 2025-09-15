import useCustomTheme from '@/hooks/theme.hook';
import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import PhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ErrorText } from './CustomText';

interface IProps {
  label?: string;
  icon?: ReactNode;
  mt?: number;
  errorText?: string;
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?(event: React.FocusEvent<HTMLElement, Element>): void;
}

const PhoneInput: React.FC<IProps> = ({ label, icon, mt, errorText, value, onChange, onBlur, ...rest }) => {
  const { themeColors } = useCustomTheme();

  //remove the blue border when focused
  return (
    <Box sx={{ mt: mt ?? 0 }}>
      {label && label.trim().length > 0 && (
        <Typography variant="h4" fontSize={13} sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}

      <Box
        sx={{
          backgroundColor: themeColors.inputBackground,
          border: `1px solid ${themeColors.inputBorder}`,
        }}
        className={'h-[38px] flex items-center rounded-[4px]'}
      >
        <PhoneNumberInput
          border="none"
          className="custom-phone-input"
          value={value}
          defaultCountry="NG"
          onChange={onChange}
          style={{
            width: '100%',
            paddingLeft: '10px',
            color: themeColors.blackWhite,
            border: 'none',
          }}
          onBlur={onBlur}
          numberInputProps={{
            style: { backgroundColor: themeColors.inputBackground, border: 'none' },
          }}
        />
      </Box>
      {errorText?.trim()?.length && <ErrorText>{errorText}</ErrorText>}
    </Box>
  );
};

export default PhoneInput;
