import { TokenProviderEnum, TokenUsageTypeEnum } from '@/models/enum-models/TokenProviderEnum';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { FacebookService } from '@/api/FacebookService';
import { InfluencerService } from '@/api/InfluencerService';
import { InstagramService } from '@/api/InstagramService';
import { TiktokService } from '@/api/TiktokService';
import { TwitterService } from '@/api/TwitterService';
import { UserService } from '@/api/UserService';
import { XInsightsService } from '@/api/XInsightsService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { STORE_KEYS } from '@/configs/store.config';
import { AppTokenHelper } from '@/helpers/AppTokenHelper';
import { InfluencerDto } from '@/models/dtos/InfluencerDto';
import { ApiScopeEnum } from '@/models/enum-models/ApiScopeEnum';
import { SocialMediaEnum } from '@/models/enum-models/SocialMediaEnum';
import { TokenScopeEnum } from '@/models/enum-models/TokenScopeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

type tiktokInfluencer = {
  influencerId: string;
  influencerName: string;
};

export const useInfluencersTrackingOverview = () => {
  const router = useRouter();
  const { userDetails, saveUserDetails } = useAuth();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [hasConnectedFacebook, setHasConnectedFacebook] = useState(false);
  const [hasConnectedTiktok, setHasConnectedTiktok] = useState(false);
  const [hasConnectedTwitter, setHasConnectedTwitter] = useState(false);
  
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const code = router?.query?.code as string;
  const platform = getLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME);

  // Facebook Authentication
  const { mutate: getFacebookUrl, isLoading: gettingFacebookUrl } = useMutation({
    mutationFn: async () => {
      const response = await FacebookService.getAuthUrl(process.env.NEXT_PUBLIC_INFLUENCER_TRACKING_REDIRECT_URL ?? '');

      setLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME, 'facebook');

      if (response.status) {
        router.push(response.responseData?.url ?? '');
      } else {
        toast.error(response.responseMessage);
      }
    },
  });

  // Tiktok Authentication
  const { mutate: getTiktokUrl, isLoading: gettingTiktokUrl } = useMutation({
    mutationFn: async ({ influencerId, influencerName }: tiktokInfluencer) => {
      const response = await TiktokService.getAuthUrl();
      if (response.status) {
        setLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID, influencerId);
        setLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME, influencerName);
        setLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME, 'tiktok');

        router.push(response.responseData ?? '');
      } else {
        toast.error(response.responseMessage);
      }
    },
  });

  // Twitter Authentication
  const { mutate: getTwitterUrl, isLoading: gettingTwitterUrl } = useMutation({
    mutationFn: async () => {
      const response = await TwitterService.getAuthUrl();
      setLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME, 'twitter');

      if (response.status) {
        router.push(response.responseData ?? '');
      } else {
        toast.error(response.responseMessage);
      }
    },
  });

  

  // Query to connect the facebook account
  const { isLoading: facebookConnecting } = useQuery({
    queryKey: ['connect-facebook', accessToken],
    queryFn: async () => {
      if (hasConnectedFacebook) {
        return null;
      }

      if (platform !== 'facebook') {
        return null;
      }

      if (!accessToken) {
        return null;
      }

      setHasConnectedFacebook(true);

      const response = await FacebookService.connectFacebook(userDetails?.userId ?? '', accessToken ?? '');

      if (!response.status) {
        triggerToast('error', response.responseMessage);
        return;
      }

      const updateAppTokenResponse = await UserService.updateUserAppTokenApi({
        userId: userDetails?.userId,
        appToken: {
          provider: TokenProviderEnum.FACEBOOK,
          isEnabled: true,
          tokenUsage: TokenUsageTypeEnum.FACEBOOK_ACCESS_TOKEN,
          userId: userDetails?.userId,
        },
      });

      if (!updateAppTokenResponse.status) {
        triggerToast('error', updateAppTokenResponse.responseMessage);
        return;
      }

      saveUserDetails(updateAppTokenResponse.responseData!);

      const facebookAccessToken = AppTokenHelper.getProviderByTokenUsage(updateAppTokenResponse.responseData?.appTokens ?? [], TokenUsageTypeEnum.FACEBOOK_ACCESS_TOKEN);

      const influencerAccountCreationResponse = await InstagramService.saveInstagramFacebookInfluencerAccount(userDetails?.userId ?? '', facebookAccessToken?.token ?? '');

      if (!influencerAccountCreationResponse.status) {
        triggerToast('error', influencerAccountCreationResponse.responseMessage);
        router.push('/account-tracking');
      }

      triggerToast('success', 'Facebook account connected successfully');
      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

      router.push('/account-tracking');
    },
  });

  // Query to connect the tiktok account
  const { isLoading: tiktokConnecting } = useQuery({
    queryKey: ['connect-tiktok', code],
    queryFn: async () => {
      if (hasConnectedTiktok) {
        return null;
      }

      if (platform !== 'tiktok') {
        return null;
      }

      if (!code) {
        return null;
      }

      setHasConnectedTiktok(true);

      const influencerId = getLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID);
      const influencerName = getLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME);

      // Call the connect function to connect the account first
      const response = await TiktokService.connectTiktok(userDetails?.userId ?? '', code ?? '');

      if (!response.status) {
        triggerToast('error', response.responseMessage);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME);
        router.push('/account-tracking');
        return;
      }

      // Update the app token with the new token
      const updateAppTokenResponse = await UserService.updateUserAppTokenApi({
        userId: userDetails?.userId,
        appToken: {
          provider: TokenProviderEnum.TIKTOK,
          isEnabled: true,
          tokenUsage: TokenUsageTypeEnum.TIKTOK_ACCESS_TOKEN,
          userId: userDetails?.userId,
        },
      });

      if (!updateAppTokenResponse.status) {
        triggerToast('error', updateAppTokenResponse.responseMessage);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME);
        router.push('/account-tracking');
        return;
      }

      saveUserDetails(updateAppTokenResponse.responseData!);

      const tiktokAccessToken = AppTokenHelper.getProviderByTokenUsage(updateAppTokenResponse?.responseData?.appTokens ?? [], TokenUsageTypeEnum.TIKTOK_ACCESS_TOKEN);

      // Get the tiktok user
      const getTiktokUserResponse = await TiktokService.saveTiktokAccount(
        {
          user_id: userDetails?.userId ?? '',
          username: influencerName?.toString() ?? '',
          influencer_id: influencerId?.toString() ?? '',
        },
        tiktokAccessToken?.token ?? ''
      );

      if (!getTiktokUserResponse.status) {
        triggerToast('error', getTiktokUserResponse.responseMessage);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME);
        router.push('/account-tracking');
        return;
      }

      triggerToast('success', 'Tiktok account connected successfully');
      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

      router.push('/account-tracking');
    },
  });

  // Query to connect the twitter account
  const { isLoading: twitterConnecting } = useQuery({
    queryKey: ['connect-x', code],
    queryFn: async () => {
      if (hasConnectedTwitter) {
        return null;
      }

      if (platform !== 'twitter') {
        return null;
      }

      if (!code) {
        return null;
      }

      setHasConnectedTwitter(true);

      const response = await TwitterService.connectTwitter(userDetails?.userId ?? '', code ?? '');

      if (!response.status) {
        triggerToast('error', response.responseMessage, 'top-right');
        return;
      }

      const userDetailResponse = await UserService.getByUserIdApi(userDetails?.userId);

      if (!userDetailResponse.status) {
        triggerToast('error', userDetailResponse.responseMessage);
        return;
      }

      if (userDetailResponse.responseData) {
        saveUserDetails(userDetailResponse.responseData);
      }

      const saveTwitterAccountResponse = await XInsightsService.saveTwitterAccount(
        AppTokenHelper.getProviderByTokenUsage(userDetailResponse.responseData?.appTokens ?? [], TokenUsageTypeEnum.TWITTER_USER_ACCESS_TOKEN)?.token ?? '',
        userDetails?.userId ?? ''
      );

      if (!saveTwitterAccountResponse.status) {
        triggerToast('error', saveTwitterAccountResponse.responseMessage);
        return;
      }

      triggerToast('success', 'Twitter account connected successfully');
      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

      return router.push('/account-tracking');
    },
  });

  

  // Mutation to unbind the account
  const { mutate: unbindAccount, isLoading: unbindingAccount } = useMutation({
    mutationFn: async (influencer: InfluencerDto) => {
      const response = await InfluencerService.updateInfluencerApi({
        ...influencer,
      });

      if (!response.status) {
        toast.error(response.responseMessage);
        return;
      }

      const updateUserDetailsResponse = await UserService.getByUserIdApi(userDetails?.userId);

      if (!updateUserDetailsResponse.status) {
        toast.error(updateUserDetailsResponse.responseMessage);
        return;
      }

      setDisconnectModalOpen(false);
      saveUserDetails(updateUserDetailsResponse.responseData!);
      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
    },
  });

  // Check if the user has connected the facebook account
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');

      setAccessToken(token);
    } else if (router.query.token) {
      setAccessToken(router.query.token as string);
    }
    return () => {};
  }, [router.query.token]);

  return {
    connectModalOpen,
    setConnectModalOpen,
    disconnectModalOpen,
    setDisconnectModalOpen,
    getFacebookUrl,
    gettingUrl: gettingFacebookUrl || gettingTwitterUrl,
    getTiktokUrl,
    gettingTiktokUrl,
    unbindAccount,
    unbindingAccount,
    getTwitterUrl,
    
    connectingAccount: facebookConnecting || tiktokConnecting || twitterConnecting,
  };
};
