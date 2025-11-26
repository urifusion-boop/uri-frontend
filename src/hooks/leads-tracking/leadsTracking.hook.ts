import { queryClient } from '@/configs/query-client.config';
import { GetByFiltersLeadsDto } from '@/models/dtos/LeadsDto';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from '../useDebounce';
import { useLeadQueries } from './leadTrackingQueries.hook';

export const useLeadTrackingHook = (activeTab: string, leadType?: LeadTypeEnum) => {
  const [search, setSearch] = useState<string>('');
  const searchValue = useDebounce(search, 500);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const [layout, setLayout] = useQueryState('layout', {
    defaultValue: 'row',
  });

  const { leadsQuery, businessInfoQuery, existingLeadFormQuery, updateStatusMutation, leadGenerationMutation, statusQueries, leadAnalyticsQuery, generateLeadReportMutation, enrichLeadMutation } = useLeadQueries(
    queryClient,
    {
      searchValue,
      page,
      pageSize,
      activeTab,
      leadType,
    }
  );

  const getLeadsData = (hook: UseInfiniteQueryResult<GetByFiltersLeadsDto | null | undefined, unknown>) => hook?.data?.pages.flatMap((page) => page?.data) ?? [];

  // Combine all leads from different statuses
  const allLeads = useMemo(
    () => [...getLeadsData(statusQueries.new)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusQueries.new.data]
  );

  // Get pagination controls for specific status
  const getPaginationFunction = useMemo(
    () => (status: string) => {
      const getStatusQuery = (status: string) => {
        if (status === LeadStatusEnum.NEW) {
          return statusQueries.new;
        }
        return null;
      };

      const query = getStatusQuery(status);
      if (!query) return null;

      return {
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
      };
    },
    [statusQueries]
  );

  // Check if any lead query is loading
  const isLoadingLeads = useMemo(() => Object.values(statusQueries).some((query) => query.isLoading) || leadsQuery.isLoading, [statusQueries, leadsQuery.isLoading]);

  useEffect(() => {
    if (searchValue) {
      setPage(1);
    }
  }, [searchValue]);

  return {
    setPage,
    setSearch,
    page,
    search,
    pageSize,
    setPageSize,
    layout,
    setLayout,
    leadsQuery,
    isLoadingLeads,
    leadAnalyticsData: leadAnalyticsQuery.data,
    isLoadingAnalytics: leadAnalyticsQuery.isLoading,
    businessInfoData: businessInfoQuery.data?.data?.[0] ?? null,
    isLoadingBusinessInfo: businessInfoQuery.isLoading,
    existingLeadForm: existingLeadFormQuery.data,
    isLoadingLeadForm: existingLeadFormQuery.isLoading,
    allLeads,
    getPaginationFunction,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isLoading,
    generateLead: leadGenerationMutation.mutate,
    isGeneratingLead: leadGenerationMutation.isLoading,
    generateLeadReport: generateLeadReportMutation.mutate,
    isGeneratingReport: generateLeadReportMutation.isLoading,
    enrichLead: enrichLeadMutation.mutate,
    isEnrichingLead: enrichLeadMutation.isLoading,
  };
};
