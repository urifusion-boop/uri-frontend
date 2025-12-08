import { LeadsService as LeadFormService } from '@/api/LeadFormService';
import { LeadsService } from '@/api/LeadsService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { LeadHelper } from '@/helpers/LeadHelper';
import { EnrichLeadsDto, ExportLeadDto, LeadBusinessInfoDto } from '@/models/dtos/LeadsDto';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useLeadTrackingStore } from '@/store/leads-tracking/useLeadTrackingStore';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export const useLeadQueries = (
  queryClient: QueryClient,
  {
    searchValue,
    page,
    pageSize,
    activeTab,
    leadType,
  }: {
    searchValue: string;
    page: number;
    pageSize: number;
    activeTab: string;
    leadType?: LeadTypeEnum;
  }
) => {
  const { userDetails } = useAuth();
  const userId = userDetails?.userId ?? '';

  // Get filters from store
  const { leadStatus, interestLevel, dateFilter, leadsDateFilter, leadSource, leadStarred, setLeadsData } = useLeadTrackingStore((state) => state);

  // Query to fetch leads by filters or search
  const leadsQuery = useQuery({
    queryKey: ['leads-data', userId, searchValue, page, pageSize, leadStatus, interestLevel, leadSource, leadStarred, leadsDateFilter, leadType],
    queryFn: async () => {
      if (searchValue) {
        const result = await LeadsService.search({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          query: searchValue,
        });
        return result.responseData;
      }

      const result = await LeadsService.getByFilters({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        assigned_to: userId,
        ...(leadType && { lead_type: leadType }),
        ...(leadStatus && { lead_status: leadStatus }),
        ...(interestLevel && { interest_level: interestLevel }),
        ...(leadSource && { lead_source: leadSource }),
        ...(leadStarred === 'star' && { starred: leadStarred === 'star' }),
        ...(leadsDateFilter && { date_filter: leadsDateFilter }),
      });

      setLeadsData(result.responseData?.data ?? []);

      return result.responseData;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: false, // Only refetch when tab is active
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    keepPreviousData: true, // Keep showing old data while fetching new data
  });

  // Query for analytics data
  const leadAnalyticsQuery = useQuery({
    queryKey: ['lead-analytics', userId, dateFilter, leadType],
    queryFn: async () => {
      const response = await LeadsService.getLeadAnalytics(userId, dateFilter ?? '', leadType);
      return response.responseData;
    },
    enabled: true, // Always enabled since analytics data is needed on the leads tab
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true,
    refetchInterval: 30000, // Auto-refetch every 30 seconds to update stats
    refetchIntervalInBackground: false, // Only refetch when tab is active
    staleTime: 30000, // Consider data stale after 30 seconds
    keepPreviousData: true, // Keep showing old data while fetching new data
  });

  // Query for business info
  const businessInfoQuery = useQuery({
    queryKey: ['leads-business-info', userId],
    queryFn: async () => {
      const result = await LeadsService.getLeadsBusinessByFilters({
        skip: 0,
        limit: 10,
        user_id: userId,
      });

      return result.responseData;
    },
  });

  // Query to check if a lead form exists for the current lead type
  const existingLeadFormQuery = useQuery({
    queryKey: ['lead-form-exists', userId, leadType],
    queryFn: async () => {
      if (!leadType || !userId) return null;
      const formType = LeadHelper.getFormTypeFromLeadType(leadType);
      const result = await LeadFormService.getByFilters({ user_id: userId, form_type: formType });
      return result.responseData?.[0] || null;
    },
    enabled: !!userId && !!leadType,
  });

  // Mutation to update lead status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ lead_id, status }: { lead_id: string; status: string }) => {
      const result = await LeadsService.updateStatus({ lead_id, status });
      if (result.status) {
        queryClient.invalidateQueries({ queryKey: ['leads-data'] });
      } else {
        triggerToast('error', result.responseMessage, 'top-right');
      }
      return result.responseData;
    },
  });

  // Mutation to generate/update lead
  const leadGenerationMutation = useMutation({
    mutationFn: async ({ data, onSuccessFunction }: { data: LeadBusinessInfoDto; onSuccessFunction: () => void }) => {
      const commonData: LeadBusinessInfoDto = {
        user_id: userId,
        business_name: data.business_name,
        business_summary: data.business_summary,
        business_website: data.business_website,
        competitors: data.competitors ?? [],
        keywords: data.keywords ?? [],
        created_date: data.created_date,
        lead_business_info_id: data.lead_business_info_id,
        last_updated: data.last_updated,
      };

      const response = !data.lead_business_info_id ? await LeadsService.createLeadBusiness(commonData) : await LeadsService.updateLeadBusiness(commonData);

      if (response.status) {
        queryClient.invalidateQueries({ queryKey: ['leads-business-info'] });
        queryClient.invalidateQueries({ queryKey: ['leads-data'] });
        queryClient.invalidateQueries({ queryKey: ['lead-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
        onSuccessFunction();
      } else {
        triggerToast('error', response.responseMessage ?? `Failed to ${data.lead_business_info_id ? 'update' : 'create'} leads`, 'top-right');
      }
    },
  });

  // Mutation to generate lead report
  const generateLeadReportMutation = useMutation({
    mutationFn: async (data: ExportLeadDto) => {
      const response = await LeadsService.exportLeadReport(data);
      if (response.status) {
        return response.responseData;
      } else {
        throw new Error(response.responseMessage ?? 'Failed to generate report');
      }
    },
  });

  // Helper function to create infinite queries by status
  const useCreateLeadsByStatusQuery = () =>
    useInfiniteQuery({
      queryKey: ['leads-kanban-data', userId],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await LeadsService.getByFilters({
          ...(leadType && { lead_type: leadType }),
          skip: (pageParam - 1) * pageSize,
          limit: pageSize,
          assigned_to: userId,
        });
        return result.responseData;
      },
      getNextPageParam: (lastPage) => {
        const currentPage = Math.ceil((lastPage?.page ?? 0) / pageSize);
        const totalPages = Math.ceil((lastPage?.total ?? 0) / pageSize);
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      enabled: activeTab === 'leads',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
      keepPreviousData: true,
    });

  const enrichLeadMutation = useMutation({
    mutationFn: async (data: EnrichLeadsDto) => {
      const response = await LeadsService.enrich(data);
      return response.responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads-data'] });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
    },
  });

  // Status-specific queries
  const statusQueries = {
    new: useCreateLeadsByStatusQuery(),
  };

  return {
    leadsQuery,
    leadAnalyticsQuery,
    businessInfoQuery,
    existingLeadFormQuery,
    updateStatusMutation,
    leadGenerationMutation,
    statusQueries,
    generateLeadReportMutation,
    enrichLeadMutation,
  };
};
