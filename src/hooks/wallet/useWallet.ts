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
      // Squad returns authorization_url (checkout_url)
      const authorizationUrl = response.responseData?.authorization_url;
      if (authorizationUrl) {
        window.open(authorizationUrl, '_blank');
      } else {
        toast.error('Could not get payment URL');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to initiate funding');
    },
  });

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

    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/wallet/verify` : undefined;

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
