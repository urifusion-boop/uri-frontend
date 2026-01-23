import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IUserRoutes, clientUserRoutes, creativeUserRoutes } from '../constants/ClientRoute';

import { STORE_KEYS } from '@/configs/store.config';
import useFeatureLimit from '@/hooks/subscription/featureLimit.hooks';
import { UserDto } from '@/models/dtos/UserDto';
import { UserTypeEnum } from '@/models/enum-models/UserTypeEnum';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { ITokenDetails } from '@/types';
import { useRouter } from 'next/router';
import { ClientProfileDto } from '../models/dtos/ClientProfileDto';
import { CreativeProfileDto } from '../models/dtos/CreativeProfileDto';

interface IAuthContext {
  userDetails: UserDto | null;
  userProfile: ClientProfileDto & CreativeProfileDto;
  tokenDetails: ITokenDetails | null;
  isAuthenticated: boolean;
  isPending: boolean;
  userRoutes: Record<IUserRoutes, string>;
  saveUserDetails: (data: UserDto) => void;
  saveUserTokens: (data: ITokenDetails) => void;
  saveCreativeUserProfile: (data: CreativeProfileDto) => void;
  saveClientUserProfile: (data: ClientProfileDto) => void;
  subscriptionPlanType: string | null;
  saveSubscriptionPlanType: (data: string) => void;
  logoutUser: () => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  saveRememberMeCredentials: (email: string, password: string) => void;
  clearRememberMeCredentials: () => void;
  loadRememberMeCredentials: () => Promise<{
    email?: string;
    password?: string;
  }>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDto | null>(null);
  const [userProfile, setUserProfile] = useState<ClientProfileDto & CreativeProfileDto>({} as ClientProfileDto & CreativeProfileDto);
  const [subscriptionPlanType, setSubscriptionPlanType] = useState<string | null>(null);
  const [tokenDetails, setTokenDetails] = useState<ITokenDetails | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useFeatureLimit(userDetails?.userId ?? '');

  const resetFeatureLimitStore = useFeatureLimitStore((state) => state.resetFeatureLimitStore);
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const [isPending, setIsPending] = useState(true);
  const [userRoutes, setUserRoutes] = useState<Record<IUserRoutes, string>>(creativeUserRoutes); //
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const fetchUserData = () => {
      setIsPending(true);
      // Don't reset isAuthenticated here to prevent UI flash

      const storedUserDetails = localStorage.getItem(STORE_KEYS.USER_DETAILS);
      const storedUserTokens = localStorage.getItem(STORE_KEYS.USER_TOKENS);
      const storedUserProfile = localStorage.getItem(STORE_KEYS.USER_PROFILE);
      const storedSubscriptionPlanType = localStorage.getItem(STORE_KEYS.USER_SUBSCRIPTION_PLAN_TYPE);

      if (storedSubscriptionPlanType) {
        setSubscriptionPlanType(storedSubscriptionPlanType);
      }

      if (storedUserTokens) {
        const tokens: ITokenDetails = JSON.parse(storedUserTokens);
        setTokenDetails(tokens);
        setIsAuthenticated(tokens?.accessToken.length > 0 && tokens?.refreshToken.length > 0);
      } else {
        // No tokens found, user is not authenticated
        setIsAuthenticated(false);
        setTokenDetails(null);
      }

      if (storedUserDetails) {
        const details: UserDto = JSON.parse(storedUserDetails);
        setUserDetails(details);
        if (details.userType === UserTypeEnum.BUSINESS)
          setUserRoutes({
            ...clientUserRoutes,
            profile: `/clients/${details.userId}`,
          });
        else
          setUserRoutes({
            ...creativeUserRoutes,
            profile: `/creatives/${details.userId}`,
          });
      }

      if (storedUserProfile) {
        const profile: ClientProfileDto & CreativeProfileDto = JSON.parse(storedUserProfile);
        setUserProfile(profile);
      }

      setIsPending(false);
    };

    fetchUserData();
  }, [router.route]);

  const saveUserDetails = (details: UserDto) => {
    localStorage.setItem(STORE_KEYS.USER_DETAILS, JSON.stringify(details));
    setUserDetails(details);
  };

  const saveUserTokens = (tokens: ITokenDetails) => {
    localStorage.setItem(STORE_KEYS.USER_TOKENS, JSON.stringify(tokens));
    setTokenDetails(tokens);
    setIsAuthenticated(tokens.accessToken.length > 0 && tokens.refreshToken.length > 0);
  };

  const saveCreativeUserProfile = (data: CreativeProfileDto) => {
    localStorage.setItem(STORE_KEYS.USER_PROFILE, JSON.stringify(data));
    setUserProfile(data);
  };

  const saveClientUserProfile = (data: ClientProfileDto) => {
    localStorage.setItem(STORE_KEYS.USER_PROFILE, JSON.stringify(data));
    setUserProfile(data);
  };

  const saveSubscriptionPlanType = (data: string) => {
    localStorage.setItem(STORE_KEYS.USER_SUBSCRIPTION_PLAN_TYPE, data);
    setSubscriptionPlanType(data);
  };

  useEffect(() => {
    const subscriptionPlan = (featureLimit as any)?.subscriptionPlan;
    if (subscriptionPlan) {
      localStorage.setItem(STORE_KEYS.USER_SUBSCRIPTION_PLAN_TYPE, subscriptionPlan);
      setSubscriptionPlanType(subscriptionPlan);
    }
  }, [featureLimit]);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(STORE_KEYS.USER_DETAILS);
    localStorage.removeItem(STORE_KEYS.USER_TOKENS);
    setUserDetails(null);
    setTokenDetails(null);
    setIsAuthenticated(false);
    resetFeatureLimitStore();
    router.push('/login');
    if (!rememberMe) {
      // clearRememberMeCredentials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRememberMeCredentials = (email: string, password: string) => {
    if (rememberMe) {
      localStorage.setItem(STORE_KEYS.REMEMBER_ME_EMAIL_KEY, email);
      localStorage.setItem(STORE_KEYS.REMEMBER_ME_PASSWORD_KEY, btoa(password)); // Basic encoding
    } else {
      clearRememberMeCredentials();
    }
  };

  const clearRememberMeCredentials = () => {
    localStorage.removeItem(STORE_KEYS.REMEMBER_ME_EMAIL_KEY);
    localStorage.removeItem(STORE_KEYS.REMEMBER_ME_PASSWORD_KEY);
  };

  const loadRememberMeCredentials = async () => {
    const email = localStorage.getItem(STORE_KEYS.REMEMBER_ME_EMAIL_KEY);
    const encodedPassword = localStorage.getItem(STORE_KEYS.REMEMBER_ME_PASSWORD_KEY);

    return {
      email: email || undefined,
      password: encodedPassword ? atob(encodedPassword) : undefined,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        userProfile,
        tokenDetails,
        isAuthenticated,
        isPending,
        userRoutes,
        saveUserDetails,
        saveUserTokens,
        saveCreativeUserProfile,
        saveClientUserProfile,
        logoutUser,
        rememberMe,
        setRememberMe,
        saveRememberMeCredentials,
        clearRememberMeCredentials,
        loadRememberMeCredentials,
        saveSubscriptionPlanType,
        subscriptionPlanType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
