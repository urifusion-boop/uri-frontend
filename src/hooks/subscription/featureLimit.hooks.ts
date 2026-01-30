import { FeatureLimitService } from '@/api/FeatureLimitService';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const useFeatureLimit = (userId: string) => {
  const { setIsLoading, setIsInitialState, setFeatureLimit } = useFeatureLimitStore();
  const authContext = useAuth();
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
        if (result.responseData?.subscriptionPlan && authContext?.saveSubscriptionPlanType) {
          authContext.saveSubscriptionPlanType(result.responseData?.subscriptionPlan);
        }
        return result.responseData;
      } else {
        // Feature limit not found is normal for new users without subscription/trial
        // Return null instead of throwing error
        setIsInitialState(false);
        return null;
      }
    },
    enabled: !!userId,
    retry: false, // Don't retry on 404
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    refetchIntervalInBackground: false, // Only refetch when tab is active
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce noise
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
