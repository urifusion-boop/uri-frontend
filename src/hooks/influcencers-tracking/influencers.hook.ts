import { CreateInfluencerDto, InfluencerDto, InfluencerFilterDto } from '@/models/dtos/InfluencerDto';
import { useMutation, useQuery } from '@tanstack/react-query';

import { InfluencerService } from '@/api/InfluencerService';
import { queryClient } from '@/configs/query-client.config';
import toast from 'react-hot-toast';
/* eslint-disable import/no-unused-modules */
import { useState } from 'react';

// Hook for creating an influencer
export const useCreateInfluencer = () => {
  const { setCreateModalOpen } = useInfluencersModal();
  return useMutation({
    mutationFn: async (data: CreateInfluencerDto) => {
      const response = await InfluencerService.createInfluencerApi(data);
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: ['influencers'] });
        queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

        setCreateModalOpen(false); // Close modal after success
        return response.responseData;
      } else {
        toast.error(response.responseMessage);
      }
    },
  });
};

// Hook for updating an influencer
export const useUpdateInfluencer = (influencerId: string) => {
  const { setEditModalOpen } = useInfluencersModal();
  return useMutation({
    mutationFn: async (data: Partial<InfluencerDto>) => {
      const response = await InfluencerService.updateInfluencerApi({
        influencer_id: influencerId,
        ...data,
      });
      if (response.status) {
        setEditModalOpen(false); // Close modal after success
        queryClient.invalidateQueries({ queryKey: ['influencers'] });
        queryClient.invalidateQueries({ queryKey: ['influencerData'] });
        return response.responseData;
      } else {
        toast.error(response.responseMessage);
      }
    },
  });
};

// Hook for fetching influencer by ID
export const useGetInfluencerById = (influencerId: string) => {
  return useQuery({
    queryKey: ['influencer', influencerId],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencerByIdApi(influencerId);
      return response.responseData;
    },
    enabled: !!influencerId, // Only run if influencerId is defined
  });
};

// Hook for fetching influencers by filters
export const useGetInfluencersByFilters = (filters: InfluencerFilterDto) => {
  return useQuery({
    queryKey: ['influencers', filters],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencersByFilters(filters);
      return response.responseData;
    },
    enabled: !!filters, // Only run if filters are defined
  });
};

// Custom hook for managing modal state
export const useInfluencersModal = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return {
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
  };
};
