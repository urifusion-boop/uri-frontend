import { Box, ButtonProps, Checkbox, Link, Typography } from '@mui/material';

import useCustomTheme from '@/hooks/theme.hook';
import React from 'react';

interface LockedContentProps {
  title?: string;
  description?: string;
  checkboxLabel?: string;
  disclaimer?: string;
  showCheckbox?: boolean;
  showBtn?: boolean;
  btnProps?: ButtonProps;
  btnText?: string;
  icon?: React.ReactNode;
}

const LockedContent: React.FC<LockedContentProps> = ({
  title = 'This content is locked',
  description = 'This content is not available.',
  checkboxLabel = 'I agree with terms and agreement',
  disclaimer = '',
  showCheckbox = false,
  showBtn,
  btnProps,
  btnText,
  icon,
}) => {
  const { themeColors } = useCustomTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={4}
      bgcolor="#fff"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      borderRadius="8px"
      maxWidth="400px"
      m="0 auto"
      textAlign="center"
    >
      <Box fontSize="40px" mb={3}>
        {icon ?? (
          <span role="img" aria-label="lock">
            🔒
          </span>
        )}
      </Box>

      <Typography variant="h4" component="h2" fontSize={19} mb={2} color="#333" fontWeight="600">
        {title}
      </Typography>

      <Typography variant="body1" mb={3} fontSize={14} color="#666">
        {description}
      </Typography>

      {showBtn && (
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

      {showCheckbox && (
        <Box display="flex" alignItems="center" mb={3}>
          <Checkbox />
          <Typography variant="body2" color="#666">
            {checkboxLabel && (
              <Link href="#terms" underline="always" color="primary">
                {checkboxLabel}
              </Link>
            )}
          </Typography>
        </Box>
      )}

      <Typography variant="caption" color="#aaa" mt={2}>
        {disclaimer}
      </Typography>
    </Box>
  );
};

export default LockedContent;
