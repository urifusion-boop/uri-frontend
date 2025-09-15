import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ChatBotService } from "../../api/ChatBotService";
import { Message, UserMessageDto } from "../../models/dtos/BotMessageDto";

export const useChatBotMessaging = () => {
  const { userDetails } = useAuth();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    const loadChatHistory = async () => {
      const storedChatHistory = localStorage.getItem(
        `chatHistory_${userDetails?.userId}`
      );
      if (storedChatHistory) {
        setChatHistory(JSON.parse(storedChatHistory));
      }
    };

    if (userDetails?.userId) {
      loadChatHistory();
    }
  }, [userDetails?.userId]);

  const saveChatHistory = async (newHistory: Message[]) => {
    setChatHistory(newHistory);
    localStorage.setItem(
      `chatHistory_${userDetails?.userId}`,
      JSON.stringify(newHistory)
    );
  };

  const addUserMessage = (message: Message) => {
    const updatedChatHistory = [...chatHistory, message];
    setChatHistory(updatedChatHistory);
    saveChatHistory(updatedChatHistory);
  };

  const { mutate: botAgentChat, isLoading: botChatLoading } = useMutation({
    mutationFn: async (message: Message) => {
      const userMessage: UserMessageDto = {
        messages: [message],
      };

      const response = await ChatBotService.botAgentChat(
        userDetails?.userId!,
        userMessage
      );
      const botResponse = response?.choices?.[0]?.message;

      if (botResponse) {
        const updatedChatHistory = [...chatHistory, botResponse];
        saveChatHistory(updatedChatHistory);
      }
      return botResponse;
    },
  });

  const { mutate: clearBotAgentChat, isLoading: clearBotChatLoading } =
    useMutation({
      mutationFn: async () => {
        await ChatBotService.clearChatBotMessages(userDetails?.userId);
        localStorage.removeItem(`chatHistory_${userDetails?.userId}`);
        setChatHistory([]);
      },
    });

  return {
    botAgentChat,
    botChatLoading,
    clearBotAgentChat,
    clearBotChatLoading,
    chatHistory,
    addUserMessage,
  };
};
