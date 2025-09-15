import { InstagramService } from '@/api/InstagramService';
import { MetricsHelper } from '@/helpers/MetricsHelper';
import { GetInstagramUserInteractionMetricsDto } from '@/models/dtos/InstagramInsights';
import { MetricsCategoryEnum, MetricsPeriodEnum, MetricsTypeEnum } from '@/models/enum-models/MetricEnum';
import { useQuery } from '@tanstack/react-query';

export const useInstagramUserInteractionMetrics = (data: GetInstagramUserInteractionMetricsDto, token?: string) => {
  const { data: instagramUserInteractionMetrics, isLoading: userInteractionMetricsLoading } = useQuery({
    queryKey: ['userInteractionMetrics', data?.ig_user_id],
    queryFn: async () => {
      if (!token) return [];
      if (!data?.ig_user_id) return [];

      const response = await InstagramService.fetchInstagramUserInteractionMetrics(
        {
          ...data,
          period: MetricsPeriodEnum.ALL_IG_PERIOD,
          metrics: MetricsHelper.getMetrics(MetricsCategoryEnum.REACH),
          metric_type: MetricsTypeEnum.TIME_SERIES,
        },
        token
      );
      return response.responseData ?? [];
    },
    enabled: !!data?.ig_user_id,
    staleTime: 30 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  return {
    instagramUserInteractionMetrics,
    userInteractionMetricsLoading,
  };
};
