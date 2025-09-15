import { SubscriptionService } from '@/api/SubscriptionService';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

export const useActiveSubscription = () => {
  const { userDetails } = useAuth();

  const { data: activeSubscription, isLoading: isLoadingActiveSubscription } = useQuery({
    queryKey: ['activeSubscription'],
    queryFn: async () => {
      if (!userDetails?.email) return;

      const response = await SubscriptionService.getActiveSubscriptionByEmail(userDetails?.email);
      if (response.status) {
        return response.responseData;
      } else {
        return null;
      }
    },
    enabled: !!userDetails?.email,
  });

  return {
    activeSubscription,
    isLoadingActiveSubscription,
  };
};
