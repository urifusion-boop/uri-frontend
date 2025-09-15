import { AiThreadService } from '@/api/AiThreadService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { CreateAiThreadDto } from '@/models/dtos/AiThreadDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useUriAssistantThreadHook = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [createNewThreadModalOpen, setCreateNewThreadModalOpen] = useState(false);

  const { userDetails } = useAuth();

  const getThreadByFilters = useQuery({
    queryKey: ['ai-thread'],
    queryFn: async () => {
      const response = await AiThreadService.getThreadByFilters({
        user_id: userDetails?.userId ?? '',
        limit: 20,
        skip: 0,
        // thread_id: "",
      });
      return response.responseData;
    },
  });

  const createThread = useMutation({
    mutationFn: async ({ data, onSuccessAction }: { data: Partial<CreateAiThreadDto>; onSuccessAction?: () => void }) => {
      const getThreadByThreadType = getThreadByFilters.data?.data.find((thread: { thread_type: string; thread_id: string }) => thread.thread_type === data.thread_type);

      if (!!getThreadByThreadType) {
        setSelectedThreadId(getThreadByThreadType.thread_id);
        onSuccessAction && onSuccessAction();
        return;
      }

      const response = await AiThreadService.createThread({
        user_id: userDetails?.userId ?? '',
        thread_type: data.thread_type ?? '',
        request_body: data.request_body || { messages: [] },
      });

      if (response.status) {
        triggerToast('success', 'Thread created successfully');
        queryClient.invalidateQueries(['ai-thread']);
        setSelectedThreadId(response.responseData?.id);

        if (onSuccessAction) {
          onSuccessAction();
        }
      } else {
        const errorMessage = response instanceof UriResponse ? response.responseMessage : 'Failed to create assistant';
        triggerToast('error', errorMessage);
      }

      return response;
    },
  });

  const deleteThread = useMutation({
    mutationFn: async (thread_id: string) => {
      const response = await AiThreadService.deleteThread(thread_id);
      return response;
    },

    onSuccess: (response) => {
      if (response.status) {
        triggerToast('success', 'Assistant deleted successfully');
        queryClient.invalidateQueries(['ai-thread']);
        setOpenDeleteModal(false);
        setSelectedThreadId(undefined);
      } else {
        triggerToast('error', response.responseMessage || 'Failed to delete assistant');
      }
    },
  });

  return {
    createThread,
    getThreadByFilters,
    deleteThread,
    openDeleteModal,
    setOpenDeleteModal,
    selectedThreadId,
    setSelectedThreadId,
    loadingIndex,
    setLoadingIndex,
    createNewThreadModalOpen,
    setCreateNewThreadModalOpen,
  };
};
