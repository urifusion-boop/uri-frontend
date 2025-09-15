import { ClientProfileService } from "@/api/ClientProfileService";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../useDebounce";
import { AdminProfileService } from "../../api/admin/AdminProfileService";

export type FilterFormValues = {
  name: string;
  professionalCategory: boolean;
  casualCategory: boolean;
  type: string;
  fromDate: string;
  toDate: string;
  location: string;
};

export const useViewClientsHook = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
    totalItems: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? parseInt(router.query.page as string) : 1
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!router.query.page) return;
    setCurrentPage(parseInt(router.query.page as string));
  }, [router.query, router.asPath]);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", currentPage, debouncedSearchTerm],
    queryFn: async () => {
      const shouldFetchBySearch =
        debouncedSearchTerm && debouncedSearchTerm.trim().length > 0;
      const result = shouldFetchBySearch
        ? await fetchClientsBySearch()
        : await fetchClientsByFilter();

      if (result.status) return result.responseData?.data;
    },
    enabled: true,
  });

  const fetchClientsByFilter = async () => {
    const response = await AdminProfileService.getClientProfilesByFilterApi({
      pageNumber: currentPage,
      pageSize: 8
    });

    handleFetchResponse(response);
    return response;
  };

  const fetchClientsBySearch = async () => {
    //setLoaded(false);
    const response = await ClientProfileService.getProfilesBySearchApi({
      pageNumber: 1,
      pageSize: 8,
      searchTerm: debouncedSearchTerm,
    });

    handleFetchResponse(response);
    return response;
  };

  const handleFetchResponse = (response: any) => {
    if (response.status) {
      if (response.responseData) {
        setPagination({
          page: currentPage,
          pageSize: response.responseData.pageSize!,
          totalItems: parseInt(String(response.responseData.pageSize)),
          totalPages: Math.ceil(
            parseInt(String(response.responseData.pageSize)) / 8
          ),
        });
      }
    } else {
      toast.error(response?.responseMessage);
    }
  };

  return {
    loaded: clientsLoading,
    navigate,
    pagination,
    clients: clientsData,
    currentPage,
    setCurrentPage,
    setSearchTerm, // Added setSearchTerm
  };
};
