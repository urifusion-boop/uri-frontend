import { Box, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IChatbotToggleProps {
  children: React.ReactNode;
  isLoading?: boolean;
  floatingText?: string;
  ctaText?: string;
  expanded?: boolean;
}

const ChatbotToggle = ({ children, isLoading, expanded, floatingText = 'Would you like to chat about your data?', ctaText = 'Start chatting!' }: IChatbotToggleProps) => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Control when to show the popup
  useEffect(() => {
    // Show popup after 3 seconds if chatbot is not open
    const timer = setTimeout(() => {
      if (!showChatbot) {
        setShowPopup(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showChatbot]);

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          bottom: '30px',
          zIndex: 9,
          width: '45px',
          height: '45px',
          borderRadius: '99999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#CD1B7878',
          marginLeft: 'auto', // This pushes it to the right
          marginRight: '30px', // Adjust this for spacing from the right
          marginBottom: '30px', // Adjust this for spacing from the bottom
        }}
      >
        {/* Popup Message */}
        <AnimatePresence>
          {showPopup && !showChatbot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                bottom: '60px',
                right: '0',
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  maxWidth: '250px',
                  width: '250px',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    right: '25px',
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid #fff',
                  },
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                    '100%': { transform: 'translateY(0px)' },
                  },
                }}
              >
                <Typography sx={{ color: '#333', fontWeight: 500, fontSize: '14px' }}>
                  {floatingText}{' '}
                  <Box
                    component="span"
                    sx={{
                      color: '#CD1B78',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'right',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => {
                      setShowPopup(false);
                      setShowChatbot(true);
                    }}
                  >
                    {ctaText}
                  </Box>
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot Button */}
        <Tooltip title={isLoading ? 'Creating conversation' : ''} arrow placement="top">
          <Box
            sx={{
              backgroundColor: '#CD1B78',
              borderRadius: '9999999px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              transform: showChatbot ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
            onClick={() => {
              if (isLoading) return; // Prevent interaction if loading
              setShowChatbot((prev) => !prev);
              setShowPopup(false);
            }}
          >
            <Box component="img" src="/assets/images/bot.png" alt="Chatbot" sx={{ width: '34.49px', height: '25.21px' }} />
          </Box>
        </Tooltip>

        <Box
          sx={{
            position: 'absolute',
            bottom: '70px',
            right: '0px',
            zIndex: 9,
            minHeight: '80vh',
            maxHeight: '500px',
            height: '100%',
            width: { xs: '90vw', sm: expanded ? '600px' : '400px' },
            display: showChatbot ? 'block' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {children}
        </Box>
      </Box>

      <Box
        sx={{
          display: showChatbot ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          transition: 'background-color 0.3s ease',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black transparent background
          zIndex: 8, // Ensure it's below the chatbot but above other elements
        }}
        onClick={() => setShowChatbot(false)} // Close the chatbot when clicking the overlay
      />
    </>
  );
};

export default ChatbotToggle;
