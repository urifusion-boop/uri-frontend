import { CreativeProfileService } from "@/api/CreativeProfileService";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ICreativeFilter } from "../../components/atoms/CustomCreativesFilter";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../useDebounce";

export type FilterFormValues = {
  name: string;
  professionalCategory: boolean;
  casualCategory: boolean;
  type: string;
  fromDate: string;
  toDate: string;
  location: string;
};

export const useViewCreativesHook = () => {
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
  const [filter, setFilter] = useState<ICreativeFilter>({} as ICreativeFilter);
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

  const applyFilter = (data: ICreativeFilter) => {
    setFilter(data);
    if (currentPage !== 1) setCurrentPage(1);
    else fetchCreativesByFilter();
  };

  const { data: creativesData, isLoading: creativesLoading } = useQuery({
    queryKey: ["creatives", currentPage, filter, debouncedSearchTerm],
    queryFn: async () => {
      const shouldFetchBySearch =
        debouncedSearchTerm && debouncedSearchTerm.trim().length > 0;
      const result = shouldFetchBySearch
        ? await fetchCreativesBySearch()
        : await fetchCreativesByFilter();

      if (result.status) return result.responseData?.data;
    },
    enabled: true,
  });

  const fetchCreativesByFilter = async () => {
    const response = await CreativeProfileService.getProfilesByFilterApi({
      pageNumber: currentPage,
      pageSize: 8,
      ...filter,
    });

    handleFetchResponse(response);
    return response;
  };

  const fetchCreativesBySearch = async () => {
    //setLoaded(false);
    const response = await CreativeProfileService.getProfilesBySearchApi({
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
    loaded: creativesLoading,
    navigate,
    applyFilter,
    pagination,
    creatives: creativesData,
    currentPage,
    setCurrentPage,
    setSearchTerm, // Added setSearchTerm
  };
};
