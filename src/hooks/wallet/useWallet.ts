import { WalletService } from '@/api/WalletService';
import { FundWalletRequestDto } from '@/models/dtos/WalletDto';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useWallet = () => {
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const userId = userDetails?.userId ?? '';

  const {
    data: walletData,
    isLoading: isLoadingWallet,
    isError: isWalletError,
  } = useQuery(['wallet', userId], () => WalletService.getWallet(userId), {
    enabled: !!userId,
    retry: false,
    select: (res) => res.responseData,
  });

  const verifyFundingMutation = useMutation((reference: string) => WalletService.verifyFunding(reference), {
    onSuccess: () => {
      toast.success('Wallet funded successfully');
      queryClient.invalidateQueries(['wallet', userId]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to verify funding');
    },
  });

  const initiateFundingMutation = useMutation((data: FundWalletRequestDto) => WalletService.initiateFunding(data), {
    onSuccess: (response) => {
      if (response.responseData?.access_code && response.responseData?.reference) {
        handlePaystackPayment(response.responseData.access_code, response.responseData.reference);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to initiate funding');
    },
  });

  const handlePaystackPayment = (accessCode: string, reference: string) => {
    // @ts-ignore
    const PaystackPop = require('@paystack/inline-js').default;
    const popup = new PaystackPop();

    popup.resumeTransaction(accessCode, {
      onSuccess: () => {
        verifyFundingMutation.mutate(reference);
      },
      onClose: () => {
        toast('Payment window closed');
      },
      onCancel: () => {
        toast('Payment cancelled');
      },
      onError: () => {
        toast.error('Payment failed');
      },
    });
  };

  const fundWallet = async (data: FundWalletRequestDto) => {
    if (!userId) {
      toast.error('Please sign in to fund your wallet');
      return;
    }

    const email = userDetails?.email ?? '';
    if (!email) {
      toast.error('Missing account email');
      return;
    }

    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/wallet` : undefined;

    await initiateFundingMutation.mutateAsync({
      ...data,
      userId,
      email,
      callbackUrl,
    });
  };

  return {
    balance: walletData?.balance || 0,
    currency: walletData?.currency || 'NGN',
    transactions: walletData?.transactions || [],
    isLoadingWallet,
    isWalletError,
    fundWallet,
    isFunding: initiateFundingMutation.isLoading || verifyFundingMutation.isLoading,
  };
};
