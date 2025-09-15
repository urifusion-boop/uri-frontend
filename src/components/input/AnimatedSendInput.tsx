import { LightThemeColors } from '@/configs/colors.config';
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { BsSendFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

interface AnimatedSendInputProps {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  inputValue: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  loading?: boolean;
  placeholder?: string;
}

const AnimatedSendInput: React.FC<AnimatedSendInputProps> = ({ isEditing, setIsEditing, inputValue, onChange, onSend, onKeyDown, loading = false, placeholder = 'Type here...' }) => {
  return (
    <AnimatePresence mode="wait">
      {isEditing && (
        <motion.div
          key="input"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ position: 'relative', width: '100%' }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              border: '1px solid rgba(107, 114, 128, 0.2)', // faded gray border
              backgroundColor: '#fafafa',
              padding: 2,
              pr: 6,
              mt: 1,
            }}
          >
            <TextField
              autoFocus
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              value={inputValue}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: 14,
                  fontFamily: 'inherit',
                  backgroundColor: 'transparent',
                },
              }}
            />

            <Tooltip title="Send" arrow>
              <motion.button
                disabled={loading}
                onClick={onSend}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  backgroundColor: LightThemeColors.uriColor,
                  borderRadius: '100%',
                  padding: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {loading ? (
                  <Box
                    component="span"
                    sx={{
                      width: 16,
                      height: 16,
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      '@keyframes spin': {
                        to: {
                          transform: 'rotate(360deg)',
                        },
                      },
                    }}
                  />
                ) : (
                  <BsSendFill size={16} color="#fff" />
                )}
              </motion.button>
            </Tooltip>
          </Box>

          <IconButton
            onClick={() => setIsEditing(false)}
            sx={{
              position: 'absolute',
              top: -20,
              right: -30,
              backgroundColor: '#f3f4f6',
              borderRadius: 2,
              padding: 0.5,
            }}
          >
            <IoClose size={20} color="#5C5C5C" />
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSendInput;
