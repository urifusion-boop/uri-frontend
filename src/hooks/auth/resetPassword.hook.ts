import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { getLocalStorageItem } from "@/utils/localStorage.util";
import { toast } from "react-hot-toast";
import { STORE_KEYS } from "@/configs/store.config";
import { AuthService } from "@/api/AuthService";
import { ResetPasswordDto } from "@/models/dtos/AuthDto";
import { ResetPasswordFormValues } from "@/types";
import { ResetPasswordSchema } from "@/models/schema/ResetPasswordSchema";

export const useResetPasswordHook = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      setUserEmail(getLocalStorageItem(STORE_KEYS.TEMP_EMAIL));
    }
  }, [setUserEmail]);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    // return if request is being made
    if (loading) {
      return;
    }
    setLoading(true);
    const resetPasswordDto = new ResetPasswordDto({
      newPassword: data?.password,
      email: getLocalStorageItem(STORE_KEYS.TEMP_EMAIL) || "",
      token: data?.token,
    });

    const response = await AuthService.resetPasswordApi(resetPasswordDto);

    if (
      response.status &&
      response.responseMessage === "Password changed successfully"
    ) {
      toast.success(response.responseMessage);
      router.push("password-reset-successful");
      //navigate
    } else {
      response.responseMessage === "Invalid Data"
        ? toast.error("Please check your otp and try again")
        : toast.error(response.responseMessage);
    }
    setLoading(false);
  };

  const onResendCode = async () => {
    setResendingCode(true);
    const response = await AuthService.forgotPasswordApi({
      email: getLocalStorageItem(STORE_KEYS.TEMP_EMAIL) || "",
    });

    if (response.status) {
      toast.success("Code resent successfully");
      setSeconds(60);
    } else {
      toast.error(response.responseMessage);
    }

    setResendingCode(false);
  };

  return {
    onSubmit,
    ResetPasswordSchema,
    loading,
    onResendCode,
    resendingCode,
    seconds,
    setSeconds,
  };
};
