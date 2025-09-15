import useCustomTheme from '@/hooks/theme.hook';
import styles from '@/styles/Atoms.module.css';
import { Box, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { TextHelper } from '../../helpers/TextHelper';
import { ErrorText } from './CustomText';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  mt?: number;
  errorText?: string;
  radius?: number;
  noBg?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  formatNumber?: boolean;
  labelIcon?: boolean;
  removePadding?: boolean;
}

const InputField: React.FC<IProps> = ({ label, icon, mt, errorText, radius = 2.5, noBg, leftIcon, rightIcon, formatNumber, labelIcon, removePadding = true, ...rest }) => {
  const { themeColors } = useCustomTheme();
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);
  }, []);

  return (
    <Box sx={{ mt: mt ?? 0 }}>
      {label && label.trim().length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            gap: 1,
          }}
        >
          {labelIcon && <Box>{icon}</Box>}
          <Typography
            variant="h4"
            fontSize={13} // Reduced font size
          >
            {label}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: noBg ? '#fff' : themeColors.inputBackground,
          border: `1px solid ${themeColors.inputBorder}`,
          borderRadius: radius ?? 8, // Optional radius
          display: 'flex',
          alignItems: 'center',
          height: '40px', // Reduced height
          padding: removePadding ? '' : '0 8px',
        }}
        className={styles.inputContainer}
      >
        {leftIcon && <Box ml={1}>{icon}</Box>}
        <input
          {...rest}
          max={maxDate}
          value={formatNumber ? TextHelper.formatNumberWithCommas(String(rest.value)) : rest.value}
          onChange={
            formatNumber
              ? (event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = event.target.value.replaceAll(/,/g, '');
                  event.target.value = newValue;
                  if (rest.onChange) rest.onChange(event);
                }
              : rest.onChange
          }
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%', // Ensures full width inside container
            height: '100%',
            color: themeColors.blackWhite,
            fontSize: '14px', // Reduced font size
            fontFamily: "'Urbanist', sans-serif", // Applied Urbanist font
          }}
        />
        {rightIcon && <Box ml={1}>{icon}</Box>}
      </Box>
      {errorText && errorText.trim().length > 0 && (
        <ErrorText
          style={{
            fontSize: '12px', // Reduced font size for error text
            fontFamily: "'Urbanist', sans-serif", // Applied Urbanist font
          }}
        >
          {errorText}
        </ErrorText>
      )}
    </Box>
  );
};

export default InputField;
