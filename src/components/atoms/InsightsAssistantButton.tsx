import React from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { BiBot } from 'react-icons/bi';
import { useRouter } from 'next/router';
import useCustomTheme from '@/hooks/theme.hook';

interface InsightsAssistantButtonProps {
  context?: string; // 'account-tracking' or 'hashtag-tracking'
}

const InsightsAssistantButton: React.FC<InsightsAssistantButtonProps> = ({ context }) => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();

  const handleClick = () => {
    // Navigate to Insights Assistant with context
    const query = context ? `?context=${context}` : '';
    router.push(`/uri-assistant${query}`);
  };

  return (
    <Tooltip title="Ask Insights Assistant" placement="left" arrow>
      <Fab
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: themeColors.primary,
          color: '#fff',
          width: 56,
          height: 56,
          boxShadow: '0 4px 12px rgba(205, 27, 120, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: themeColors.primary,
            transform: 'scale(1.1)',
            boxShadow: '0 6px 16px rgba(205, 27, 120, 0.4)',
          },
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 4px 12px rgba(205, 27, 120, 0.3)',
            },
            '50%': {
              boxShadow: '0 4px 20px rgba(205, 27, 120, 0.5)',
            },
            '100%': {
              boxShadow: '0 4px 12px rgba(205, 27, 120, 0.3)',
            },
          },
          animation: 'pulse 2s infinite',
        }}
        aria-label="insights assistant"
      >
        <BiBot size={28} />
      </Fab>
    </Tooltip>
  );
};

export default InsightsAssistantButton;
