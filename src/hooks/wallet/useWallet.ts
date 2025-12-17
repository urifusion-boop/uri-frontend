import { WalletService } from '@/api/WalletService';
import { FundWalletRequestDto } from '@/models/dtos/WalletDto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useWallet = () => {
  const queryClient = useQueryClient();

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery(['wallet-balance'], () => WalletService.getBalance(), {
    select: (res) => res.responseData,
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(['wallet-transactions'], () => WalletService.getTransactions(), {
    select: (res) => res.responseData,
  });

  const verifyFundingMutation = useMutation((reference: string) => WalletService.verifyFunding(reference), {
    onSuccess: () => {
      toast.success('Wallet funded successfully');
      queryClient.invalidateQueries(['wallet-balance']);
      queryClient.invalidateQueries(['wallet-transactions']);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to verify funding');
    },
  });

  const initiateFundingMutation = useMutation((data: FundWalletRequestDto) => WalletService.initiateFunding(data), {
    onSuccess: (response) => {
      if (response.responseData) {
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

  return {
    balance: balanceData?.balance || 0,
    currency: balanceData?.currency || 'NGN',
    transactions: transactionsData?.transactions || [],
    isLoadingBalance,
    isLoadingTransactions,
    fundWallet: initiateFundingMutation.mutateAsync,
    isFunding: initiateFundingMutation.isLoading || verifyFundingMutation.isLoading,
  };
};
