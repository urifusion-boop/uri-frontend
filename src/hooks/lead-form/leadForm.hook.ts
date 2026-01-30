import { LeadsService as LeadFormService } from '@/api/LeadFormService';
import { triggerToast } from '@/components/atoms/CustomToast';
import {
  AutoPopulateDto,
  BusinessSearchFormDto,
  ConversationalSearchFormDto,
  IndividualLeadFormDto,
  LeadFormDto,
  LeadFormGetByFiltersDto,
  LeadFormResponseDto,
  LeadFormUpdateDto,
  OrganizationLeadFormDto,
} from '@/models/dtos/LeadFormDto';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLeadFormHooks = () => {
  const queryClient = useQueryClient();

  const createIndividualLeadForm = useMutation({
    mutationFn: async (data: IndividualLeadFormDto): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.createPersonSearchLeadForm(data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to create individual lead form');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
    },
  });

  const updateIndividualLeadForm = useMutation({
    mutationFn: async ({ lead_form_id, data }: { lead_form_id: string; data: IndividualLeadFormDto }): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.updatePersonSearchLeadForm(lead_form_id, data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to update individual lead form');
      }
      return res;
    },
  });

  const createOrganizationLeadForm = useMutation({
    mutationFn: async (data: OrganizationLeadFormDto): Promise<UriResponse<any>> => {
      const res = await LeadFormService.createOrganizationSearchLeadForm(data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to create organization lead form');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
    },
  });

  const updateOrganizationSearchLeadForm = useMutation({
    mutationFn: async ({ lead_form_id, data }: { lead_form_id: string; data: OrganizationLeadFormDto }): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.updateOrganizationSearchLeadForm(lead_form_id, data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to update organization lead form');
      }
      return res;
    },
  });

  const createBusinessSearchLeadForm = useMutation({
    mutationFn: async (data: BusinessSearchFormDto): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.createBusinessSearchLeadForm(data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to create business search lead form');
      }
      return res;
    },
  });

  const updateBusinessSearchLeadForm = useMutation({
    mutationFn: async ({ lead_form_id, data }: { lead_form_id: string; data: BusinessSearchFormDto }): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.updateBusinessSearchLeadForm(lead_form_id, data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to update business search lead form');
      }
      return res;
    },
  });

  const createConversationalSearchLeadForm = useMutation({
    mutationFn: async (data: ConversationalSearchFormDto): Promise<UriResponse<any>> => {
      const res = await LeadFormService.createConversationalSearchLeadForm(data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to create Sales Signals lead form');
      }
      return res;
    },
  });

  const updateConversationalSearchLeadForm = useMutation({
    mutationFn: async ({ lead_form_id, data }: { lead_form_id: string; data: ConversationalSearchFormDto }): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.updateConversationalSearchLeadForm(lead_form_id, data);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to update Sales Signals lead form');
      }
      return res;
    },
  });

  const autoPopulateLeadForm = useMutation({
    mutationFn: async (data: AutoPopulateDto): Promise<UriResponse<LeadFormDto>> => {
      const res = await LeadFormService.autoPopulate(data);
      return res;
    },
  });

  const updateLeadForm = useMutation({
    mutationFn: async ({ lead_form_id, data }: { lead_form_id: string; data: LeadFormUpdateDto }): Promise<UriResponse<LeadFormResponseDto>> => {
      const res = await LeadFormService.updateLeadForm(lead_form_id, data);
      if (!res.status) {
        triggerToast('error', res.responseMessage || 'Failed to update lead form');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
    },
  });

  const useGetLeadFormsByFilters = (filters: LeadFormGetByFiltersDto) => {
    return useQuery({
      queryKey: ['lead-forms', filters],
      queryFn: async () => {
        const res = await LeadFormService.getByFilters(filters);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch lead forms');
        }
        return res.responseData || [];
      },
    });
  };

  const useGetExistingFormType = (user_id: string, form_type: FormTypeEnum) => {
    return useQuery({
      queryKey: ['lead-form-type', user_id, form_type],
      queryFn: async () => {
        const res = await LeadFormService.getByFilters({ user_id, form_type });
        return res.responseData?.[0] || null;
      },
    });
  };

  const useGetLeadFormsByUserId = (user_id: string): UseQueryResult<LeadFormDto[], Error> => {
    return useQuery({
      queryKey: ['user-lead-forms', user_id],
      queryFn: async () => {
        const res = await LeadFormService.getByUserId(user_id);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch lead forms');
        }
        return res.responseData || [];
      },
      enabled: !!user_id,
    });
  };

  const useGetLeadFormById = (lead_form_id: string) => {
    return useQuery({
      queryKey: ['lead-form', lead_form_id],
      queryFn: async () => {
        const res = await LeadFormService.getById(lead_form_id);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch lead form');
        }
        return res.responseData;
      },
      enabled: !!lead_form_id,
    });
  };

  const deleteLeadForm = useMutation({
    mutationFn: async (lead_form_id: string): Promise<UriResponse<LeadFormDto>> => {
      const res = await LeadFormService.deleteLeadForm(lead_form_id);
      if (!res.status) {
        triggerToast('error', res.responseMessage || 'Failed to delete lead form');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
    },
  });

  // Multi-form hooks
  const useGetFormsByUserAndType = (userId: string, formType: string) => {
    return useQuery({
      queryKey: ['lead-forms-by-type', userId, formType],
      queryFn: async () => {
        const res = await LeadFormService.getFormsByUserAndType(userId, formType);
        if (!res.status) {
          triggerToast('error', res.responseMessage || 'Failed to fetch forms');
        }
        return res.responseData || [];
      },
      enabled: !!userId && !!formType,
    });
  };

  const setDefaultForm = useMutation({
    mutationFn: async ({ userId, formType, formId }: { userId: string; formType: string; formId: string }) => {
      const res = await LeadFormService.setDefaultForm(userId, formType, formId);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to set default form');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
      queryClient.invalidateQueries({ queryKey: ['lead-forms-by-type'] });
      triggerToast('success', 'Default form updated successfully');
    },
  });

  const togglePause = useMutation({
    mutationFn: async ({ formId, disabled }: { formId: string; disabled: boolean }) => {
      const res = await LeadFormService.togglePause(formId, disabled);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to toggle pause');
      }
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
      queryClient.invalidateQueries({ queryKey: ['lead-forms-by-type'] });
      triggerToast('success', variables.disabled ? 'Form paused' : 'Form resumed');
    },
  });

  const toggleAutoGenerate = useMutation({
    mutationFn: async ({ formId, autoGenerate }: { formId: string; autoGenerate: boolean }) => {
      const res = await LeadFormService.toggleAutoGenerate(formId, autoGenerate);
      if (!res.status) {
        throw new Error(res.responseMessage || 'Failed to toggle auto-generate');
      }
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
      queryClient.invalidateQueries({ queryKey: ['lead-forms-by-type'] });
      triggerToast('success', variables.autoGenerate ? 'Auto-generate enabled' : 'Auto-generate disabled');
    },
  });

  return {
    createIndividualLeadForm,
    createOrganizationLeadForm,
    updateLeadForm,
    updateOrganizationSearchLeadForm,
    updateIndividualLeadForm,
    createBusinessSearchLeadForm,
    updateBusinessSearchLeadForm,
    createConversationalSearchLeadForm,
    updateConversationalSearchLeadForm,
    useGetLeadFormsByFilters,
    useGetLeadFormById,
    useGetExistingFormType,
    useGetLeadFormsByUserId,
    deleteLeadForm,
    autoPopulateLeadForm,
    isAutoPopulating: autoPopulateLeadForm.isLoading,
    // Multi-form exports
    useGetFormsByUserAndType,
    setDefaultForm,
    togglePause,
    toggleAutoGenerate,
  };
};
