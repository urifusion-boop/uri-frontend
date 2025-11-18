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
import { TextHelper } from '@/helpers/TextHelper';
import { ApiScopeEnum } from '@/models/enum-models/ApiScopeEnum';
import { SocialMediaEnum } from '@/models/enum-models/SocialMediaEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

type deleteInfluencerType = {
  influencerId: string;
  platform: string;
};

export const useConnectedAccountsHook = (closeDeleteModal?: () => void, redirectUrl?: string, successRedirectUrl?: string) => {
  const router = useRouter();
  const { userDetails, saveUserDetails } = useAuth();

  const [hasConnectedTwitter, setHasConnectedTwitter] = useState(false);
  
  const [hasConnectedFacebook, setHasConnectedFacebook] = useState(false);
  const [hasConnectedTiktok, setHasConnectedTiktok] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedPlatformForDisConnect, setSelectedPlatformForDisConnect] = useState<deleteInfluencerType>({
    influencerId: '',
    platform: '',
  });

  const code = router?.query?.code as string;
  const platform = getLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME);

  const { data: connectedAccountsWithTokens, isLoading: gettingConnectedAccounts } = useQuery({
    queryKey: ['influencers'],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencersByFilters({
        limit: 10,
        skip: 0,
        connected: true,
        user_id: userDetails?.userId ?? '',
      });
      return response.responseData;
    },
  });

  // Twitter Authentication
  const { mutate: getTwitterUrl, isLoading: gettingTwitterUrl } = useMutation({
    mutationFn: async () => {
      const response = await TwitterService.getAuthUrl(redirectUrl ?? '');
      setLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME, 'twitter');

      if (response.status) {
        router.push(response.responseData ?? '');
      } else {
        toast.error(response.responseMessage);
      }
    },
  });

  

  // Facebook Authentication
  const { mutate: getFacebookUrl, isLoading: gettingFacebookUrl } = useMutation({
    mutationFn: async () => {
      const response = await FacebookService.getAuthUrl(redirectUrl || '');
      setLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME, 'facebook');

      if (response.status) {
        router.push(response.responseData?.url ?? '');
      } else {
        toast.error(response.responseMessage);
      }
    },
  });

  // Tiktok Authentication Mutation function
  const { mutate: getTiktokUrl, isLoading: gettingTiktokUrl } = useMutation({
    mutationFn: async (influencerName?: string) => {
      if (!influencerName) return triggerToast('error', 'Influencer name is required for Tiktok account connection');

      const createInfluencerAccountResponse = await InfluencerService.createInfluencerApi({
        user_id: userDetails?.userId ?? '',
        email: userDetails?.email ?? '',
        social_username: influencerName,
        social_platform: SocialMediaEnum.TIKTOK,
      });

      if (!createInfluencerAccountResponse.status) {
        return triggerToast('error', createInfluencerAccountResponse.responseMessage);
      }

      const response = await TiktokService.getAuthUrl(redirectUrl || '');
      if (response.status) {
        if (!createInfluencerAccountResponse.responseData?.influencer_id) {
          return triggerToast('error', 'Influencer ID not found');
        }

        setLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID, createInfluencerAccountResponse.responseData?.influencer_id);
        setLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME, influencerName);
        setLocalStorageItem(STORE_KEYS.TEMP_CONNECT_ACCOUNT_NAME, 'tiktok');

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
        return;
      }

      if (platform !== 'facebook') {
        return;
      }

      if (!accessToken) {
        return;
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
        router.push(redirectUrl ?? '/content-management/create?active_tab=platforms');
      }

      triggerToast('success', 'Facebook account connected successfully');
      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

      router.push(redirectUrl ?? '/content-management/create?active_tab=platforms');
    },
  });

  // Query to connect the tiktok account
  const { isLoading: tiktokConnecting } = useQuery({
    queryKey: ['connect-tiktok', code],
    queryFn: async () => {
      if (hasConnectedTiktok) {
        return;
      }

      if (platform !== 'tiktok') {
        return;
      }

      if (!code) {
        return;
      }

      setHasConnectedTiktok(true);

      const influencerId = getLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID);
      const influencerName = getLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME);

      // Call the connect function to connect the account first
      const response = await TiktokService.connectTiktok(userDetails?.userId ?? '', code ?? '', redirectUrl);

      if (!response.status) {
        triggerToast('error', response.responseMessage);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_ID);
        removeLocalStorageItem(STORE_KEYS.TEMP_INFLUENCER_NAME);
        router.push(redirectUrl ?? '/content-management/create?active_tab=platforms');
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
        router.push(redirectUrl ?? '/content-management/create?active_tab=platforms');
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
        router.push(redirectUrl ?? '/content-management/create?active_tab=platforms');
        return;
      }

      triggerToast('success', 'Tiktok account connected successfully');
      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
      router.push(redirectUrl ?? '/content-management/create?active_tab=platforms');
    },
  });

  // Query to connect the twitter account
  const { isLoading: twitterConnecting } = useQuery({
    queryKey: ['connect-x', code],
    queryFn: async () => {
      if (hasConnectedTwitter) {
        return;
      }

      if (platform !== 'twitter') {
        return;
      }

      if (!code) {
        return;
      }

      setHasConnectedTwitter(true);

      const response = await TwitterService.connectTwitter(userDetails?.userId ?? '', code ?? '', redirectUrl);

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

      return router.push(successRedirectUrl ?? '/content-management/create?active_tab=platforms');
    },
  });

  

  const getAuthUrlFunction = (platform: string, username?: string) => {
    switch (platform) {
      case SocialMediaEnum.TWITTER:
        getTwitterUrl();
        break;
      case SocialMediaEnum.LINKEDIN:
        break;
      case SocialMediaEnum.FACEBOOK:
        getFacebookUrl();
        break;
      case SocialMediaEnum.TIKTOK:
        getTiktokUrl(username);
        break;
      default:
        break;
    }
  };

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

  // Disconnect accounts functions
  const disconnectAccount = useMutation({
    mutationFn: async () => {
      const response = await InfluencerService.updateInfluencerApi({
        influencer_id: selectedPlatformForDisConnect.influencerId,
        connected: false,
        user_id: userDetails?.userId,
      });

      if (!response.status) {
        triggerToast('error', response.responseMessage);
        return;
      }

      triggerToast('success', `${TextHelper.capitalize(selectedPlatformForDisConnect.platform)} account disconnected successfully`);

      queryClient.invalidateQueries({
        queryKey: ['influencers'],
      });
      queryClient.invalidateQueries({ queryKey: ['feature-limit'] });
      closeDeleteModal && closeDeleteModal();
    },
  });

  return {
    connectedAccounts: connectedAccountsWithTokens?.data ?? [],
    isConnecting: gettingTwitterUrl || gettingFacebookUrl || gettingTiktokUrl,
    getAuthUrlFunction,
    connectingAccount: facebookConnecting || tiktokConnecting || twitterConnecting,
    gettingConnectedAccounts,
    disconnectAccount,
    selectedPlatformForDisConnect,
    setSelectedPlatformForDisConnect,
  };
};
