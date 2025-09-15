import { useEffect, useRef, useState } from 'react';

import ChatBotUI from '@/components/atoms/chatbot/ChatBotUi';
import ChatbotToggle from '@/components/atoms/chatbot/ChatbotToggle';
import { isFeatureDisabled } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useAiMessageHook } from '@/hooks/uri-assistant/aiMessage.hook';
import { useUriAssistantThreadHook } from '@/hooks/uri-assistant/uriAssistantThreads.hook';
import { AiMessageDto } from '@/models/dtos/AiMessageDto';
import { AiAssistantThreadTypeEnum } from '@/models/enum-models/AiAssistantThreadTypeEnum';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';

const getPromptByType = (type: string, tracker_name: string, tracker_platform?: string) => {
  switch (type) {
    case AiAssistantThreadTypeEnum.ACCOUNT_TRACKING_INSIGHTS:
      return `The next question I will ask is going to be on this account, ${tracker_name} on the platform ${tracker_platform}.`;
    case AiAssistantThreadTypeEnum.HASHTAG_TRACKING_INSIGHTS:
    default:
      return `The next question I will ask is going to be on this hashtag, ${tracker_name}.`;
  }
};

const TrackerChatbot = ({ tracker_name, tracker_platform, type }: { tracker_name?: string; tracker_platform?: string; type: string }) => {
  const { createThread, getThreadByFilters, deleteThread, selectedThreadId, setSelectedThreadId } = useUriAssistantThreadHook();
  const [expanded, setExpanded] = useState(false);

  const { createMessage, messages, isLoading, setMessage, saveChatHistory, chatHistory, clearLocalMessages } = useAiMessageHook(selectedThreadId ?? '');
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const handleSendMessage = (message?: string) => {
    const userMessage = message?.trim();
    if (!userMessage) return;

    const newMessage = {
      role: 'user',
      content: [{ text: { value: userMessage }, type: 'text' }],
    };

    saveChatHistory([...chatHistory, { ...newMessage, content: newMessage.content[0].text.value }]);

    messages?.push(newMessage as AiMessageDto);
    setMessage('');

    createMessage.mutate({
      thread_id: selectedThreadId ?? '',
      message: userMessage,
    });
  };

  // handle the delete thread
  const handleDeleteThread = () => {
    if (selectedThreadId) {
      deleteThread.mutate(selectedThreadId, {
        onSuccess: () => {
          clearLocalMessages();
        },
      });
    }
  };

  const isCreatingThread = useRef(false);

  // initialize the thread
  useEffect(() => {
    if (getThreadByFilters.isLoading || createThread.isLoading) return;

    if (getThreadByFilters.data?.data !== undefined) {
      const selectedThread = getThreadByFilters.data?.data?.find((thread) => thread.thread_type === type);

      if (selectedThread) {
        setSelectedThreadId(selectedThread.thread_id);
      } else if (!isCreatingThread.current) {
        isCreatingThread.current = true;
        createThread.mutate({
          data: {
            thread_type: type,
            request_body: {},
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getThreadByFilters.data?.data]);

  const hasInitializedThread = useRef(false);

  // initialize ai chat
  useEffect(() => {
    if (isLoading || createMessage.isLoading) return;

    if (selectedThreadId) {
      if (!hasInitializedThread.current) {
        hasInitializedThread.current = true;
        handleSendMessage(getPromptByType(type, tracker_name ?? '', tracker_platform));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThreadId, isLoading, createMessage.isLoading]);

  if (!selectedThreadId) {
    return null;
  }

  if (isFeatureDisabled(featureLimit, 'aiMessage')) {
    return;
  }

  return (
    <ChatbotToggle isLoading={createThread.isLoading} expanded={expanded}>
      <ChatBotUI
        recommendedMessages={[]}
        title={TextHelper.capitalize(type.split(' ')?.[0]) + ' Insight Assistant'}
        botChatLoading={createMessage.isLoading}
        loadingChat={isLoading || getThreadByFilters.isLoading}
        chatHistory={chatHistory ?? []}
        handleSend={handleSendMessage}
        handleClearChat={handleDeleteThread}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </ChatbotToggle>
  );
};

export default TrackerChatbot;
