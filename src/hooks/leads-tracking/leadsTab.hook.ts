import { LeadsService } from '@/api/LeadsService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { useLeadTrackingStore } from '@/store/leads-tracking/useLeadTrackingStore';
import { useMutation } from '@tanstack/react-query';

type LeadFollowupMessageType = {
  prompt: string;
  lead_id: string;
};

export const useLeadTabHook = () => {
  const setLeadsData = useLeadTrackingStore((state) => state.setLeadsData);

  const regenerateLeadFollowUpMessage = useMutation({
    mutationFn: async (data: LeadFollowupMessageType) => {
      const response = await LeadsService.regenerateLeadFollowUpMessage(data.lead_id, data.prompt);

      if (response.status) {
        queryClient.invalidateQueries(['leads-data']);
      } else {
        triggerToast('error', response.responseMessage ?? 'Error generating follow up message');
      }
      return response.responseData;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['leads-data'], (oldData: any) => {
        const updatedData = oldData?.pages.map((page: any) => {
          const updatedPage = page.data.map((lead: any) => {
            if (lead.lead_id === response?.lead_id) {
              return {
                ...lead,
                follow_up_message: response?.follow_up_message,
              };
            }
            return lead;
          });
          return {
            ...page,
            data: updatedPage,
          };
        });
        return {
          ...oldData,
          pages: updatedData,
        };
      });
    },
  });

  const deleteManyLeadsMutation = useMutation({
    mutationFn: async (lead_ids: string[]) => {
      const response = await LeadsService.deleteManyLeads(lead_ids);
      if (response.status) {
        queryClient.invalidateQueries(['leads-data']);
      } else {
        triggerToast('error', response.responseMessage ?? 'Error deleting leads');
      }
      return response.responseData;
    },
  });

  const starMutation = useMutation({
    mutationFn: async ({ lead_id, star }: { lead_id: string; star: boolean }) => {
      const response = star ? await LeadsService.starLead(lead_id) : await LeadsService.unStarLead(lead_id);

      if (!response.status) {
        triggerToast('error', response.responseMessage ?? 'Failed to star lead', 'top-right');
      }

      return response.responseData;
    },
    onMutate: async ({ lead_id, star }) => {
      await queryClient.cancelQueries({ queryKey: ['leads-data'] });

      // Get all query keys
      const queryCache = queryClient.getQueryCache().getAll();

      // Find the exact leads-data key
      const matchingKey = queryCache.find((key) => Array.isArray(key.queryKey) && key.queryKey[0] === 'leads-data');

      if (!matchingKey) {
        console.warn('No matching query key found for leads-data!');
        return;
      }

      // Update cache
      queryClient.setQueryData(matchingKey.queryKey, (oldData: any) => {
        const leads = [...(oldData.data ?? [])];
        const leadIndex = leads.findIndex((lead: LeadDto) => lead.lead_id === lead_id);

        if (leadIndex !== -1) {
          leads[leadIndex] = { ...leads[leadIndex], starred: star };
        }

        setLeadsData(leads);

        return { ...oldData, data: leads };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads-data'] });
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ lead_id, lead_status }: { lead_id: string; lead_status: string }) => {
      const response = await LeadsService.updateStatus({
        lead_id,
        status: lead_status,
      });
      if (!response.status) {
        triggerToast('error', response.responseMessage ?? 'Failed to update lead status');
      }
      return response.responseData;
    },
    onSuccess: (updatedLead) => {
      queryClient.setQueryData(['leads-data'], (oldData: any) => {
        if (!oldData?.pages) return oldData;

        const updatedPages = oldData.pages.map((page: any) => {
          const updatedLeads = page.data.map((lead: LeadDto) => (lead.lead_id === updatedLead?.lead_id ? { ...lead, lead_status: updatedLead?.lead_status } : lead));

          return {
            ...page,
            data: updatedLeads,
          };
        });
        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    },
  });

  return {
    regenerateLeadFollowUpMessage,
    deleteManyLeadsMutation,
    starMutation,
    updateLeadStatus,
  };
};
