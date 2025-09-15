import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { AiMessageService } from '@/api/AiMessageService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { AiMessageDto } from '@/models/dtos/AiMessageDto';
import { Message } from '@/models/dtos/BotMessageDto';

export const useAiMessageHook = (thread_id: string, scrollToBottom?: () => void) => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!thread_id) return;

      const storedChatHistory = localStorage.getItem(`chatHistory_${thread_id}`);
      if (storedChatHistory && storedChatHistory !== 'undefined') {
        setChatHistory(JSON.parse(storedChatHistory));
      } else {
        setChatHistory([]);
      }
    };

    loadChatHistory();
  }, [thread_id]);

  const saveChatHistory = async (newHistory: Message[]) => {
    if (!thread_id) return;

    setChatHistory(newHistory);
    localStorage.setItem(`chatHistory_${thread_id}`, JSON.stringify(newHistory));
  };

  // const createMessage = useMutation({
  //   mutationFn: async ({
  //     thread_id,
  //     message,
  //   }: {
  //     thread_id: string;
  //     message: string;
  //   }) => {
  //     const response = await AiMessageService.createMessage(thread_id, {
  //       content: [
  //         {
  //           type: "text",
  //           text: message,
  //         },
  //       ],
  //       role: "user",
  //     });

  //     return response;
  //   },
  //   onSuccess: (response) => {
  //     if (response.status) {
  //       const updatedHistory = [
  //         ...chatHistory,
  //         {
  //           role: "user",
  //           content: response.responseData?.content[0].text ?? "",
  //         },
  //       ];

  //       queryClient.invalidateQueries(["ai-message"]);
  //       setMessage("");
  //     } else {
  //       triggerToast(
  //         "error",
  //         response.responseMessage || "Failed to send message"
  //       );
  //     }
  //   },
  // });

  const createMessage = useMutation({
    mutationFn: async ({ thread_id, message }: { thread_id: string; message: string }) => {
      const response = await AiMessageService.createMessage(thread_id, {
        content: [{ type: 'text', text: message }],
        role: 'user',
      });
      return response;
    },
    onSuccess: async (response) => {
      if (response.status) {
        const updatedHistory = [
          ...chatHistory,
          {
            role: 'user',
            content: response.responseData?.content[0].text ?? '',
          },
        ];
        queryClient.invalidateQueries(['ai-message']);
        setMessage('');

        // Start polling for AI response after sending message
        await pollForAiResponse(thread_id);
      } else {
        if (response.responseMessage === '⏳ AI Run did not complete in time.' || response.responseMessage === '') {
          queryClient.invalidateQueries(['ai-message']);
        } else {
          triggerToast('error', response.responseMessage || 'Failed to send message');
        }
      }
    },
  });

  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['ai-message', thread_id],
    queryFn: async ({ pageParam = 50 }) => {
      if (!thread_id) return null;

      const response = await AiMessageService.getMessageByThreadId({
        thread_id,
        limit: pageParam,
        order: 'desc',
      });

      if (response?.data) {
        const messages = [...response.data].reverse();
        const updatedHistory = messages.map((message: AiMessageDto) => ({
          role: message.role,
          content: message.content[0].text.value ?? '',
        }));

        saveChatHistory(updatedHistory);
      }

      return response || null;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.has_more ? lastPage?.data.length + 10 : undefined;
    },
  });

  const clearLocalMessages = () => {
    localStorage.removeItem(`chatHistory_${thread_id}`);
    setChatHistory([]);
  };

  const clearMessages = useMutation({
    mutationFn: async () => {
      if (!thread_id) return { status: false };

      clearLocalMessages();

      return await AiMessageService.deleteAllMessages(thread_id);
    },
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries(['ai-message']);
      } else {
        triggerToast('error', response.status || 'Failed to clear messages');
      }
    },
  });

  const pollForAiResponse = async (thread_id: string) => {
    let retries = 0;
    const maxRetries = 20; // (20 × 3 seconds = 60 seconds max wait)
    const intervalMs = 3000; // 3 seconds delay

    while (retries < maxRetries) {
      console.log('🔄 Polling for AI response... try', retries + 1);

      const latestMessagesResponse = await AiMessageService.getMessageByThreadId({
        thread_id,
        limit: 50,
        order: 'desc',
      });

      const latestMessages = latestMessagesResponse?.data || [];

      const hasAiResponse = latestMessages.some((msg: AiMessageDto) => msg.role === 'assistant');

      if (hasAiResponse) {
        console.log('✅ AI response detected!');
        queryClient.invalidateQueries(['ai-message']);
        if (scrollToBottom) scrollToBottom();
        return;
      }

      retries++;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    console.warn('❗ AI did not respond in time.');
  };

  const messages = messagesData?.pages?.[messagesData?.pages?.length - 1]?.data;

  return {
    createMessage,
    messages,
    isLoading,
    message,
    setMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    clearMessages,
    chatHistory,
    saveChatHistory,
    clearLocalMessages,
  };
};
