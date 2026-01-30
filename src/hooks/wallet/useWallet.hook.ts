import { WalletService } from '@/api/WalletService';
import { useToast } from '@/hooks/use-toast';
import { FundWalletRequestDto } from '@/models/dtos/WalletDto';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useWallet = () => {
  const { userDetails } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet', userDetails?.userId],
    queryFn: async () => {
      if (!userDetails?.userId) return null;
      const response = await WalletService.getWallet(userDetails.userId);
      if (response.status) {
        return response.responseData;
      }
      return null;
    },
    enabled: !!userDetails?.userId,
    retry: false,
  });

  const { mutateAsync: fundWallet, isPending: isFundingWallet } = useMutation({
    mutationFn: async (data: FundWalletRequestDto) => {
      const response = await WalletService.initiateFunding(data);
      return response;
    },
    onSuccess: (data) => {
      if (data.status) {
        // Paystack returns an authorization URL in the data
        const authorizationUrl = data.responseData?.authorization_url;
        if (authorizationUrl) {
          window.open(authorizationUrl, '_blank');
        } else {
          toast({
            title: 'Error',
            description: 'Could not initialize payment',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: data.responseMessage || 'Failed to initiate funding',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to initiate funding',
        variant: 'destructive',
      });
    },
  });

  const { mutateAsync: verifyFunding, isPending: isVerifyingFunding } = useMutation({
    mutationFn: async (reference: string) => {
      const response = await WalletService.verifyFunding(reference);
      return response;
    },
    onSuccess: (data) => {
      if (data.status) {
        toast({
          title: 'Success',
          description: 'Wallet funded successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['wallet', userDetails?.userId] });
      } else {
        toast({
          title: 'Error',
          description: data.responseMessage || 'Failed to verify funding',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to verify funding',
        variant: 'destructive',
      });
    },
  });

  return {
    wallet,
    isLoadingWallet,
    fundWallet,
    isFundingWallet,
    verifyFunding,
    isVerifyingFunding,
  };
};
