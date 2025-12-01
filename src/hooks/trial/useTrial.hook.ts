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
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: false, // Only refetch when tab is active
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 30000, // Consider data stale after 30 seconds
    keepPreviousData: true, // Keep showing old data while fetching new data
    retry: false, // Don't retry on error (trial may not exist yet)
  });
};
