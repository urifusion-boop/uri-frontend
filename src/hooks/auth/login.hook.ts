import { AuthService } from '@/api/AuthService';
import { ClientProfileService } from '@/api/ClientProfileService';
import { CreativeProfileService } from '@/api/CreativeProfileService';
import { SubscriptionService } from '@/api/SubscriptionService';
import { OnboardingService } from '@/api/OnboardingService';
import { LeadsService } from '@/api/LeadFormService';
import { STORE_KEYS } from '@/configs/store.config';
import { dashboardRoutes } from '@/constants/ClientRoute';
import { SecurityHelper } from '@/helpers/SecurityHelper';
import { ClientProfileDto } from '@/models/dtos/ClientProfileDto';
import { CreativeProfileDto } from '@/models/dtos/CreativeProfileDto';
import { UserDto } from '@/models/dtos/UserDto';
import { GenderEnum } from '@/models/enum-models/GenderEnum';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { UserTypeEnum } from '@/models/enum-models/UserTypeEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { LoginSchema } from '@/models/schema/LoginSchema';
import { useAuth } from '@/providers/AuthProvider';
import { ITokenDetails, LoginFormValues } from '@/types';
import { setLocalStorageItem } from '@/utils/localStorage.util';
import { useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { UserService } from '../../api/UserService';
import { LoginResponseDto } from '../../models/dtos/LoginResponseDto';
import { UserRoleEnum } from '../../models/enum-models/UserRoleEnums';

export const useLoginHook = () => {
  const router = useRouter();
  const { saveUserDetails, saveUserTokens, saveCreativeUserProfile, saveClientUserProfile, saveRememberMeCredentials, rememberMe, saveSubscriptionPlanType } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleLoading] = useState(false);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  useQuery({
    queryKey: ['login', router.query, router.asPath],
    queryFn: async () => onGoogleSignIn(String(router.query.code)),
    enabled: router.query.code !== undefined && router.query.code !== null,
  });

  const getGoogleAuth = async () => {
    if (loading || googleloading) return;
    const response = await AuthService.getGoogleAuth(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/login`);

    if (response?.url) router.push(response?.url);
  };

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (loading || googleloading) return;
    setLoading(true);

    try {
      const response = await AuthService.loginApi(data);
      completeSignIn(response, data);

      if (rememberMe) {
        saveRememberMeCredentials(data.email, data.password);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async (code: string) => {
    if (loading || googleloading || !code) return;
    setGoogleLoading(true);
    const response = await AuthService.loginWithGoogleApi({
      code,
      redirectUri: `${process.env.NEXT_PUBLIC_CLIENT_HOST}/${process.env.NEXT_PUBLIC_REDIRECT_PATH}`,
      userType: UserTypeEnum.CREATIVE,
    });
    completeSignIn(response);
  };

  const completeSignIn = async (response: UriResponse<LoginResponseDto>, data?: LoginFormValues) => {
    if (response.status && response.responseCode === HttpStatusCode.Ok && response.responseData?.accessToken) {
      const tokenDetails = response?.responseData as ITokenDetails;
      saveUserTokens(tokenDetails);

      const userClaims = SecurityHelper.parseJwt(tokenDetails?.accessToken);
      const userData = await UserService.getByUserIdApi(userClaims?.userId);

      saveUserDetails((userData.responseData as unknown as UserDto) ?? ({} as UserDto));

      if (userClaims) {
        if (userData?.responseData?.role === UserRoleEnum.ADMIN) router.push(dashboardRoutes.dashboardAdmin);
        else {
          const response = await SubscriptionService.getActiveSubscriptionByEmail(userClaims?.email!);
          console.log('subscription response : ', response);
          saveSubscriptionPlanType(response?.responseData?.plan?.name ?? SubscriptionTypeEnum.FreeTrial);

          if (userData?.responseData?.userType === UserTypeEnum.BUSINESS) {
            await handleClientProfile(userClaims.userId!);
          } else {
            await handleCreativeProfile(userClaims.userId!);
          }

          toast.success("You're logged in and ready to go!");
          await navigateUser(userData?.responseData?.userType!, userClaims.userId!);
        }
      } else {
        toast.error('Authentication Failed, Please Login again');
        setGoogleLoading(false);
      }
    } else {
      if (response.responseMessage.includes('confirm your email')) {
        const errorRes: any = response;
        setLocalStorageItem(STORE_KEYS.TEMP_EMAIL, data?.email ?? '');
        router.push('/email-verification');
      }
      if (response.responseMessage.includes('Login confirmation required')) {
        const errorRes: any = response;
        setLocalStorageItem(STORE_KEYS.TEMP_EMAIL, errorRes.responseData?.email ?? '');
        router.push('/admin/login-confirmation');
      }
      toast.error(response?.responseMessage);
      setGoogleLoading(false);
    }
  };

  const handleClientProfile = async (userId: string) => {
    await ClientProfileService.getProfileStatusByUserIdApi(userId);
    let profileResponse = await ClientProfileService.getProfileByUserIdApi(userId);
    if (!profileResponse.status && profileResponse.responseCode === HttpStatusCode.NotFound) {
      profileResponse = await ClientProfileService.createProfileApi({ userId });
    }
    saveClientUserProfile(profileResponse.responseData as ClientProfileDto);
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

  const navigateUser = async (userType: string, userId: string) => {
    try {
      // Check if user has completed onboarding
      const onboardingStatus = await OnboardingService.getOnboardingStatus(userId);

      if (onboardingStatus.status && onboardingStatus.responseData) {
        const { onboardingCompleted, lastAccessedModule, primaryModule } = onboardingStatus.responseData;

        // If onboarding not completed, redirect to welcome screen
        if (!onboardingCompleted) {
          router.push('/onboarding/welcome');
          return;
        }

        const moduleRoutes: Record<string, string> = {
          'account-tracking': '/account-tracking',
          'keyword-tracking': '/keyword-tracking/overview',
          'hashtag-tracking': '/hashtag-tracking',
          'report-generation': '/report-generation',
          'individual-leads': '/leads-tracking/forms/leads?type=individual',
          'organization-leads': '/leads-tracking/forms/leads?type=organization',
          'conversational-leads': '/leads-tracking/forms/leads?type=conversational',
        };

        // Helper to get lead route based on whether user has leads
        const getLeadModuleRoute = async (moduleId: string, userId: string): Promise<string> => {
          const leadTypeMap: Record<string, string> = {
            'individual-leads': 'PERSON',
            'organization-leads': 'ORGANIZATION',
            'conversational-leads': 'CONVERSATIONAL',
          };

          const leadType = leadTypeMap[moduleId];
          if (leadType) {
            const hasLeads = await LeadsService.hasLeadsByType(userId, leadType);
            if (hasLeads) {
              // Has leads - go to list page
              return moduleRoutes[moduleId];
            } else {
              // No leads - go to form page
              const formRoutes: Record<string, string> = {
                'individual-leads': '/leads-tracking/forms/manage?type=individual',
                'organization-leads': '/leads-tracking/forms/manage?type=organization',
                'conversational-leads': '/leads-tracking/forms/manage?type=conversational',
              };
              return formRoutes[moduleId];
            }
          }
          return moduleRoutes[moduleId];
        };

        // Priority 1: If user has a last accessed module, redirect them there
        if (lastAccessedModule) {
          const moduleRoute = moduleRoutes[lastAccessedModule];
          if (moduleRoute) {
            // Check if it's a lead module that needs special routing
            if (lastAccessedModule.includes('-leads')) {
              const route = await getLeadModuleRoute(lastAccessedModule, userId);
              router.push(route);
              return;
            }
            router.push(moduleRoute);
            return;
          }
        }

        // Priority 2: Fallback to primary module (selected during onboarding)
        if (primaryModule) {
          const moduleRoute = moduleRoutes[primaryModule];
          if (moduleRoute) {
            // Check if it's a lead module that needs special routing
            if (primaryModule.includes('-leads')) {
              const route = await getLeadModuleRoute(primaryModule, userId);
              router.push(route);
              return;
            }
            router.push(moduleRoute);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If error checking onboarding, continue to dashboard (don't block user)
    }

    // User has completed onboarding or check failed, go to dashboard
    const dashboardRoute = userType === UserTypeEnum.BUSINESS ? dashboardRoutes.dashboardClients : dashboardRoutes.dashboardCreatives;
    router.push(dashboardRoute);
  };

  return {
    onSubmit,
    navigate,
    LoginSchema,
    loading,
    getGoogleAuth,
    googleloading,
  };
};
