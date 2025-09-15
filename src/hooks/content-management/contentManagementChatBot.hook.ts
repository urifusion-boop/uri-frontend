import { useEffect, useState } from "react";
import { Message } from "@/models/dtos/BotMessageDto";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AiThreadService } from "@/api/AiThreadService";
import { useAuth } from "@/providers/AuthProvider";
import { AiAssistantThreadTypeEnum } from "@/models/enum-models/AiAssistantThreadTypeEnum";
import { queryClient } from "@/configs/query-client.config";
import { triggerToast } from "@/components/atoms/CustomToast";
import { AiMessageService } from "@/api/AiMessageService";

export const useContentManagementChatBotHook = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const { userDetails } = useAuth();
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  const getThreadByFilters = useQuery({
    queryKey: ["ai-thread"],
    queryFn: async () => {
      const response = await AiThreadService.getThreadByFilters({
        user_id: userDetails?.userId ?? "",
        limit: 20,
        skip: 0,
        thread_type: AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS,
      });

      if (response.status) {
        setThreadId(response?.responseData?.data?.[0].thread_id);

        const storedChatHistory = localStorage.getItem(
          `chatHistory_${AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS}`
        );

        if (!storedChatHistory) {
          localStorage.setItem(
            `chatHistory_${AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS}`,
            JSON.stringify(
              response?.responseData?.data?.[0].messages?.map((message) => ({
                role: message.role,
                content: message?.content?.[0].text,
              })) || []
            )
          );

          setChatHistory(
            response?.responseData?.data?.[0].messages?.map((message) => ({
              role: message.role,
              content: message?.content[0].text,
            })) || []
          );
        }

        return response.responseData;
      } else {
        const response = await AiThreadService.createThread({
          user_id: userDetails?.userId ?? "",
          thread_type: AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS,
          request_body: {},
        });

        if (response.status) {
          setThreadId(response?.responseData?.id);
        }

        return response.responseData;
      }
    },
  });

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!threadId) return;

      const storedChatHistory = localStorage.getItem(
        `chatHistory_${AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS}`
      );

      if (storedChatHistory && storedChatHistory !== "undefined") {
        setChatHistory(JSON.parse(storedChatHistory));
      } else {
        setChatHistory([]);
      }
    };

    loadChatHistory();
  }, [threadId, userDetails?.userId]);

  const createMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!threadId) return { status: false };

      const response = await AiMessageService.createMessage(threadId, {
        content: [
          {
            type: "text",
            text: message,
          },
        ],
        role: "user",
      });

      if (!response.status) {
        triggerToast("error", response.status || "Failed to send message");

        return;
      }

      const responseMessage = await AiMessageService.getMessageByThreadId({
        thread_id: threadId ?? "",
        limit: 10,
        order: "desc",
      });

      if (responseMessage.data) {
        const botMessage = {
          role: "assistant",
          content: responseMessage?.data?.[0]?.content[0]?.text.value ?? "",
        };
        saveChatHistory([...chatHistory, botMessage]);
        localStorage.setItem(
          `chatHistory_${AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS}`,
          JSON.stringify([...chatHistory, botMessage])
        );
      }

      return responseMessage;
    },
  });

  const clearMessages = useMutation({
    mutationFn: async () => {
      if (!threadId) return { status: false };

      const response = await AiThreadService.deleteThread(threadId);

      if (!response.status) {
        triggerToast("error", response.status || "Failed to clear messages");
      }

      localStorage.removeItem(
        `chatHistory_${AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS}`
      );
      setChatHistory([]);

      const createResponse = await AiThreadService.createThread({
        user_id: userDetails?.userId ?? "",
        thread_type: AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS,
        request_body: {},
      });

      if (createResponse.status) {
        setThreadId(createResponse?.responseData?.id);
      }

      return createResponse;
    },
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries(["ai-message"]);
        setChatHistory([]);
      } else {
        triggerToast("error", response.status || "Failed to clear messages");
      }
    },
  });

  const saveChatHistory = async (newHistory: Message[]) => {
    if (!threadId) return;

    setChatHistory(newHistory);
    localStorage.setItem(
      `chatHistory_${AiAssistantThreadTypeEnum.CONTENT_MANAGEMENT_INSIGHTS}`,
      JSON.stringify(newHistory)
    );
  };

  return {
    chatHistory,
    clearMessages,
    createMessage,
    saveChatHistory,
    getThreadByFilters,
  };
};
