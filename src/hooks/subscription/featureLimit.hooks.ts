import { FeatureLimitService } from '@/api/FeatureLimitService';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const useFeatureLimit = (userId: string) => {
  const { setIsLoading, setIsInitialState, setFeatureLimit } = useFeatureLimitStore();
  const { saveSubscriptionPlanType } = useAuth();
  const {
    data,
    isLoading: queryIsLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feature-limit'],
    queryFn: async () => {
      const result = await FeatureLimitService.getUserFeatureLimit(userId ?? '');
      if (result.status && result.responseData) {
        setIsInitialState(false);
        setFeatureLimit(result.responseData);
        if (result.responseData?.subscriptionPlan) {
          saveSubscriptionPlanType(result.responseData?.subscriptionPlan);
        }
        return result.responseData;
      } else {
        throw new Error(result.responseMessage ?? 'Error fetching Feature limit');
      }
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!!queryIsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryIsLoading]);

  return { data, isLoading: queryIsLoading, error, refetch };
};

export default useFeatureLimit;
