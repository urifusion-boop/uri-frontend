import { AuthService } from "@/api/AuthService";
import { authRoutes } from "@/constants/ClientRoute";
import { getLocalStorageItem } from "@/utils/localStorage.util";
import { ToastService } from "@/utils/toast.util";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const useEmailVerificationHook = () => {
  const router = useRouter();
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

    setStatus(response.status ? "confirmed" : "notConfirmed");
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
    navigate(authRoutes.login);
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
