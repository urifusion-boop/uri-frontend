/**
 * useSpamLeads - Custom hook for Spam/Unqualified Leads
 * PRD Feature 1: Spam Visibility & Lead Reclassification
 *
 * NEW FILE - Does not modify any existing hooks
 */

import { SpamLeadService } from '@/api/SpamLeadService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { GetSpamLeadsParams, SpamLeadsResponse, SpamStatsResponse } from '@/models/dtos/SpamLeadDto';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Hook for fetching and managing spam leads
 */
export const useSpamLeads = (userId: string, initialParams?: Partial<GetSpamLeadsParams>) => {
  const [params, setParams] = useState<GetSpamLeadsParams>({
    user_id: userId,
    page: 1,
    page_size: 50,
    ...initialParams,
  });

  // Fetch spam leads
  const {
    data: spamData,
    isLoading,
    error,
    refetch,
  } = useQuery<SpamLeadsResponse>({
    queryKey: ['spam-leads', params],
    queryFn: async () => {
      console.log('🔍 [useSpamLeads] Fetching spam leads with params:', params);
      const result = await SpamLeadService.getSpamLeads(params);
      console.log('✅ [useSpamLeads] Spam leads response:', result);
      console.log('📊 [useSpamLeads] Response data structure:', {
        status: result.status,
        responseCode: result.responseCode,
        responseMessage: result.responseMessage,
        hasResponseData: !!result.responseData,
        responseDataKeys: result.responseData ? Object.keys(result.responseData) : [],
        dataArray: result.responseData?.data,
        dataLength: result.responseData?.data?.length,
        total: result.responseData?.total,
      });
      return result;
    },
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });

  // Fetch spam stats
  const { data: statsData, refetch: refetchStats } = useQuery<SpamStatsResponse>({
    queryKey: ['spam-stats', userId, params.lead_form_snapshot_id],
    queryFn: async () => {
      console.log('📈 [useSpamLeads] Fetching spam stats for user:', userId, 'snapshot:', params.lead_form_snapshot_id);
      const result = await SpamLeadService.getSpamStats(userId, params.lead_form_snapshot_id);
      console.log('✅ [useSpamLeads] Spam stats response:', result);
      return result;
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });

  // Promote spam to lead mutation
  const promoteMutation = useMutation({
    mutationFn: (spamId: string) => SpamLeadService.promoteSpamToLead(spamId),
    onSuccess: (response) => {
      if (response.status) {
        triggerToast('success', 'Lead promoted successfully!');
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['spam-leads'] });
        queryClient.invalidateQueries({ queryKey: ['spam-stats'] });
        queryClient.invalidateQueries({ queryKey: ['leads-data'] }); // Refresh qualified leads
      } else {
        triggerToast('error', response.responseMessage || 'Failed to promote lead');
      }
    },
    onError: (error: any) => {
      triggerToast('error', error?.message || 'Error promoting lead');
    },
  });

  // Move lead to spam mutation (reverse action)
  const moveToSpamMutation = useMutation({
    mutationFn: ({ leadId, reason, detail }: { leadId: string; reason: string; detail?: string }) => SpamLeadService.moveLeadToSpam(leadId, reason, detail),
    onSuccess: (response) => {
      if (response.status) {
        triggerToast('success', 'Lead moved to unqualified');
        queryClient.invalidateQueries({ queryKey: ['spam-leads'] });
        queryClient.invalidateQueries({ queryKey: ['spam-stats'] });
        queryClient.invalidateQueries({ queryKey: ['leads-data'] });
      } else {
        triggerToast('error', response.responseMessage || 'Failed to move lead');
      }
    },
    onError: (error: any) => {
      triggerToast('error', error?.message || 'Error moving lead');
    },
  });

  // Update spam notes mutation
  const updateNotesMutation = useMutation({
    mutationFn: ({ spamId, notes }: { spamId: string; notes: string }) => SpamLeadService.updateSpamNotes(spamId, notes),
    onSuccess: (response) => {
      if (response.status) {
        triggerToast('success', 'Notes updated');
        queryClient.invalidateQueries({ queryKey: ['spam-leads'] });
      } else {
        triggerToast('error', response.responseMessage || 'Failed to update notes');
      }
    },
  });

  // Helper functions
  const updateParams = (newParams: Partial<GetSpamLeadsParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const setPage = (page: number) => {
    updateParams({ page });
  };

  const setPageSize = (pageSize: number) => {
    updateParams({ page_size: pageSize, page: 1 }); // Reset to page 1 when changing page size
  };

  const setFilterStage = (filterStage: string | undefined) => {
    updateParams({ filter_stage: filterStage, page: 1 });
  };

  const setLeadFormSnapshot = (snapshotId: string | undefined) => {
    updateParams({ lead_form_snapshot_id: snapshotId, page: 1 });
  };

  const promoteToLead = (spamId: string) => {
    promoteMutation.mutate(spamId);
  };

  const moveLeadToSpam = (leadId: string, reason: string, detail?: string) => {
    moveToSpamMutation.mutate({ leadId, reason, detail });
  };

  const updateNotes = (spamId: string, notes: string) => {
    updateNotesMutation.mutate({ spamId, notes });
  };

  const extractedSpamLeads = spamData?.responseData?.data || [];
  const extractedTotal = spamData?.responseData?.total || 0;
  const extractedStats = statsData?.responseData;

  console.log('🎯 [useSpamLeads] Returning data:', {
    spamLeadsCount: extractedSpamLeads.length,
    total: extractedTotal,
    stats: extractedStats,
    firstSpamLead: extractedSpamLeads[0],
  });

  return {
    // Data
    spamLeads: extractedSpamLeads,
    total: extractedTotal,
    page: params.page || 1,
    pageSize: params.page_size || 50,
    stats: extractedStats,

    // Loading states
    isLoading,
    isPromoting: promoteMutation.isPending,
    isMovingToSpam: moveToSpamMutation.isPending,
    isUpdatingNotes: updateNotesMutation.isPending,

    // Error
    error,

    // Actions
    promoteToLead,
    moveLeadToSpam,
    updateNotes,
    refetch,
    refetchStats,

    // Param updaters
    setPage,
    setPageSize,
    setFilterStage,
    setLeadFormSnapshot,
    updateParams,
  };
};

/**
 * Helper hook to get spam reason color (for chips/badges)
 */
export const useSpamReasonColor = () => {
  const getReasonColor = (reason: string): string => {
    // Job Board reasons (blue/info)
    if (reason.includes('problem') || reason.includes('commercial')) {
      return '#2196F3';
    }

    // Intent/relevance reasons (orange/warning)
    if (reason.includes('intent') || reason.includes('relevance')) {
      return '#FF9800';
    }

    // Missing data (gray)
    if (reason.includes('Missing') || reason.includes('confidence')) {
      return '#9E9E9E';
    }

    // Default (red/error)
    return '#FF5252';
  };

  const getReasonIcon = (reason: string): string => {
    if (reason.includes('intent')) return '🎯';
    if (reason.includes('relevance')) return '🔍';
    if (reason.includes('Missing')) return '⚠️';
    if (reason.includes('commercial')) return '💼';
    return '⛔';
  };

  return { getReasonColor, getReasonIcon };
};
