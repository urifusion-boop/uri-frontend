import ChatbotToggle from '@/components/atoms/chatbot/ChatbotToggle';
import { useState } from 'react';
import { useChatBotMessaging } from '../../../hooks/bot/chatBotMessging.hook';
import { useAuth } from '../../../providers/AuthProvider';
import ChatBotUI from './ChatBotUi';

const ChatBot = ({ recommendedMessages = ['❔Ask another question', 'Write me a facebook post', '❌ End Chat'] }) => {
  const { userDetails, userProfile } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const { botAgentChat, botChatLoading, clearBotAgentChat, chatHistory, addUserMessage } = useChatBotMessaging();

  const handleSend = (message?: string) => {
    const content = message;
    if (content && userDetails) {
      const userMessage = {
        role: 'user',
        content,
        userName: userDetails.firstName,
        userImage: userProfile.headshot?.url ?? userProfile.logo?.url,
      };
      addUserMessage(userMessage);
      botAgentChat(userMessage);
    }
  };

  const handleClearChat = () => {
    clearBotAgentChat();
  };

  return (
    <ChatbotToggle expanded={expanded} floatingText="Dera here 😀! How can I assist you today?" ctaText="Let's chat">
      <ChatBotUI
        expanded={expanded}
        setExpanded={setExpanded}
        botChatLoading={botChatLoading}
        chatHistory={chatHistory}
        handleSend={handleSend}
        handleClearChat={handleClearChat}
        recommendedMessages={recommendedMessages}
      />
    </ChatbotToggle>
  );
};

export default ChatBot;
