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
      const tokenDetails = response?.responseData as ITokenDetails;

      if (tokenDetails?.accessToken && tokenDetails?.refreshToken) {
        // Save tokens
        saveUserTokens(tokenDetails);

        // Get user details
        const userClaims = SecurityHelper.parseJwt(tokenDetails?.accessToken);
        const userData = await UserService.getByUserIdApi(userClaims?.userId);

        // Save user details
        saveUserDetails((userData.responseData as unknown as UserDto) ?? ({} as UserDto));
      }

      setStatus("confirmed");
    } else {
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
