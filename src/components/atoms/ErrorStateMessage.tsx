import { Box, ButtonProps } from '@mui/material';

import useCustomTheme from '@/hooks/theme.hook';

interface IErrorStateMessage {
  message?: string;
  hasBtn?: boolean;
  btnProps?: ButtonProps;
  btnText?: string;
}

const ErrorStateMessage = ({ message, hasBtn, btnText, btnProps }: IErrorStateMessage) => {
  const { themeColors } = useCustomTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: '20px',
        paddingY: 5,
        backgroundColor: '#f8d7da',
        borderRadius: '8px',
        color: '#721c24',
        gap: 5,
      }}
    >
      {message && (
        <Box
          sx={{
            marginLeft: '10px',
            fontSize: '14px',
            color: '#721c24',
          }}
        >
          {message}
        </Box>
      )}
      {hasBtn && (
        <Box
          component={'button'}
          onClick={btnProps?.onClick}
          sx={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: themeColors.primary,
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          {btnText || 'Retry'}
        </Box>
      )}
    </Box>
  );
};

export default ErrorStateMessage;
