import { TrialService } from '@/api/TrialService';
import { useQuery } from '@tanstack/react-query';

export const useTrialStatus = (userId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['trial-status', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await TrialService.getTrialStatus(userId);
      return response.status && response.responseData ? response.responseData : null;
    },
    enabled: !!userId && enabled,
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce noise
    staleTime: 60000, // Data is fresh for 60 seconds
    keepPreviousData: true,
    retry: false,
  });
};
