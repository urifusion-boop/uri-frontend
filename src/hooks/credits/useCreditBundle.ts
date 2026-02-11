import { CreditBundleService } from '@/api/CreditBundleService';
import { CreditBundleTierEnum, PurchaseCreditBundleRequestDto } from '@/models/dtos/CreditBundleDto';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const useCreditBundle = () => {
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const userId = userDetails?.userId ?? '';
  const [purchasingTier, setPurchasingTier] = useState<CreditBundleTierEnum | null>(null);

  // Get available bundles
  const {
    data: bundlesData,
    isLoading: isLoadingBundles,
    isError: isBundlesError,
  } = useQuery(['credit-bundles'], () => CreditBundleService.getBundles(), {
    select: (res) => res.responseData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get user's credit balance
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useQuery(['credit-balance', userId], () => CreditBundleService.getCreditBalance(userId), {
    enabled: !!userId,
    select: (res) => res.responseData,
  });

  // Get purchase history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
  } = useQuery(['credit-history', userId], () => CreditBundleService.getPurchaseHistory(userId), {
    enabled: !!userId,
    select: (res) => res.responseData,
  });

  // Verify purchase mutation
  const verifyPurchaseMutation = useMutation((reference: string) => CreditBundleService.verifyPurchase(reference), {
    onSuccess: (response) => {
      setPurchasingTier(null);
      if (response.status) {
        toast.success(`${response.responseData?.credits || 0} credits added to your account!`);
        queryClient.invalidateQueries(['credit-balance', userId]);
        queryClient.invalidateQueries(['credit-history', userId]);
        queryClient.invalidateQueries(['feature-limit']);
      } else {
        toast.error(response.responseMessage || 'Failed to verify purchase');
      }
    },
    onError: (error: any) => {
      setPurchasingTier(null);
      toast.error(error?.response?.data?.responseMessage || 'Failed to verify purchase');
    },
  });

  // Initiate purchase mutation
  const initiatePurchaseMutation = useMutation((data: PurchaseCreditBundleRequestDto) => CreditBundleService.initiatePurchase(data), {
    onSuccess: (response) => {
      if (response.status && response.responseData?.access_code && response.responseData?.reference) {
        handlePaystackPayment(response.responseData.access_code, response.responseData.reference);
      } else {
        setPurchasingTier(null);
        toast.error(response.responseMessage || 'Failed to initiate purchase');
      }
    },
    onError: (error: any) => {
      setPurchasingTier(null);
      toast.error(error?.response?.data?.responseMessage || 'Failed to initiate purchase');
    },
  });

  const handlePaystackPayment = (accessCode: string, reference: string) => {
    // @ts-ignore
    const PaystackPop = require('@paystack/inline-js').default;
    const popup = new PaystackPop();

    popup.resumeTransaction(accessCode, {
      onSuccess: () => {
        verifyPurchaseMutation.mutate(reference);
      },
      onClose: () => {
        setPurchasingTier(null);
        toast('Payment window closed');
      },
      onCancel: () => {
        setPurchasingTier(null);
        toast('Payment cancelled');
      },
      onError: () => {
        setPurchasingTier(null);
        toast.error('Payment failed');
      },
    });
  };

  const purchaseBundle = async (bundleTier?: CreditBundleTierEnum, customAmount?: number, customCredits?: number) => {
    if (!userId) {
      toast.error('Please sign in to purchase credits');
      return;
    }

    const email = userDetails?.email ?? '';
    if (!email) {
      toast.error('Missing account email');
      return;
    }

    if (bundleTier) {
      setPurchasingTier(bundleTier);
    }

    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/wallet` : undefined;

    await initiatePurchaseMutation.mutateAsync({
      userId,
      bundleTier,
      email,
      callbackUrl,
      customAmount,
      customCredits,
    });
  };

  return {
    // Bundles
    bundles: bundlesData || [],
    isLoadingBundles,
    isBundlesError,

    // Balance
    creditsAvailable: balanceData?.creditsAvailable || 0,
    creditsUsed: balanceData?.creditsUsed || 0,
    totalCredits: balanceData?.totalCredits || 0,
    isLoadingBalance,
    isBalanceError,
    refetchBalance,

    // History
    purchaseHistory: historyData?.purchases || [],
    isLoadingHistory,
    isHistoryError,

    // Actions
    purchaseBundle,
    isPurchasing: (tier: CreditBundleTierEnum) => purchasingTier === tier,
  };
};
