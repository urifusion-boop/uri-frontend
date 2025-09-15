import { useContentManagementChatBotHook } from '@/hooks/content-management/contentManagementChatBot.hook';
import { useAuth } from '../../providers/AuthProvider';
import ChatBotUI from '../atoms/chatbot/ChatBotUi';

const ContentManagementChatBot = () => {
  const { userDetails } = useAuth();

  const { chatHistory, clearMessages, createMessage, saveChatHistory, getThreadByFilters } = useContentManagementChatBotHook();

  const handleSend = (message?: string) => {
    if (!message) return;

    const content = message.trim();

    if (content && userDetails) {
      const newMessage = {
        role: 'user',
        content: [{ text: { value: content }, type: 'text' }],
      };

      saveChatHistory([...chatHistory, { ...newMessage, content: newMessage.content[0].text.value }]);

      createMessage.mutate(content);
    }
  };

  return (
    <ChatBotUI chatHistory={chatHistory} botChatLoading={createMessage.isLoading} handleSend={handleSend} handleClearChat={() => clearMessages.mutate()} loadingChat={getThreadByFilters.isLoading} />
  );
};

export default ContentManagementChatBot;
