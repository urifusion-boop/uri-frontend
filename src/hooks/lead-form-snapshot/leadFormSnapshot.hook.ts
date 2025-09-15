import { LeadsService as LeadFormService } from '@/api/LeadFormService';
import { LeadFormSnapshotService } from '@/api/LeadFormSnapshotService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { LeadFormSnapshotDto, LeadFormSnapshotGetByFiltersDto } from '@/models/dtos/LeadFormSnapshotDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLeadFormSnapshotHook = () => {
  const queryClient = useQueryClient();

  //make it returbn type UriResponse<FormSnapshotResponseDto>
  const useGetLeadFormSnapshotsByFilters = (filters: LeadFormSnapshotGetByFiltersDto) => {
    return useQuery({
      queryKey: ['lead-form-snapshots', filters],
      queryFn: async () => {
        const res = await LeadFormSnapshotService.getByFilters(filters);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch lead form snapshots');
        }
        return res.responseData || [];
      },
      enabled: !!filters.user_id,
    });
  };

  const useGetLatestLeadFormSnapshot = (filters: LeadFormSnapshotGetByFiltersDto) => {
    return useQuery({
      queryKey: ['latest-lead-form-snapshot', filters],
      queryFn: async () => {
        const res = await LeadFormSnapshotService.getLatestSnapshot(filters);
      },
    });
  };

  const useGetLeadFormSnapshotsByUserId = (user_id: string): UseQueryResult<LeadFormSnapshotDto[], Error> => {
    return useQuery({
      queryKey: ['user-lead-form-snapshots', user_id],
      queryFn: async () => {
        const res = await LeadFormService.getByUserId(user_id);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch lead form snapshots');
        }
        return res.responseData || [];
      },
      enabled: !!user_id,
    });
  };

  const useGetLeadFormSnapshotById = (lead_form_snapshot_id: string) => {
    return useQuery({
      queryKey: ['lead-form-snapshot', lead_form_snapshot_id],
      queryFn: async () => {
        const res = await LeadFormSnapshotService.getById(lead_form_snapshot_id);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch lead form snapshot');
        }
        return res.responseData;
      },
      enabled: !!lead_form_snapshot_id,
    });
  };

  const useGetLeadFormSnapshotByLeadFormId = (lead_form_id: string) => {
    return useQuery({
      queryKey: ['lead-form-snapshot', lead_form_id],
      queryFn: async () => {
        const res = await LeadFormSnapshotService.getByLeadFormId(lead_form_id);
      },
    });
  };

  const deleteLeadFormSnapshot = useMutation({
    mutationFn: async (lead_form_snapshot_id: string): Promise<UriResponse<LeadFormSnapshotDto>> => {
      const res = await LeadFormSnapshotService.deleteLeadFormSnapshot(lead_form_snapshot_id);
      if (!res.status) {
        triggerToast('error', res.responseMessage || 'Failed to delete lead form snapshot');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-form-snapshots'] });
    },
  });

  return {
    useGetLeadFormSnapshotsByFilters,
    useGetLeadFormSnapshotsByUserId,
    useGetLeadFormSnapshotById,
    useGetLatestLeadFormSnapshot,
    useGetLeadFormSnapshotByLeadFormId,
    deleteLeadFormSnapshot,
    isDeleting: deleteLeadFormSnapshot.isLoading,
  };
};
