import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { NavigatorHelper } from "../../helpers/NavigatorHelper";
import { FaBriefcase, FaCircleNodes } from "react-icons/fa6";

export const useClientsDashHook = () => {
  const router = useRouter();
  const { userDetails, userProfile } = useAuth();

  const tabButtons = [
    {
      label: "Overview",
      value: "overview",
      icon: FaCircleNodes,
    },
  ];

  useEffect(() => {
    if (userDetails)
      NavigatorHelper.PushNotificationSubscribe(userDetails, (message) =>
        toast(message)
      );
  }, [userDetails]);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  return {
    navigate,
    userDetails,
    userProfile,
    tabButtons,
  };
};
