import { AuthService } from '@/api/AuthService';
import { STORE_KEYS } from '@/configs/store.config';
import { authRoutes, dashboardRoutes } from '@/constants/ClientRoute';
import { UserTypeEnum } from '@/models/enum-models/UserTypeEnum';
import { SignupSchema } from '@/models/schema/SignupSchema';
import { ITokenDetails } from '@/types';
import { setLocalStorageItem } from '@/utils/localStorage.util';
import { useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CreativeProfileService } from '../../api/CreativeProfileService';
import { UserService } from '../../api/UserService';
import { SecurityHelper } from '../../helpers/SecurityHelper';
import { CreativeProfileDto } from '../../models/dtos/CreativeProfileDto';
import { UserDto } from '../../models/dtos/UserDto';
import { GenderEnum } from '../../models/enum-models/GenderEnum';
import { useAuth } from '../../providers/AuthProvider';

export const useSignup = () => {
  const router = useRouter();
  const { saveCreativeUserProfile, saveUserDetails, saveUserTokens } = useAuth();

  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  useQuery({
    queryKey: ['creative-signup', router.query, router.asPath],
    queryFn: async () => onGoogleSignUp(String(router.query.code)),
    enabled: router.query.code !== undefined && router.query.code !== null,
  });

  const getGoogleAuth = async (type: string) => {
    if (loading) return;
    setLoading(true);
    const response = await AuthService.getGoogleAuth(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/register/${type}`);
    setLoading(false);
    router.push(response.url);
  };

  const onSubmit = async (data: any, onSuccess?: () => void) => {
    if (loading || googleloading) return;
    setLoading(true);

    const response = await AuthService.signupApi({
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      password: data?.password,
    });

    setLoading(false);
    if (response.status) {
      if (onSuccess && response.responseCode === HttpStatusCode.Created && response.responseData) {
        onSuccess();
        toast.success(response.responseMessage);
        setLocalStorageItem(STORE_KEYS.TEMP_EMAIL, response.responseData?.email ?? '');
        setLocalStorageItem(STORE_KEYS.TEMP_USER_TYPE, UserTypeEnum.CREATIVE);
        return;
      }
      if (response.responseCode === HttpStatusCode.Created && response.responseData) {
        toast.success(response.responseMessage);
        setLocalStorageItem(STORE_KEYS.TEMP_EMAIL, response.responseData?.email ?? '');
        setLocalStorageItem(STORE_KEYS.TEMP_USER_TYPE, UserTypeEnum.CREATIVE);

        // navigate to verify email
        router.push(authRoutes.emailVerification);
      } else {
        toast.error(response.responseMessage);
      }
    } else {
      if (response.responseCode === HttpStatusCode.Conflict) setUserExists(true);
      toast.error(response.responseMessage);
    }
  };

  const onGoogleSignUp = async (code: string) => {
    if (loading || googleloading || !code) return;
    setGoogleLoading(true);
    const response = await AuthService.signupWithGoogleApi({
      code,
      redirectUri: `${process.env.NEXT_PUBLIC_CLIENT_HOST}/auth/creative`,
      userType: UserTypeEnum.CREATIVE,
    });
    if (response.status) {
      if (response.responseCode === HttpStatusCode.Created && response.responseData) {
        const tokenDetails = response?.responseData as ITokenDetails;
        saveUserTokens(tokenDetails);

        const userClaims = SecurityHelper.parseJwt(tokenDetails?.accessToken);
        const userData = await UserService.getByUserIdApi(userClaims?.userId);

        saveUserDetails((userData.responseData as unknown as UserDto) ?? ({} as UserDto));

        if (userClaims) await handleCreativeProfile(userClaims.userId!);

        toast.success(response?.responseMessage);

        // Check if user has completed onboarding
        const user = userData.responseData as unknown as UserDto;
        if (user?.onboardingCompleted) {
          // User has completed onboarding - redirect to their primary module or dashboard
          router.push(dashboardRoutes.dashboardCreatives);
        } else {
          // User hasn't completed onboarding - redirect to welcome screen
          router.push('/onboarding/welcome');
        }
      } else {
        toast.error(response.responseMessage);
        setGoogleLoading(false);
      }
    } else {
      if (response.responseCode === HttpStatusCode.Conflict) setUserExists(true);
      toast.error(response.responseMessage);
      setGoogleLoading(false);
    }
  };

  const handleCreativeProfile = async (userId: string) => {
    await CreativeProfileService.getProfileStatusByUserIdApi(userId);
    let profileResponse = await CreativeProfileService.getProfileByUserIdApi(userId);
    if (!profileResponse.status && profileResponse.responseCode === HttpStatusCode.NotFound) {
      profileResponse = await CreativeProfileService.createProfileApi({
        userId,
        gender: GenderEnum.MALE,
      }); // Consider gender handling
    }
    saveCreativeUserProfile(profileResponse.responseData as CreativeProfileDto);
  };

  return {
    onSubmit,
    navigate,
    SignupSchema,
    googleloading,
    loading,
    userExists,
    setUserExists,
    getGoogleAuth,
  };
};
