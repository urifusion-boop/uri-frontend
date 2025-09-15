import { FeedbackService } from '@/api/FeedbackService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { STORE_KEYS } from '@/configs/store.config';
import { useAuth } from '@/providers/AuthProvider';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage.util';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useFeedbackHook = () => {
  const { userDetails } = useAuth();
  const [feedback, setFeedback] = useState({
    satisfaction: 0,
    favoriteFeatures: [''],
    thoughts: '',
    emoji: '',
  });
  const [open, setOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const lastOpened = getLocalStorageItem<string>(STORE_KEYS.LAST_FEEDBACK_MODAL_DATE);

  const createFeedback = useMutation({
    mutationFn: async () => {
      const response = await FeedbackService.createFeedback({
        ...feedback,
        userId: userDetails?.userId ?? '',
      });

      if (response.status) {
        setFeedback({
          satisfaction: 0,
          favoriteFeatures: [''],
          thoughts: '',
          emoji: '',
        });
        setOpen(false);
        setOpenSuccessModal(true);

        setLocalStorageItem(STORE_KEYS.LAST_FEEDBACK_MODAL_DATE, 'done');

        triggerToast('success', 'Feedback submitted successfully');
      }

      return response;
    },
  });

  const getFeedbackByUserId = useMutation({
    mutationFn: async () => {
      const response = await FeedbackService.getFeedbackByUserId(userDetails?.userId ?? '');

      const now = new Date();

      if (response.status) {
        if (response.responseData && response.responseData.length > 10) {
          setLocalStorageItem(STORE_KEYS.LAST_FEEDBACK_MODAL_DATE, 'done');

          return response.responseData;
        }

        if (lastOpened) {
          const lastOpenedDate = new Date(lastOpened);
          const daysDifference = Math.floor((now.getTime() - lastOpenedDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDifference >= 4) {
            setOpen(true);
            setLocalStorageItem(STORE_KEYS.LAST_FEEDBACK_MODAL_DATE, now.toISOString());
          }
        } else {
          setOpen(true);
          setLocalStorageItem(STORE_KEYS.LAST_FEEDBACK_MODAL_DATE, now.toISOString());
        }
      }
      return response.responseData;
    },
  });

  useEffect(() => {
    if (lastOpened) {
      return;
    }

    getFeedbackByUserId.mutate();
  });

  return {
    createFeedback,
    feedback,
    setFeedback,
    open,
    setOpen,
    openSuccessModal,
    setOpenSuccessModal,
  };
};
