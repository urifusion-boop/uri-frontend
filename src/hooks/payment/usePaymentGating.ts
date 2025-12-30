import { PaymentGatingService } from '@/api/PaymentGatingService';
import { DeductPaymentRequestDto, LeadActionTypeEnum, PaymentModeEnum } from '@/models/dtos/PaymentGatingDto';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export const usePaymentGating = () => {
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const userId = userDetails?.userId ?? '';

  // Get all action costs
  const { data: actionCostsData, isLoading: isLoadingCosts } = useQuery(['action-costs'], () => PaymentGatingService.getAllActionCosts(), {
    select: (res) => res.responseData,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Check balance mutation
  const checkBalanceMutation = useMutation(async (params: { paymentMode: PaymentModeEnum; actionType: LeadActionTypeEnum; quantity?: number }) => {
    if (!userId) throw new Error('User not authenticated');
    return PaymentGatingService.checkBalance({
      userId,
      ...params,
    });
  });

  // Deduct payment mutation
  const deductPaymentMutation = useMutation(
    async (params: Omit<DeductPaymentRequestDto, 'userId' | 'reference'> & { narration?: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const reference = `${params.actionType.toLowerCase()}_${uuidv4()}`;
      return PaymentGatingService.deductPayment({
        userId,
        reference,
        ...params,
      });
    },
    {
      onSuccess: (response) => {
        if (response.status) {
          // Invalidate wallet and credits queries
          queryClient.invalidateQueries(['wallet', userId]);
          queryClient.invalidateQueries(['credit-balance', userId]);
          queryClient.invalidateQueries(['feature-limit']);
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.responseMessage || 'Payment failed');
      },
    }
  );

  const checkBalance = async (paymentMode: PaymentModeEnum, actionType: LeadActionTypeEnum, quantity = 1) => {
    try {
      const result = await checkBalanceMutation.mutateAsync({
        paymentMode,
        actionType,
        quantity,
      });
      return result.responseData;
    } catch (error) {
      return null;
    }
  };

  const deductPayment = async (paymentMode: PaymentModeEnum, actionType: LeadActionTypeEnum, quantity = 1, narration?: string) => {
    try {
      const result = await deductPaymentMutation.mutateAsync({
        paymentMode,
        actionType,
        quantity,
        narration,
      });
      return result.responseData;
    } catch (error) {
      return null;
    }
  };

  const getActionCost = (actionType: LeadActionTypeEnum) => {
    if (!actionCostsData) return { walletCost: 0, creditCost: 0 };
    return actionCostsData[actionType] || { walletCost: 0, creditCost: 0 };
  };

  return {
    // Costs
    actionCosts: actionCostsData,
    isLoadingCosts,
    getActionCost,

    // Actions
    checkBalance,
    deductPayment,
    isCheckingBalance: checkBalanceMutation.isLoading,
    isDeducting: deductPaymentMutation.isLoading,
  };
};
