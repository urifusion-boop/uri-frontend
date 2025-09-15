import { SubscriptionPlanService } from '@/api/SubscriptionPlanService';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

export const useSubscriptionPlans = () => {
  const { userDetails } = useAuth();

  const { data: subscriptionPlans, isLoading: subscriptionPlansLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      try {
        const response = (
          await SubscriptionPlanService.getSubscriptionPlans({
            pageNumber: 1,
            pageSize: 10,
          })
        ).responseData;

        return response?.data;
      } catch (error) {
        return [];
      }
    },
    // enabled: !!userDetails?.userId,
  });

  return {
    subscriptionPlans,
    subscriptionPlansLoading,
  };
};
