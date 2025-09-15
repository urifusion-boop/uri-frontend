import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z, string, boolean } from "zod";
import { AnalyticsService } from "../../api/AnalyticsService";
import { CreativeProfileDto } from "../../models/dtos/CreativeProfileDto";
import { NavigatorHelper } from "../../helpers/NavigatorHelper";

export type FilterFormValues = {
  name: string;
  professionalCategory: boolean;
  casualCategory: boolean;
  type: string;
  fromDate: string;
  toDate: string;
  location: string;
};

export const useAdminDashHook = () => {
  const router = useRouter();
  const { userDetails, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [creatives] = useState<CreativeProfileDto[]>([]);
  const [pagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 100,
    totalPages: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalCreatives, setTotalCreatives] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);

  useEffect(() => {
    if (userDetails)
      NavigatorHelper.PushNotificationSubscribe(userDetails, (message) =>
        toast(message)
      );
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Replace this with your actual data fetching logic
  }, [userDetails]);

  useEffect(() => {
    fetchAnalytics();
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

  const fetchAnalytics = async () => {
    AnalyticsService.getTotalCreatives().then((res) =>
      res.status && res.responseData
        ? setTotalCreatives(res.responseData)
        : null
    );
    AnalyticsService.getTotalClients().then((res) =>
      res.status && res.responseData ? setTotalClients(res.responseData) : null
    );
  };

  const onSubmit: SubmitHandler<FilterFormValues> = async () => {
    return;
  };

  return {
    onSubmit,
    analytics: {
      totalCreatives,
      totalClients,
      totalUsers: Number(totalCreatives) + Number(totalClients),
    },
    navigate,
    filterSchema,
    loading,
    pagination,
    creatives,
    currentPage,
    setCurrentPage,
  };
};
