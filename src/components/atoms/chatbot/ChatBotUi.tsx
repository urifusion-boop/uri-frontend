import { Box, Chip, IconButton, InputBase, List, Menu, MenuItem, Skeleton, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { SingleMessage } from '@/components/messages/SingleMessage';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GoSmiley } from 'react-icons/go';
import { ChatBotSendIcon } from '../Icons';

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const AnimatedChip = styled(Chip)`
  animation: ${slideIn} 0.3s ease-in-out;
`;
const CustomInput = styled(InputBase)`
  flex: 1;
  border: none;
  background-color: transparent;
  &::after {
    display: none;
  }
`;

interface ChatBotUIProps {
  chatHistory: any[];
  botChatLoading: boolean;
  handleSend: (message?: string) => void;
  handleClearChat: () => void;
  recommendedMessages?: string[];
  loadingChat?: boolean;
  title?: string;
  setExpanded?: Dispatch<SetStateAction<boolean>>;
  expanded?: boolean;
}

const ChatBotUI: React.FC<ChatBotUIProps> = ({
  chatHistory,
  botChatLoading,
  recommendedMessages = ['❔ Ask another question', 'Write me a Facebook post', '❌ End Chat'],
  handleSend,
  handleClearChat,
  loadingChat,
  title,
  expanded,
  setExpanded,
}) => {
  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showRecommended, setShowRecommended] = useState(true);
  const [placeholder, setPlaceholder] = useState('Choose an option');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = useCallback((emoji: any) => {
    setInput((prevInput) => prevInput + emoji.native);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" bgcolor="#fff" border="1px solid #ccc" borderRadius="8px" height="100%" overflow="hidden">
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#FFEAF5',
          py: '14px',
          paddingLeft: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            gap: '8px',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#CD1B78',
              width: 'fit-content',
              borderRadius: '50%',
              py: 1,
              px: 0.5,
            }}
          >
            <img
              src="/assets/images/bot.png"
              alt="Uri AI"
              style={{
                width: 34.49,
                height: 25.21,
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: '#212529',
              fontSize: '18px',
            }}
          >
            {title ?? 'Assistant'}
          </Typography>
        </Box>

        {/* Expand button - only visible on tablet and desktop */}
        <IconButton
          onClick={() => setExpanded?.((prev) => !prev)}
          sx={{
            display: { xs: 'none', md: 'flex' },
            color: '#CD1B78',
            mr: 2,
          }}
          aria-label={expanded ? 'Collapse chatbot' : 'Expand chatbot'}
        >
          {expanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>

      <Box flexGrow={1} overflow="auto" mb={2} display="flex" flexDirection="column-reverse" px="16px" className="scroll">
        {loadingChat ? (
          Array.from({ length: 5 }, (_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              }}
            >
              <Skeleton
                height={index % 2 === 0 ? 60 : 40}
                width={200}
                variant="rectangular"
                sx={{
                  my: 2,
                  borderRadius: '12px',
                }}
              />
            </Box>
          ))
        ) : (
          <List>{chatHistory?.map((message, idx) => <SingleMessage msg={message} key={idx} maxWidth={{ xs: 'calc(80vw)', sm: expanded ? 'calc(600px - 110px)' : 'calc(400px - 110px)' }} />)}</List>
        )}
      </Box>

      {botChatLoading && (
        <Typography variant="caption" align="center">
          Dera is typing...
        </Typography>
      )}

      {showRecommended && (
        <Box
          sx={{
            p: 1,
            bgcolor: '#fff',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            maxWidth: '300px',
            mx: 'auto',
          }}
        >
          {recommendedMessages.map((msg, idx) => (
            <AnimatedChip
              key={idx}
              label={msg}
              onClick={() => {
                handleSend(msg);
                setShowRecommended(false);
                setPlaceholder('Ask your AI Assistant');
                setInput('');
              }}
              sx={{
                bgcolor: '#fff',
                cursor: 'pointer',
                border: '1px solid #E984B999',
                borderRadius: '6px',
                color: '#3A3A3A',
              }}
            />
          ))}
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={1} bgcolor="#fff" borderRadius={0} border="1px solid #e0e0e0" borderBottom={0} padding={1}>
        <Box
          component={'form'}
          display="flex"
          alignItems="center"
          width="100%"
          border="1px solid #e0e0e0"
          borderRadius={3}
          paddingLeft={1}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
            setShowRecommended(false);
            setPlaceholder('Ask your AI Assistant');
            setInput('');
          }}
        >
          <CustomInput placeholder={placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)} sx={{ opacity: botChatLoading ? 0.5 : 1, cursor: botChatLoading ? 'not-allowed' : 'pointer' }} disabled={botChatLoading}>
            <GoSmiley />
          </IconButton>
          <IconButton
            onClick={() => {
              if (botChatLoading) return;
              handleSend(input);
              setShowRecommended(false);
              setPlaceholder('Ask your AI Assistant');
              setInput('');
            }}
            sx={{ opacity: botChatLoading ? 0.5 : 1, cursor: botChatLoading ? 'not-allowed' : 'pointer' }}
            disabled={botChatLoading}
          >
            <ChatBotSendIcon />
          </IconButton>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleClearChat();
              handleMenuClose();
              setPlaceholder('Choose an option');
              setShowRecommended(true);
            }}
            sx={{
              color: '#CD1B78',
              fontSize: '14px',
            }}
          >
            Clear Chat
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              fontSize: '14px',
            }}
          >
            Cancel
          </MenuItem>
        </Menu>
      </Box>

      {showEmojiPicker && (
        <Box ref={emojiPickerRef} sx={{ position: 'absolute', bottom: '60px', right: '20px', zIndex: 1000 }}>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </Box>
      )}
    </Box>
  );
};

export default ChatBotUI;
