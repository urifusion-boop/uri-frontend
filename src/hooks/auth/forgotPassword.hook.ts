import { authRoutes } from "@/constants/ClientRoute";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z, string } from "zod";
import { setLocalStorageItem } from "@/utils/localStorage.util";
import { STORE_KEYS } from "@/configs/store.config";
import { AuthService } from "@/api/AuthService";

export type ForgotPasswordValue = {
  email: string;
};

export const useForgotPasswordHook = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const ForgotPasswordSchema = z.object({
    email: string().email(),
  });

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const onSubmit: SubmitHandler<ForgotPasswordValue> = async (data) => {
    // return if request is being made
    if (loading) {
      return;
    }
    setLoading(true);
    const response = await AuthService.forgotPasswordApi({
      email: data?.email,
    });

    if (response.status) {
      toast.success(response.responseMessage);
      navigate(authRoutes.resetPassword);
      setLocalStorageItem(STORE_KEYS.TEMP_EMAIL, data?.email);
    } else {
      toast.error(response.responseMessage);
    }

    setLoading(false);
  };

  return {
    onSubmit,
    ForgotPasswordSchema,
    loading,
  };
};
