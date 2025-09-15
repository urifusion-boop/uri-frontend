import { ToastService } from '@/utils/toast.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';

import { KeywordTrackerService } from '@/api/KeywordTrackerService';
import { queryClient } from '@/configs/query-client.config';
import { TrackerDto } from '@/models/dtos/TrackerDto';
import { ToastTypeEnum } from '@/models/enum-models/ToastTypeEnum';
import { TrackerTypeEnum } from '@/models/enum-models/TrackerTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { AxiosError } from 'axios';
import { useState } from 'react';

type SelectedTracker = {
  tracker?: TrackerDto | null;
  action?: 'create' | 'update' | 'delete';
} | null;

export const useTackerData = (trackerType: TrackerTypeEnum = TrackerTypeEnum.KEYWORD) => {
  const { userDetails } = useAuth();

  const [selectedTracker, setSelectedTracker] = useState<SelectedTracker>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<{ code: string; label: string }[]>([]);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [page, setPage] = useQueryState('count', parseAsInteger.withDefault(1));

  // Queries
  const {
    data: trackerData,
    isLoading: isLoadingTracker,
    error: trackerError,
    isError: isTrackerError,
  } = useQuery({
    queryKey: ['trackers', trackerType, page],
    queryFn: async () => {
      const response = await KeywordTrackerService.getTrackersByFilters({
        user_id: userDetails?.userId,
        skip: (page - 1) * 10,
        limit: 10,
        tracker_type: trackerType,
      });
      return response.responseData;
    },
  });

  // Mutations
  const {
    mutate: createTracker,
    isLoading: isCreatingTracker,
    error: createTrackerError,
  } = useMutation({
    mutationFn: async () => {
      if (selectedTracker?.tracker?.keywords?.length === 0) {
        throw new Error('Tracker is required');
      }
      const response = await KeywordTrackerService.createTrackerApi({
        ...selectedTracker?.tracker,
        user_id: userDetails?.userId,
        tracker_type: trackerType,
      });

      if (!response.status) {
        ToastService.showToast(response.responseMessage, ToastTypeEnum.Error);

        queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
        throw new Error(response.responseMessage);
      }

      queryClient.invalidateQueries({ queryKey: ['trackers', trackerType] });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
      queryClient.invalidateQueries({
        queryKey: ['current-tracker-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['keyword-tracking-posts-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['twitter-sentiment-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['keyword-tracking-influencer-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['sentiment-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['top-platform-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['top-words-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['top-countries-data'],
      });
      queryClient.invalidateQueries({
        queryKey: ['keyword-track-data'],
      });
      setPage(1);
      setOpenModal(false);
      setSelectedTracker(null);
      setSelectedCountries([]);

      return response.responseData;
    },
  });

  const { mutate: updateTracker, isLoading: updatingTracker } = useMutation({
    mutationFn: async () => {
      const response = await KeywordTrackerService.updateTrackerApi({
        ...selectedTracker?.tracker,
        user_id: userDetails?.userId,
      });

      if (!response.status) {
        throw new Error(response.responseMessage);
      }

      queryClient.invalidateQueries({ queryKey: ['trackers', trackerType] });
      queryClient.invalidateQueries({ queryKey: ['current-tracker-data'] });

      setOpenModal(false);
      setSelectedTracker(null);
      setSelectedCountries([]);

      return response.responseData;
    },
  });

  const { mutate: deleteTracker, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = await KeywordTrackerService.deleteTrackerApi(selectedTracker?.tracker?.tracker_id ?? '');

      if (!response.status) {
        throw new Error(response.responseMessage);
      }

      queryClient.invalidateQueries({ queryKey: ['trackers', trackerType] });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

      setSelectedTracker(null);
      setIsModalDeleteOpen(false);

      return response.responseData;
    },
  });

  const disabledBtn = !selectedTracker?.tracker?.name || !selectedTracker?.tracker?.keywords || selectedTracker?.tracker?.keywords.filter((keyword) => keyword !== '').length === 0;

  return {
    trackerData,
    isLoadingTracker,
    setSelectedTracker,
    selectedTracker,
    createTracker,
    isCreatingTracker,
    updateTracker,
    updatingTracker,
    openModal,
    setOpenModal,
    selectedCountries,
    setSelectedCountries,
    disabledBtn,
    deleteTracker,
    isDeleting,
    isModalDeleteOpen,
    setIsModalDeleteOpen,
    createTrackerError: (createTrackerError as AxiosError)?.message,
    page,
    setPage,
    trackerError: (trackerError as AxiosError)?.message,
    isTrackerError,
  };
};
