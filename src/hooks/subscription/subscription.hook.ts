import { AuthService } from '@/api/AuthService';
import { DiscountService } from '@/api/DiscountService';
import { SubscriptionService } from '@/api/SubscriptionService';
import { UserService } from '@/api/UserService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { TextHelper } from '@/helpers/TextHelper';
import { SubscriptionDto, TrialSubscriptionDto } from '@/models/dtos/SubscriptionDto';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';

export const useSubscription = () => {
  const { userDetails, saveUserDetails, tokenDetails, saveUserTokens } = useAuth();

  const initializeSubscription = useMutation({
    mutationFn: async (data: Partial<SubscriptionDto>) => {
      if (!userDetails?.email || !data.amount || !data.plan) return;

      const response = await SubscriptionService.chargeSubscription(
        {
          email: userDetails.email,
          currency: 'NGN',
          amount: data.amount,
          plan: data.plan,
          reference: TextHelper.generateReferenceForUser(userDetails.userId ?? ''),
          channels: ['card'],
        },
        userDetails.paystackId
      );

      if (!response.status) {
        throw Object.assign(new Error(response.responseMessage), {
          code: response.responseCode,
        });
      }

      return response.responseData;
    },
  });

  const trialSubscription = useMutation({
    mutationFn: async (data: TrialSubscriptionDto) => {
      if (!userDetails?.email || !data.email) return;

      const response = await SubscriptionService.trialSubscription({
        user_id: userDetails.userId ?? '',
        email: userDetails.email,
      });

      if (!response.status) {
        throw Object.assign(new Error(response.responseMessage), {
          code: response.responseCode,
        });
      }
    },
  });

  const applyDiscount = useMutation({
    mutationFn: async (data: { discountCode: string }) => {
      const response = await DiscountService.getDiscountByCodeApi(data.discountCode);
      return response.responseData;
    },
  });

  const getUserDetails = useMutation({
    mutationFn: async () => {
      const userId = userDetails?.userId;
      if (!userId || !tokenDetails?.refreshToken) return;

      const refreshTokenResponse = await AuthService.refreshTokenApi({
        userId,
        oldRefreshToken: tokenDetails?.refreshToken,
      });

      if (!refreshTokenResponse.status) {
        triggerToast('error', refreshTokenResponse.responseMessage ?? 'Something went wrong');
        return;
      }

      saveUserTokens({
        accessToken: refreshTokenResponse?.responseData?.token ?? '',
        refreshToken: refreshTokenResponse?.responseData?.refreshToken ?? '',
      });

      const response = await UserService.getByUserIdApi(userId);

      if (!response.status) {
        triggerToast('error', response.responseMessage ?? 'Something went wrong');
        return;
      }

      if (response.responseData) {
        saveUserDetails(response.responseData);
        return response.responseData;
      }
    },
  });

  const freeSubscription = useMutation({
    mutationFn: async (planCode: string) => {
      if (!userDetails?.email) return;

      const response = await SubscriptionService.freeSubscription({
        email: userDetails.email,
        plan: planCode,
      });

      if (!response.status) {
        throw Object.assign(new Error(response.responseMessage), {
          code: response.responseCode,
        });
      }

      return response.responseData;
    },
    onSuccess: async () => {
      await getUserDetails.mutateAsync();
    },
  });

  return {
    initializeSubscription,
    trialSubscription,
    getUserDetails,
    applyDiscount,
    freeSubscription,
  };
};
