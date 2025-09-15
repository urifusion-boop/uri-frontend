import { AuthService } from '@/api/AuthService';
import { STORE_KEYS } from '@/configs/store.config';
import { dashboardRoutes } from '@/constants/ClientRoute';
import { getLocalStorageItem } from '@/utils/localStorage.util';
import { ToastService } from '@/utils/toast.util';
import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ClientProfileService } from '../../api/ClientProfileService';
import { CreativeProfileService } from '../../api/CreativeProfileService';
import { UserService } from '../../api/UserService';
import { SecurityHelper } from '../../helpers/SecurityHelper';
import { ClientProfileDto } from '../../models/dtos/ClientProfileDto';
import { CreativeProfileDto } from '../../models/dtos/CreativeProfileDto';
import { UserDto } from '../../models/dtos/UserDto';
import { GenderEnum } from '../../models/enum-models/GenderEnum';
import { UserRoleEnum } from '../../models/enum-models/UserRoleEnums';
import { UserTypeEnum } from '../../models/enum-models/UserTypeEnum';
import { useAuth } from '../../providers/AuthProvider';
import { ITokenDetails } from '../../types';

export const useLoginConfirmationHook = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'confirmed' | 'verified' | 'notConfirmed'>('verified');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { userDetails, saveUserTokens, saveUserDetails, saveClientUserProfile, saveCreativeUserProfile } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setUserEmail(getLocalStorageItem(STORE_KEYS.TEMP_EMAIL));
    }
  }, [setUserEmail]);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const confirmLogin = async (token: string) => {
    // return if request is being made
    if (loading) return;

    setLoading(true);
    const response = await AuthService.confirmLoginApi({
      email: userEmail ?? '',
      token,
    });

    if (response.status && response.responseCode === HttpStatusCode.Ok) {
      const tokenDetails = response?.responseData as ITokenDetails;
      saveUserTokens(tokenDetails);

      const userClaims = SecurityHelper.parseJwt(tokenDetails?.accessToken);
      const userData = await UserService.getByUserIdApi(userClaims?.userId);

      saveUserDetails((userData.responseData as unknown as UserDto) ?? ({} as UserDto));

      if (userClaims) {
        if (userData?.responseData?.role != UserRoleEnum.ADMIN) {
          if (userData?.responseData?.userType === UserTypeEnum.BUSINESS) {
            await handleClientProfile(userClaims.userId!);
          } else {
            await handleCreativeProfile(userClaims.userId!);
          }

          toast.success('Youre logged in and ready to go!');
        }
      } else {
        toast.error('Authentication Failed, Please Login again');
      }
    }

    setStatus(response.status ? 'confirmed' : 'notConfirmed');
    ToastService.showResponseToast(response);
    setLoading(false);
  };

  const continueLogin = () => {
    const dashboardRoute =
      userDetails?.role === UserRoleEnum.ADMIN
        ? dashboardRoutes.dashboardAdmin
        : userDetails?.userType === UserTypeEnum.BUSINESS
          ? dashboardRoutes.dashboardClients
          : dashboardRoutes.dashboardCreatives;

    router.push(dashboardRoute);
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

  return {
    status,
    navigate,
    confirmLogin,
    token,
    setToken,
    loading,
    continueLogin,
  };
};
