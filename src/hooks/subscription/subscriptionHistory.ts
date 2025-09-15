import { SubscriptionService } from '@/api/SubscriptionService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { UpdateSubscriptionParametersDto } from '@/models/dtos/SubscriptionDto';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useSubscriptionHistory = () => {
  const [page, setPage] = useState(1);
  const { userDetails } = useAuth();

  const { data: subscriptionHistory, isLoading: isLoadingSubscriptionHistory } = useQuery({
    queryKey: ['subscriptionHistory', page, userDetails?.userId],
    queryFn: async () => {
      const response = await SubscriptionService.getSubscriptionsByProviders({
        pageNumber: page,
        pageSize: 5,
        email: userDetails?.email!,
        customer_id: userDetails?.paystackId,
      });

      return response.responseData;
    },
  });

  const disableSubscriptionMutation = useMutation({
    mutationFn: async (data: UpdateSubscriptionParametersDto) => {
      const response = await SubscriptionService.disableSubscription(data);

      if (response.responseData?.status || response.status) {
        queryClient.invalidateQueries(['activeSubscription']);
        queryClient.invalidateQueries(['subscriptionHistory']);
      } else {
        triggerToast('error', response.responseMessage ?? 'Failed to disable subscription');
        throw new Error(response.responseMessage);
      }

      return response.responseData;
    },
  });

  return {
    subscriptionHistory,
    page,
    setPage,
    isLoadingSubscriptionHistory,
    disableSubscriptionMutation,
  };
};
