import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z, string, boolean } from "zod";
import { NavigatorHelper } from "../../helpers/NavigatorHelper";
import { FaCircleNodes } from "react-icons/fa6";

export type FilterFormValues = {
  name: string;
  professionalCategory: boolean;
  casualCategory: boolean;
  type: string;
  fromDate: string;
  toDate: string;
  location: string;
};

const tabButtons = [
  {
    label: "Overview",
    value: "overview",
    icon: FaCircleNodes,
  },
];

export const useCreativesDashHook = () => {
  const router = useRouter();
  const { userDetails, userProfile } = useAuth();
  const [, setLoaded] = useState(false);
  const [pagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 100,
    totalPages: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setLoaded(false);

    if (userDetails)
      NavigatorHelper.PushNotificationSubscribe(userDetails, (message) =>
        toast(message)
      );
  }, [userDetails]);

  useEffect(() => {
    setLoaded(false);
  }, [userProfile]);

  const filterSchema = z.object({
    name: string().min(2, { message: "Please enter up to 3 characters." }),
    professionalCategory: boolean(),
    casualCategory: boolean(),
    type: string(),
    fromDate: string(),
    toDate: string(),
    location: string(),
  });

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const onSubmit: SubmitHandler<FilterFormValues> = async () => {
    return;
  };

  return {
    onSubmit,
    analytics: {},
    navigate,
    filterSchema,
    pagination,
    currentPage,
    setCurrentPage,
    tabButtons,
  };
};
