import { AuthService } from "@/api/AuthService";
import { UserService } from "@/api/UserService";
import { authRoutes } from "@/constants/ClientRoute";
import { getLocalStorageItem } from "@/utils/localStorage.util";
import { ToastService } from "@/utils/toast.util";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { SecurityHelper } from "@/helpers/SecurityHelper";
import { UserDto } from "@/models/dtos/UserDto";
import { ITokenDetails } from "@/types";

export const useEmailVerificationHook = () => {
  const router = useRouter();
  const { saveUserDetails, saveUserTokens } = useAuth();
  const [status, setStatus] = useState<
    "confirmed" | "verified" | "notConfirmed"
  >("verified");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const localEmail = getLocalStorageItem("@URI@TEMP_EMAIL");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      setUserEmail(localEmail as string);
    }
  }, [setUserEmail, localEmail]);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const verifyEmail = async (token: string) => {
    // return if request is being made
    if (loading) {
      return;
    }
    setLoading(true);
    const response = await AuthService.confirmEmailApi({
      email: userEmail ?? "",
      token,
    });

    if (response.status) {
      // Email verified successfully - auto-login the user
      const responseData = response?.responseData as any;

      console.log('Email verification response:', {
        hasResponseData: !!responseData,
        hasAccessToken: !!responseData?.accessToken,
        hasRefreshToken: !!responseData?.refreshToken,
        hasUser: !!responseData?.user
      });

      if (responseData?.accessToken && responseData?.refreshToken) {
        // Save tokens
        const tokenDetails: ITokenDetails = {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken,
        };

        console.log('Saving tokens to localStorage...');
        saveUserTokens(tokenDetails);
        console.log('Tokens saved successfully');

        // If user data is included in the response, save it directly
        if (responseData?.user) {
          console.log('Saving user details from response...');
          saveUserDetails(responseData.user as UserDto);
        } else {
          // Otherwise, fetch user details
          try {
            console.log('Fetching user details...');
            const userClaims = SecurityHelper.parseJwt(tokenDetails?.accessToken);
            const userData = await UserService.getByUserIdApi(userClaims?.userId);
            saveUserDetails((userData.responseData as unknown as UserDto) ?? ({} as UserDto));
            console.log('User details saved successfully');
          } catch (error) {
            console.error('Error fetching user details after email verification:', error);
            // Continue anyway - user is verified and tokens are saved
          }
        }
      } else {
        console.error('Missing tokens in response:', responseData);
      }

      setStatus("confirmed");
    } else {
      console.error('Email verification failed:', response);
      setStatus("notConfirmed");
    }

    ToastService.showResponseToast(response);
    setLoading(false);
  };

  const resendVerificationEmail = async () => {
    // return if request is being made
    if (loading || typeof userEmail !== "string") {
      return;
    }
    const response = await AuthService.resendConfirmationEmailApi({
      email: userEmail,
    });
    ToastService.showResponseToast(response);
  };

  const continueSetup = () => {
    navigate('/onboarding/welcome');
  };

  return {
    status,
    navigate,
    verifyEmail,
    resendVerificationEmail,
    token,
    setToken,
    loading,
    continueSetup,
  };
};
